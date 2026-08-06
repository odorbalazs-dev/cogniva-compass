import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { config } from "./config.js";

const { Pool } = pg;
let pool = null;

export function hasDatabase() {
  return Boolean(config.databaseUrl);
}

export function database() {
  if (!hasDatabase()) throw new Error("DATABASE_URL is not configured.");
  if (!pool) {
    pool = new Pool({
      connectionString: config.databaseUrl,
      max: 8,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined
    });
    pool.on("error", (error) => console.error("[database] idle client error", error.message));
  }
  return pool;
}

export async function migrate() {
  if (!hasDatabase()) return { skipped: true };
  const migrationDirectory = fileURLToPath(new URL("./db/migrations/", import.meta.url));
  const files = (await fs.readdir(migrationDirectory))
    .filter((name) => /^\d{3}_[a-z0-9_-]+\.sql$/i.test(name))
    .sort();
  const client = await database().connect();
  const applied = [];
  try {
    await client.query("SELECT pg_advisory_lock(hashtext('cogniva_compass_schema_migrations'))");
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    for (const name of files) {
      const exists = await client.query("SELECT 1 FROM schema_migrations WHERE name=$1", [name]);
      if (exists.rowCount === 1) continue;
      const sql = await fs.readFile(`${migrationDirectory}/${name}`, "utf8");
      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [name]);
        await client.query("COMMIT");
        applied.push(name);
      } catch (error) {
        await client.query("ROLLBACK").catch(() => {});
        throw error;
      }
    }
  } finally {
    await client.query("SELECT pg_advisory_unlock(hashtext('cogniva_compass_schema_migrations'))").catch(() => {});
    client.release();
  }
  return { skipped: false, applied: Object.freeze(applied) };
}

export async function withTransaction(callback) {
  const client = await database().connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

export async function closeDatabase() {
  if (!pool) return;
  const current = pool;
  pool = null;
  await current.end();
}
