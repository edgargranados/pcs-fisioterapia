type Bucket = { count: number; reset: number };

const buckets = new Map<string, Bucket>();

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const raw = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return raw.slice(0, 64);
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [entry, bucket] of buckets) {
      if (bucket.reset < now) buckets.delete(entry);
    }
  }

  const current = buckets.get(key);
  if (!current || current.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true as const };
  }
  if (current.count >= limit) return { ok: false as const };
  current.count += 1;
  return { ok: true as const };
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
