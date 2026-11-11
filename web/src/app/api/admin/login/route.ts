import { adminConfigured, adminCookieName, adminToken, passwordMatches } from "@/lib/admin-auth";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ ok: false }, { status: 403 });
  }
  if (!adminConfigured()) {
    return Response.json({ ok: false, error: "unconfigured" }, { status: 404 });
  }
  if (!rateLimit(`login:${clientIp(request)}`, 8, 15 * 60 * 1000).ok) {
    return Response.json({ ok: false, error: "rate" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const password = body && typeof body === "object" && "password" in body ? String(body.password) : "";
  if (!passwordMatches(password)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const response = Response.json({ ok: true });
  response.headers.append(
    "set-cookie",
    `${adminCookieName}=${adminToken()}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 14}; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`,
  );
  return response;
}
