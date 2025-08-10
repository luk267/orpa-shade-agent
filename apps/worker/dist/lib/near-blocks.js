import { rpc } from "./near.js";
export async function getFinalBlock() {
    const provider = rpc();
    const res = await provider.block({ finality: "final" });
    return normalizeBlock(res);
}
export async function getBlockByHeight(height) {
    const provider = rpc();
    const res = await provider.block({ blockId: height });
    return normalizeBlock(res);
}
function normalizeBlock(res) {
    return {
        height: res.header.height,
        hash: res.header.hash,
        timestamp: Number(res.header.timestamp), // ns
        chunks: res.chunks.map((c) => ({ chunk_hash: c.chunk_hash })),
    };
}
export async function getChunkTransactions(chunkHash) {
    const provider = rpc();
    const chunk = await provider.chunk(chunkHash);
    // `transactions` array: { signer_id, receiver_id, hash, ... }
    return chunk.transactions ?? [];
}
