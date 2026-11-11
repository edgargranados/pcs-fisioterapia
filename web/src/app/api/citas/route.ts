import { sql } from "@/lib/db";
import { isHoneypot, parseLead } from "@/lib/leads";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ ok: false, error: "server" }, { status: 403 });
  }

  if (!rateLimit(`cita:${clientIp(request)}`, 5, 60 * 60 * 1000).ok) {
    return Response.json({ ok: false, error: "rate" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "name" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "name" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  if (isHoneypot(record)) {
    return Response.json({ ok: true });
  }

  const parsed = parseLead(record);
  if (!parsed.ok) {
    return Response.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  try {
    await sql(
      "insert into leads (name, phone, email, locale, page) values ($1, $2, $3, $4, $5)",
      [parsed.lead.name, parsed.lead.phone, parsed.lead.email, parsed.lead.locale, parsed.lead.page],
    );
  } catch (error) {
    console.error("lead insert failed", error instanceof Error ? error.name : "unknown");
    return Response.json({ ok: false, error: "server" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
