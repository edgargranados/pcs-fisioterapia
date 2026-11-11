import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/locale";
import { bookPath } from "@/lib/paths";
import { businessJsonLd } from "@/lib/seo";

export function SiteShell({
  locale,
  alternateHref,
  hideMobileCta = false,
  children,
}: {
  locale: Locale;
  alternateHref: string;
  hideMobileCta?: boolean;
  children: React.ReactNode;
}) {
  const copy = ui[locale];

  return (
    <div lang={locale} className="flex min-h-full flex-col bg-background text-foreground">
      <JsonLd data={businessJsonLd(locale)} />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {copy.skip}
      </a>
      <SiteHeader locale={locale} alternateHref={alternateHref} />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <SiteFooter locale={locale} />
      {hideMobileCta ? null : (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
          <Link
            href={bookPath(locale)}
            className="flex h-12 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground"
          >
            {copy.book}
          </Link>
        </div>
      )}
    </div>
  );
}
