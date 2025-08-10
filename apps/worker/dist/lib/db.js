import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "orpa.db");
function ensureDir(p) {
    if (!fs.existsSync(p))
        fs.mkdirSync(p, { recursive: true });
}
export function openDb() {
    ensureDir(DATA_DIR);
    const db = new Database(DB_PATH);
    // Basic pragma for safer defaults
    db.pragma("journal_mode = WAL");
    db.pragma("synchronous = NORMAL");
    // Auto-migrate (simple)
    db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tx (
      hash TEXT PRIMARY KEY,
      block_height INTEGER NOT NULL,
      block_timestamp INTEGER,
      signer_id TEXT,
      receiver_id TEXT,
      status TEXT,
      receipt_count INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_tx_block_height ON tx(block_height);
    CREATE INDEX IF NOT EXISTS idx_tx_parties ON tx(signer_id, receiver_id);
  `);
    return db;
}
export function getMeta(db, key) {
    const row = db.prepare("SELECT value FROM meta WHERE key = ?").get(key);
    return row ? String(row.value) : null;
}
export function setMeta(db, key, value) {
    db.prepare(`
    INSERT INTO meta(key, value) VALUES(?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(key, value);
}
