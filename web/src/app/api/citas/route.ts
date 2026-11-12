import { ensureLeadAttribution, sql } from "@/lib/db";
import { isHoneypot, parseLead } from "@/lib/leads";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rate-limit";
import { whatsappLink } from "@/lib/whatsapp";

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
    await ensureLeadAttribution();
    const lead = parsed.lead;
    await sql(
      `insert into leads (
        name, phone, email, locale, page, referrer, landing_url,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        gclid, fbclid, gbraid, wbraid, msclkid, ttclid
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
      [
        lead.name,
        lead.phone,
        lead.email,
        lead.locale,
        lead.page,
        lead.referrer,
        lead.landing_url,
        lead.utm_source,
        lead.utm_medium,
        lead.utm_campaign,
        lead.utm_term,
        lead.utm_content,
        lead.gclid,
        lead.fbclid,
        lead.gbraid,
        lead.wbraid,
        lead.msclkid,
        lead.ttclid,
      ],
    );
  } catch (error) {
    console.error("lead insert failed", error instanceof Error ? error.name : "unknown");
    return Response.json({ ok: false, error: "server" }, { status: 500 });
  }

  return Response.json({
    ok: true,
    whatsapp: whatsappLink(parsed.lead.locale, parsed.lead.name),
  });
}
