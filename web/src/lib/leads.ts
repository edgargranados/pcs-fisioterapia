import type { Locale } from "@/lib/locale";

export type Preference = "morning" | "afternoon";
export type LeadStep = "preference" | "name" | "phone" | "email";
export type LeadError = "name" | "phone" | "email" | "consent" | "locale" | "preference" | "lead";

export function isHoneypot(body: Record<string, unknown>) {
  return typeof body.company === "string" && body.company.trim() !== "";
}

export function parseStep(value: unknown): LeadStep | null {
  if (value === "preference" || value === "name" || value === "phone" || value === "email") return value;
  return null;
}

export function hasConsent(body: Record<string, unknown>) {
  return body.consent === true;
}

export function parseLocale(value: unknown): Locale | null {
  return value === "ca" || value === "es" ? value : null;
}

export function parsePreference(value: unknown): Preference | null {
  return value === "morning" || value === "afternoon" ? value : null;
}

export function parseName(value: unknown) {
  const name = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
  if (name.length < 2 || name.length > 80 || !/^[\p{L}][\p{L}\s.'’\-]*$/u.test(name)) return null;
  return name;
}

export function parsePhone(value: unknown) {
  return normalizePhone(typeof value === "string" ? value : "");
}

export function parseEmail(value: unknown): { ok: true; email: string | null } | { ok: false } {
  const emailRaw = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!emailRaw) return { ok: true, email: null };
  if (emailRaw.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) return { ok: false };
  return { ok: true, email: emailRaw };
}

export function parseLeadRef(body: Record<string, unknown>) {
  const raw = body.id;
  const id = typeof raw === "number" ? raw : typeof raw === "string" && /^[1-9]\d*$/.test(raw) ? Number(raw) : NaN;
  const token = typeof body.token === "string" ? body.token : "";
  if (!Number.isInteger(id) || id < 1 || id > 1_000_000_000) return null;
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  return { id, token };
}

export function hasLeadAttempt(body: Record<string, unknown>) {
  if (body.id != null && body.id !== "") return true;
  return typeof body.token === "string" && body.token !== "";
}

export function cleanPage(value: unknown) {
  if (typeof value !== "string") return null;
  if (value.length > 180 || !/^\/[a-z0-9/-]*$/.test(value)) return null;
  return value;
}

function normalizePhone(value: string) {
  let digits = value.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (/^[6-9]\d{8}$/.test(digits)) digits = `34${digits}`;
  if (!/^34[6-9]\d{8}$/.test(digits)) return null;
  return `+${digits}`;
}
