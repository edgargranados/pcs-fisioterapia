export const campaignFields = [
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

export type CampaignField = (typeof campaignFields)[number];

export type Attribution = {
  referrer: string | null;
  landing_url: string | null;
} & Record<CampaignField, string | null>;

const limits: Record<keyof Attribution, number> = {
  referrer: 500,
  landing_url: 500,
  utm_source: 120,
  utm_medium: 120,
  utm_campaign: 180,
  utm_term: 180,
  utm_content: 180,
  gclid: 200,
  fbclid: 200,
  gbraid: 200,
  wbraid: 200,
  msclkid: 200,
  ttclid: 200,
};

const storageKey = "pcs-attr-v1";

export function emptyAttribution(): Attribution {
  return {
    referrer: null,
    landing_url: null,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    gclid: null,
    fbclid: null,
    gbraid: null,
    wbraid: null,
    msclkid: null,
    ttclid: null,
  };
}

function clip(value: string, max: number) {
  const clean = value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  if (!clean) return null;
  return clean.length > max ? clean.slice(0, max) : clean;
}

export function attributionFromUrl(input: {
  pathname: string;
  search: string;
  referrer: string;
  host: string;
}): Attribution {
  const result = emptyAttribution();
  const path = input.pathname.startsWith("/") ? input.pathname : `/${input.pathname}`;
  const search = input.search.startsWith("?") || input.search === "" ? input.search : `?${input.search}`;
  const landing = clip(`${path}${search}`, limits.landing_url);
  result.landing_url = landing && !landing.includes("://") && !landing.startsWith("//") ? landing : null;

  try {
    const referrer = new URL(input.referrer);
    if (referrer.protocol === "http:" || referrer.protocol === "https:") {
      referrer.username = "";
      referrer.password = "";
      result.referrer = clip(referrer.toString(), limits.referrer);
    }
  } catch {
    result.referrer = null;
  }

  const params = new URLSearchParams(search);
  for (const field of campaignFields) {
    const value = params.get(field);
    result[field] = value ? clip(value, limits[field]) : null;
  }
  return result;
}

export function hasCampaign(attribution: Attribution) {
  return campaignFields.some((field) => attribution[field]);
}

function sameHost(url: string, host: string) {
  try {
    return new URL(url).host === host;
  } catch {
    return false;
  }
}

export function mergeAttribution(previous: Attribution | null, next: Attribution, host: string): Attribution {
  if (!previous?.landing_url) return next;
  if (!hasCampaign(next)) return previous;

  const merged = { ...previous };
  merged.landing_url = next.landing_url ?? previous.landing_url;
  if (next.referrer && !sameHost(next.referrer, host)) merged.referrer = next.referrer;
  for (const field of campaignFields) {
    if (next[field]) merged[field] = next[field];
  }
  return merged;
}

export function sanitizeAttribution(body: Record<string, unknown>): Attribution {
  const result = emptyAttribution();
  const landing = typeof body.landing_url === "string" ? clip(body.landing_url, limits.landing_url) : null;
  result.landing_url = landing && landing.startsWith("/") && !landing.startsWith("//") && !landing.includes("://") ? landing : null;

  const referrer = typeof body.referrer === "string" ? clip(body.referrer, limits.referrer) : null;
  if (referrer) {
    try {
      const url = new URL(referrer);
      if (url.protocol === "http:" || url.protocol === "https:") {
        url.username = "";
        url.password = "";
        result.referrer = clip(url.toString(), limits.referrer);
      }
    } catch {
      result.referrer = null;
    }
  }

  for (const field of campaignFields) {
    const value = body[field];
    result[field] = typeof value === "string" ? clip(value, limits[field]) : null;
  }
  return result;
}

export function captureAttribution() {
  if (typeof window === "undefined") return;
  const next = attributionFromUrl({
    pathname: window.location.pathname,
    search: window.location.search,
    referrer: document.referrer,
    host: window.location.host,
  });
  let previous: Attribution | null = null;
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    previous = raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    previous = null;
  }
  const merged = mergeAttribution(previous, next, window.location.host);
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(merged));
  } catch {
    // Private mode can block storage. The form still sends this visit.
  }
}

export function readAttribution(): Attribution {
  captureAttribution();
  if (typeof window === "undefined") return emptyAttribution();
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) {
      return attributionFromUrl({
        pathname: window.location.pathname,
        search: window.location.search,
        referrer: document.referrer,
        host: window.location.host,
      });
    }
    return sanitizeAttribution(JSON.parse(raw) as Record<string, unknown>);
  } catch {
    return attributionFromUrl({
      pathname: window.location.pathname,
      search: window.location.search,
      referrer: document.referrer,
      host: window.location.host,
    });
  }
}
