import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";

const globalDb = globalThis as unknown as {
  pcsPool?: pg.Pool;
  pcsLocal?: Promise<PGlite>;
};

const attributionColumns = [
  "referrer",
  "landing_url",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "ttclid",
] as const;

let attributionReady = false;
let wizardReady = false;

export async function ensureLeadAttribution() {
  if (attributionReady) return;
  for (const column of attributionColumns) {
    await sql(`alter table leads add column if not exists ${column} text`);
  }
  attributionReady = true;
}

export async function ensureLeadWizard() {
  if (wizardReady) return;
  await sql("alter table leads add column if not exists preference text");
  await sql("alter table leads add column if not exists status text not null default 'complete'");
  await sql("alter table leads add column if not exists resume_token text");
  await sql("alter table leads alter column name drop not null");
  await sql("alter table leads alter column phone drop not null");
  wizardReady = true;
}

export async function sql<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  if (databaseUrl !== "") {
    globalDb.pcsPool ??= new pg.Pool({ connectionString: databaseUrl, max: 5 });
    return (await globalDb.pcsPool.query(text, params)).rows as T[];
  }

  globalDb.pcsLocal ??= startLocal().catch((error: unknown) => {
    globalDb.pcsLocal = undefined;
    throw error;
  });
  return (await (await globalDb.pcsLocal).query<T>(text, params)).rows;
}

async function startLocal(): Promise<PGlite> {
  const db = new PGlite();
  const dir = path.join(process.cwd(), "migrations");
  const files = (await readdir(dir).catch(() => [] as string[]))
    .filter((file) => file.endsWith(".sql"))
    .sort();
  for (const file of files) {
    await db.exec(await readFile(path.join(dir, file), "utf8"));
  }
  return db;
}
