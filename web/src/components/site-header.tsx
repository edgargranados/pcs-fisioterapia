import Link from "next/link";
import { BookButton } from "@/components/appointment-wizard";
import { MobileMenu } from "@/components/mobile-menu";
import { SiteHeaderFrame } from "@/components/site-header-frame";
import { orderedTherapies } from "@/content/therapies";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/locale";
import { homePath, therapyPath, zonesPath } from "@/lib/paths";

export function SiteHeader({ locale, alternateHref }: { locale: Locale; alternateHref: string }) {
  const copy = ui[locale];
  const home = homePath(locale);
  const links = [
    { href: `${home}#serveis`, label: copy.therapies },
    { href: `${home}#proces`, label: copy.processNav },
    { href: `${home}#pacients`, label: copy.audienceNav },
    { href: `${home}#pol`, label: copy.about },
    { href: zonesPath(locale), label: copy.zones },
  ];

  return (
    <SiteHeaderFrame className="sticky top-0 z-50 box-border flex min-h-[4.5rem] items-center border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5">
        <Link href={home} className="flex min-w-0 items-center gap-3">
          <img
            src="/media/logo-mark.png"
            alt=""
            width={294}
            height={284}
            className="h-11 w-auto shrink-0 sm:h-12"
          />
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
              <Link href={`${home}#serveis`} className="block rounded-xl px-3 py-2.5 font-medium hover:bg-accent">
                {copy.servicesTitle}
              </Link>
              {orderedTherapies().map((therapy) => (
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
          <Link href={`${home}#proces`} className="hover:text-primary">
            {copy.processNav}
          </Link>
          <Link href={`${home}#pol`} className="hover:text-primary">
            {copy.about}
          </Link>
          <Link href={zonesPath(locale)} className="hover:text-primary">
            {copy.zones}
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
          <BookButton className="hidden h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-[#08685f] sm:inline-flex">
            {copy.book}
          </BookButton>
          <MobileMenu
            links={links}
            cta={{ href: `${home}#cita`, label: copy.book }}
            lang={{ href: alternateHref, label: copy.langLabel, aria: copy.langAria }}
            openLabel={copy.menu}
            closeLabel={copy.close}
          />
        </div>
      </div>
    </SiteHeaderFrame>
  );
}
