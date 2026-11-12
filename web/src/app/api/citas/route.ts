import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { sanitizeAttribution, type Attribution } from "@/lib/attribution";
import { ensureLeadAttribution, ensureLeadWizard, sql } from "@/lib/db";
import {
  cleanPage,
  hasConsent,
  hasLeadAttempt,
  isHoneypot,
  parseEmail,
  parseLeadRef,
  parseLocale,
  parseName,
  parsePhone,
  parsePreference,
  parseStep,
  type LeadError,
} from "@/lib/leads";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rate-limit";
import { whatsappLink } from "@/lib/whatsapp";

const hour = 60 * 60 * 1000;

type StoredLead = {
  id: number | string;
  name: string | null;
  phone: string | null;
  preference: string | null;
  resume_token: string | null;
};

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ ok: false, error: "server" }, { status: 403 });
  }

  const ip = clientIp(request);
  if (!rateLimit(`cita:${ip}`, 80, hour).ok) {
    return Response.json({ ok: false, error: "rate" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "lead" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "lead" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  if (isHoneypot(record)) {
    return Response.json({ ok: true });
  }

  const step = parseStep(record.step);
  if (!step) return fail("lead");
  if (!hasConsent(record)) return fail("consent");
  const locale = parseLocale(record.locale);
  if (!locale) return fail("locale");

  const page = cleanPage(record.page);
  const ref = parseLeadRef(record);
  const updating = step !== "preference" || ref !== null || hasLeadAttempt(record);

  try {
    await ensureLeadAttribution();
    await ensureLeadWizard();

    if (!updating) {
      const preference = parsePreference(record.preference);
      if (!preference) return fail("preference");
      if (!rateLimit(`cita-new:${ip}`, 12, hour).ok) return fail("rate", 429);
      const { token, hash } = createToken();
      const attribution = sanitizeAttribution(record);
      const id = await insertPartial({ locale, page, preference, hash, attribution });
      return Response.json({ ok: true, id, token });
    }

    if (!ref) return fail("lead");
    const lead = await loadLead(ref.id);
    if (!lead || !tokenMatches(ref.token, lead.resume_token)) return fail("lead");
    const id = numericId(lead.id);
    if (!id) return fail("lead");

    if (step === "preference") {
      const preference = parsePreference(record.preference);
      if (!preference) return fail("preference");
      await sql("update leads set preference = $1, locale = $2, page = $3 where id = $4", [
        preference,
        locale,
        page,
        id,
      ]);
      return Response.json({ ok: true, id });
    }

    if (step === "name") {
      if (lead.preference !== "morning" && lead.preference !== "afternoon") return fail("preference");
      const name = parseName(record.name);
      if (!name) return fail("name");
      await sql("update leads set name = $1, locale = $2, page = $3 where id = $4", [name, locale, page, id]);
      return Response.json({ ok: true, id });
    }

    if (step === "phone") {
      if (!text(lead.name)) return fail("name");
      const phone = parsePhone(record.phone);
      if (!phone) return fail("phone");
      await sql("update leads set phone = $1, locale = $2, page = $3 where id = $4", [phone, locale, page, id]);
      return Response.json({ ok: true, id });
    }

    if (!text(lead.name) || !text(lead.phone)) return fail(text(lead.name) ? "phone" : "name");
    const email = parseEmail(record.email);
    if (!email.ok) return fail("email");
    await sql("update leads set email = $1, status = 'complete', locale = $2, page = $3 where id = $4", [
      email.email,
      locale,
      page,
      id,
    ]);
    return Response.json({
      ok: true,
      id,
      whatsapp: whatsappLink(locale, text(lead.name)),
    });
  } catch (error) {
    console.error("lead save failed", error instanceof Error ? error.name : "unknown");
    return fail("server", 500);
  }
}

function fail(error: LeadError | "rate" | "server", status = 400) {
  return Response.json({ ok: false, error }, { status });
}

async function insertPartial(input: {
  locale: "es" | "ca";
  page: string | null;
  preference: "morning" | "afternoon";
  hash: string;
  attribution: Attribution;
}) {
  const keys = Object.keys(input.attribution) as (keyof Attribution)[];
  const columns = ["locale", "page", "preference", "status", "resume_token", ...keys];
  const values: unknown[] = [input.locale, input.page, input.preference, "partial", input.hash];
  for (const key of keys) values.push(input.attribution[key]);
  const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
  const rows = await sql<{ id: number | string }>(
    `insert into leads (name, phone, email, ${columns.join(", ")}) values (null, null, null, ${placeholders}) returning id`,
    values,
  );
  const id = numericId(rows[0]?.id);
  if (!id) throw new Error("insert");
  return id;
}

async function loadLead(id: number) {
  const rows = await sql<StoredLead>(
    "select id, name, phone, preference, resume_token from leads where id = $1",
    [id],
  );
  return rows[0] ?? null;
}

function createToken() {
  const token = randomBytes(32).toString("hex");
  return { token, hash: hashToken(token) };
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function tokenMatches(token: string, stored: unknown) {
  if (typeof stored !== "string" || !/^[a-f0-9]{64}$/.test(stored)) return false;
  const given = Buffer.from(hashToken(token));
  const expected = Buffer.from(stored);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

function numericId(value: unknown) {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) return value;
  if (typeof value === "bigint") {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  }
  if (typeof value === "string" && /^[1-9]\d*$/.test(value)) {
    const id = Number(value);
    return Number.isSafeInteger(id) ? id : null;
  }
  return null;
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
