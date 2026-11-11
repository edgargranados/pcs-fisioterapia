export type Locale = "es" | "ca";

export function isLocale(value: string): value is Locale {
  return value === "es" || value === "ca";
}
