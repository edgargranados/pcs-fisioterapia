import { adminCookieName } from "@/lib/admin-auth";
import { sameOrigin } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ ok: false }, { status: 403 });
  }
  const response = Response.json({ ok: true });
  response.headers.append(
    "set-cookie",
    `${adminCookieName}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
  );
  return response;
}
