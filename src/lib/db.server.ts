import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const dataDir = join(process.cwd(), "data");
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const db = new Database(join(dataDir, "app.db"));
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);

const getStmt = db.prepare("SELECT value FROM content WHERE key = ?");
const setStmt = db.prepare(
  "INSERT INTO content (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
);

export function getContent<T>(key: string, fallback: T): T {
  const row = getStmt.get(key) as { value: string } | undefined;
  if (!row) return fallback;
  return JSON.parse(row.value) as T;
}

export function setContent<T>(key: string, value: T): void {
  setStmt.run(key, JSON.stringify(value), new Date().toISOString());
}
