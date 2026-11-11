import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";
import { therapies } from "@/content/therapies";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/locale";
import { bookPath, homePath, mataroPath, therapyPath, zonesPath } from "@/lib/paths";

export function SiteHeader({ locale, alternateHref }: { locale: Locale; alternateHref: string }) {
  const copy = ui[locale];
  const links = [
    { href: `${homePath(locale)}#terapias`, label: copy.therapies },
    { href: mataroPath(locale), label: copy.consult },
    { href: zonesPath(locale), label: copy.zones },
    { href: `${homePath(locale)}#pol`, label: copy.about },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-6xl items-center justify-between gap-4 px-5">
        <Link href={homePath(locale)} className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary font-serif text-[13px] tracking-wide text-primary-foreground">
            PCS
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg tracking-tight">Pol Carmona</span>
            <span className="block text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {locale === "ca" ? "Fisioteràpia · Mataró" : "Fisioterapia · Mataró"}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm lg:flex" aria-label={locale === "ca" ? "Principal" : "Principal"}>
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-full px-1 py-2 hover:text-primary">
              {copy.therapies}
            </summary>
            <div className="absolute left-0 top-[calc(100%+0.4rem)] z-20 w-72 rounded-2xl border border-border bg-card p-2 shadow-lg">
              {therapies.map((therapy) => (
                <Link
                  key={therapy.id}
                  href={therapyPath(locale, therapy.slug[locale])}
                  className="block rounded-xl px-3 py-2.5 hover:bg-accent"
                >
                  {therapy.name[locale]}
                </Link>
              ))}
            </div>
          </details>
          <Link href={mataroPath(locale)} className="hover:text-primary">
            {copy.consult}
          </Link>
          <Link href={zonesPath(locale)} className="hover:text-primary">
            {copy.zones}
          </Link>
          <Link href={`${homePath(locale)}#pol`} className="hover:text-primary">
            {copy.about}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={alternateHref}
            hrefLang={locale === "ca" ? "es" : "ca"}
            aria-label={copy.langAria}
            className="hidden rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            {copy.langLabel}
          </Link>
          <Link href={bookPath(locale)} className="hidden h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground sm:inline-flex">
            {copy.book}
          </Link>
          <MobileMenu
            links={links}
            cta={{ href: bookPath(locale), label: copy.book }}
            lang={{ href: alternateHref, label: copy.langLabel, aria: copy.langAria }}
            openLabel={copy.menu}
            closeLabel={copy.close}
          />
        </div>
      </div>
    </header>
  );
}
