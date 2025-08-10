import fs from "fs";
import path from "path";
import { openDb, getMeta, setMeta } from "../lib/db.js";
import { getFinalBlock, getBlockByHeight, getChunkTransactions } from "../lib/near-blocks.js";
function loadWatchlist() {
    const p = path.join(process.cwd(), "config", "watchlist.json");
    const raw = fs.readFileSync(p, "utf-8");
    const json = JSON.parse(raw);
    // normalize to lowercase (NEAR ids are case-insensitive, but better to be consistent)
    json.accounts = json.accounts.map(a => a.toLowerCase());
    return json;
}
function matchWatchlist(tx, wl) {
    const signer = String(tx.signer_id ?? "").toLowerCase();
    const receiver = String(tx.receiver_id ?? "").toLowerCase();
    return wl.accounts.includes(signer) || wl.accounts.includes(receiver);
}
function upsertTx(db, tx) {
    db.prepare(`
    INSERT INTO tx(hash, block_height, block_timestamp, signer_id, receiver_id, status, receipt_count)
    VALUES(@hash, @block_height, @block_timestamp, @signer_id, @receiver_id, @status, @receipt_count)
    ON CONFLICT(hash) DO UPDATE SET
      block_height = excluded.block_height,
      block_timestamp = COALESCE(excluded.block_timestamp, tx.block_timestamp),
      signer_id = COALESCE(excluded.signer_id, tx.signer_id),
      receiver_id = COALESCE(excluded.receiver_id, tx.receiver_id),
      status = COALESCE(excluded.status, tx.status),
      receipt_count = COALESCE(excluded.receipt_count, tx.receipt_count)
  `).run(tx);
}
export async function scanRecentBlocks(nBlocks) {
    const db = openDb();
    const wl = loadWatchlist();
    const final = await getFinalBlock();
    const tipHeight = final.height;
    // Option A: resume from where we left off
    const last = getMeta(db, "last_scanned_height");
    let start = last ? Number(last) + 1 : tipHeight - nBlocks + 1;
    if (start < tipHeight - nBlocks + 1)
        start = tipHeight - nBlocks + 1;
    if (start < 1)
        start = 1;
    console.log(`Scanning blocks ${start}..${tipHeight} (final) for ${wl.accounts.length} accounts...`);
    const insert = db.transaction((rows) => {
        for (const row of rows)
            upsertTx(db, row);
    });
    for (let h = start; h <= tipHeight; h++) {
        const b = await getBlockByHeight(h);
        const rowsToInsert = [];
        for (const chunk of b.chunks) {
            const txs = await getChunkTransactions(chunk.chunk_hash);
            for (const tx of txs) {
                if (!matchWatchlist(tx, wl))
                    continue;
                // basic normalization
                rowsToInsert.push({
                    hash: tx.hash,
                    block_height: b.height,
                    block_timestamp: b.timestamp, // ns since epoch
                    signer_id: tx.signer_id,
                    receiver_id: tx.receiver_id,
                    status: "unknown", // we'll enrich later via txStatus if needed
                    receipt_count: Array.isArray(tx.actions) ? tx.actions.length : 0
                });
            }
        }
        if (rowsToInsert.length)
            insert(rowsToInsert);
        // remember progress every block
        setMeta(db, "last_scanned_height", String(h));
        if ((h - start) % 50 === 0) {
            console.log(`...at height ${h}, inserted ${rowsToInsert.length} txs`);
        }
    }
    console.log("Scan complete.");
}
