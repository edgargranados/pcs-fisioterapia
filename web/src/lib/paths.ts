import type { Locale } from "@/lib/locale";

export function homePath(locale: Locale) {
  return locale === "ca" ? "/ca" : "/";
}

export function mataroPath(locale: Locale) {
  return locale === "ca" ? "/ca/fisioterapia-mataro" : "/fisioterapia-mataro";
}

export function therapyBase(locale: Locale) {
  return locale === "ca" ? "/ca/terapies" : "/terapias";
}

export function therapyPath(locale: Locale, slug: string) {
  return `${therapyBase(locale)}/${slug}`;
}

export function zonesPath(locale: Locale) {
  return locale === "ca" ? "/ca/zones" : "/zonas";
}

export function zonePath(locale: Locale, slug: string) {
  return `${zonesPath(locale)}/${slug}`;
}

export function bookPath(locale: Locale) {
  return locale === "ca" ? "/ca/hora" : "/cita";
}

export function legalPath(locale: Locale) {
  return locale === "ca" ? "/ca/avis-legal" : "/aviso-legal";
}

export function privacyPath(locale: Locale) {
  return locale === "ca" ? "/ca/privacitat" : "/privacidad";
}

export function absoluteUrl(path: string) {
  if (path === "/") return "https://pcsfisioterapia.com";
  return `https://pcsfisioterapia.com${path}`;
}
