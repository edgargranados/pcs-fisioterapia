import "server-only";

/** Reads WHATSAPP_NUMBER at runtime. Accepts 34600111222, +34 600 111 222 or 600111222. */
export function getWhatsappNumber() {
  let digits = (process.env.WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (/^[6-9]\d{8}$/.test(digits)) digits = `34${digits}`;
  if (!/^34[6-9]\d{8}$/.test(digits)) return "";
  return digits;
}
