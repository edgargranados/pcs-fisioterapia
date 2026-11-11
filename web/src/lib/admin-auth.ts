import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const adminCookieName = "pcs_leads";

function safeEqual(leftValue: string, rightValue: string) {
  const left = Buffer.from(leftValue);
  const right = Buffer.from(rightValue);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function adminConfigured() {
  return Boolean(process.env.LEADS_ADMIN_PASSWORD);
}

export function passwordMatches(input: string) {
  const expected = process.env.LEADS_ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  return safeEqual(input, expected);
}

export function adminToken() {
  const password = process.env.LEADS_ADMIN_PASSWORD ?? "";
  if (!password) return "";
  return createHmac("sha256", password).update("pcs-leads-v1").digest("hex");
}

export function isAdminCookie(value: string | undefined) {
  const expected = adminToken();
  if (!expected || !value) return false;
  return safeEqual(value, expected);
}
