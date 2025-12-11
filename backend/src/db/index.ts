// backend/src/db/index.ts
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { ENV } from "../config/env";

const dbFilePath = path.resolve(process.cwd(), ENV.DB_PATH);

// Instance DB dùng cho toàn app
export const db = new Database(dbFilePath);

// ===== Helpers dùng với async/await =====

// SELECT: trả về { rows: T[] }
export async function query<T = any>(
  sql: string,
  params: any[] = []
): Promise<{ rows: T[] }> {
  const stmt = db.prepare(sql);
  const rows = stmt.all(...params) as T[];
  return { rows };
}

// INSERT/UPDATE/DELETE: không cần trả gì
export async function run(sql: string, params: any[] = []): Promise<void> {
  const stmt = db.prepare(sql);
  stmt.run(...params);
}

// ===== Migrations =====
export function runMigrations(): void {
  const migrationsDir = path.join(__dirname, "migrations");

  if (!fs.existsSync(migrationsDir)) {
    console.warn("No migrations directory found");
    return;
  }

  // Bật foreign key
  db.exec("PRAGMA foreign_keys = ON;");

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const fullPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(fullPath, "utf-8");
    console.log(`Running migration: ${file}`);
    db.exec(sql);
  }
}
