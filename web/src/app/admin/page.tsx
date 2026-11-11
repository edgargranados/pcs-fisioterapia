import { connection } from "next/server";
import { cookies } from "next/headers";
import { AdminLogin, AdminLogout } from "@/components/admin-login";
import { adminConfigured, adminCookieName, isAdminCookie } from "@/lib/admin-auth";
import { sql } from "@/lib/db";

export const instant = false;

export const metadata = {
  title: "Solicitudes",
  robots: { index: false, follow: false },
};

type LeadRow = {
  id: number | string;
  name: string;
  phone: string;
  email: string | null;
  locale: string;
  page: string | null;
  created_at: string | Date;
};

const dateFormat = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Madrid",
});

export default async function AdminPage() {
  await connection();
  const configured = adminConfigured();
  const jar = await cookies();
  const authed = configured && isAdminCookie(jar.get(adminCookieName)?.value);
  const leads = authed
    ? await sql<LeadRow>(
        "select id, name, phone, email, locale, page, created_at from leads order by created_at desc limit 200",
      )
    : [];

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12">
      <p className="text-xs uppercase tracking-[0.18em] text-primary">PCS Fisioterapia</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <h1 className="font-serif text-4xl tracking-tight">Solicitudes de cita</h1>
        {authed ? <AdminLogout /> : null}
      </div>
      {!configured ? (
        <p className="mt-6 max-w-xl text-muted-foreground">
          El panel está apagado. Cuando definas la contraseña de acceso, aquí aparecerán los nombres y teléfonos que deje el formulario.
        </p>
      ) : null}
      {configured && !authed ? (
        <>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Entra para ver las solicitudes. Los datos no se muestran sin la contraseña.
          </p>
          <AdminLogin />
        </>
      ) : null}
      {authed ? (
        leads.length === 0 ? (
          <p className="mt-10 text-muted-foreground">Todavía no hay solicitudes.</p>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="py-3 pr-4 font-medium">Fecha</th>
                  <th className="py-3 pr-4 font-medium">Nombre</th>
                  <th className="py-3 pr-4 font-medium">Teléfono</th>
                  <th className="py-3 pr-4 font-medium">Email</th>
                  <th className="py-3 pr-4 font-medium">Idioma</th>
                  <th className="py-3 font-medium">Página</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={String(lead.id)} className="border-b border-border/80">
                    <td className="py-3 pr-4 whitespace-nowrap">{dateFormat.format(new Date(lead.created_at))}</td>
                    <td className="py-3 pr-4">{lead.name}</td>
                    <td className="py-3 pr-4">
                      <a href={`tel:${lead.phone}`} className="underline underline-offset-4">
                        {lead.phone}
                      </a>
                    </td>
                    <td className="py-3 pr-4">{lead.email ?? "—"}</td>
                    <td className="py-3 pr-4 uppercase">{lead.locale}</td>
                    <td className="py-3">{lead.page ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : null}
    </main>
  );
}
