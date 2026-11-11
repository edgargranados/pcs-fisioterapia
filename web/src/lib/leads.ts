import type { Locale } from "@/lib/locale";

export type LeadInput = {
  name: string;
  phone: string;
  email: string | null;
  locale: Locale;
  page: string | null;
};

export type LeadError = "name" | "phone" | "email" | "consent" | "locale";

export function isHoneypot(body: Record<string, unknown>) {
  return typeof body.company === "string" && body.company.trim() !== "";
}

export function parseLead(
  body: Record<string, unknown>,
): { ok: true; lead: LeadInput } | { ok: false; error: LeadError } {
  if (body.consent !== true) return { ok: false, error: "consent" };

  const locale = body.locale === "ca" ? "ca" : body.locale === "es" ? "es" : null;
  if (!locale) return { ok: false, error: "locale" };

  const name = typeof body.name === "string" ? body.name.replace(/\s+/g, " ").trim() : "";
  if (name.length < 2 || name.length > 80 || !/^[\p{L}][\p{L}\s.'’\-]*$/u.test(name)) {
    return { ok: false, error: "name" };
  }

  const phone = normalizePhone(typeof body.phone === "string" ? body.phone : "");
  if (!phone) return { ok: false, error: "phone" };

  const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  let email: string | null = null;
  if (emailRaw) {
    if (emailRaw.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) {
      return { ok: false, error: "email" };
    }
    email = emailRaw;
  }

  return {
    ok: true,
    lead: { name, phone, email, locale, page: cleanPage(body.page) },
  };
}

function normalizePhone(value: string) {
  let digits = value.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (/^[6-9]\d{8}$/.test(digits)) digits = `34${digits}`;
  if (!/^34[6-9]\d{8}$/.test(digits)) return null;
  return `+${digits}`;
}

function cleanPage(value: unknown) {
  if (typeof value !== "string") return null;
  if (value.length > 180 || !/^\/[a-z0-9/-]*$/.test(value)) return null;
  return value;
}
