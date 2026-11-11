import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteShell } from "@/components/site-shell";
import { towns } from "@/content/towns";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/locale";
import { homePath, zonePath, zonesPath } from "@/lib/paths";

export function ZonesView({ locale }: { locale: Locale }) {
  const copy = ui[locale];
  const alternate = zonesPath(locale === "es" ? "ca" : "es");

  return (
    <SiteShell locale={locale} alternateHref={alternate}>
      <header className="mx-auto w-full max-w-6xl px-5 pb-6 pt-12 md:pt-16">
        <Breadcrumbs items={[{ name: copy.crumbsHome, href: homePath(locale) }, { name: copy.zones }]} />
        <p className="mt-8 text-xs uppercase tracking-[0.18em] text-primary">{copy.zonesEyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.02] tracking-tight md:text-6xl">{copy.zonesPageTitle}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{copy.zonesPageLede}</p>
      </header>
      <ul className="mx-auto grid w-full max-w-6xl gap-4 px-5 pb-28 sm:grid-cols-2 lg:grid-cols-3">
        {towns.map((town) => (
          <li key={town.slug}>
            <Link href={zonePath(locale, town.slug)} className="flex h-full flex-col rounded-[1.4rem] border border-border p-5 hover:bg-accent">
              <span className="font-serif text-3xl tracking-tight">{town.name}</span>
              <span className="mt-3 text-sm leading-6 text-muted-foreground">{town.intro[locale]}</span>
              <span className="mt-4 text-sm">
                {locale === "ca" ? `Uns ${town.minutes} minuts` : `Unos ${town.minutes} minutos`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SiteShell>
  );
}
