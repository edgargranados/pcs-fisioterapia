import "server-only";

const clinicWhatsapp = "34672120439";

/** Public clinic WhatsApp. +34 672 12 04 39. */
export function getWhatsappNumber() {
  return clinicWhatsapp;
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
