import "server-only";

/** Reads WHATSAPP_NUMBER at runtime. Accepts 34600111222, +34 600 111 222 or 600111222. */
export function getWhatsappNumber() {
  let digits = (process.env.WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (/^[6-9]\d{8}$/.test(digits)) digits = `34${digits}`;
  if (!/^34[6-9]\d{8}$/.test(digits)) return "";
  return digits;
}

export function whatsappLink(locale: "es" | "ca", name: string) {
  const number = getWhatsappNumber();
  if (!number) return "";
  const safe = name.replace(/[\r\n]/g, " ").slice(0, 80);
  const text =
    locale === "ca"
      ? `Hola Pol, sóc ${safe}. Acabo de demanar hora a pcsfisioterapia.com.`
      : `Hola Pol, soy ${safe}. Acabo de pedir cita en pcsfisioterapia.com.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
