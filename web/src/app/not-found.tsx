import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { ui } from "@/content/ui";

export default function NotFound() {
  const copy = ui.es;
  return (
    <SiteShell locale="es" alternateHref="/ca">
      <div className="mx-auto w-full max-w-3xl px-5 py-24 pb-32">
        <p className="text-xs uppercase tracking-[0.18em] text-primary">404</p>
        <h1 className="mt-3 font-serif text-5xl tracking-tight">{copy.notFoundTitle}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{copy.notFoundBody}</p>
        <div className="mt-8 flex gap-4">
          <Link href="/" className="inline-flex h-12 items-center rounded-full bg-primary px-6 text-primary-foreground">
            {copy.notFoundHome}
          </Link>
          <Link href="/ca" className="inline-flex h-12 items-center text-sm underline underline-offset-4">
            Català
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
