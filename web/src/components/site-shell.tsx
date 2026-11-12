import { AttributionCapture } from "@/components/attribution-capture";
import { JsonLd } from "@/components/json-ld";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/locale";
import { homePath } from "@/lib/paths";
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
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(locale)}`,
        }}
      />
      <JsonLd data={businessJsonLd(locale)} />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {copy.skip}
      </a>
      <AttributionCapture />
      <SiteHeader locale={locale} alternateHref={alternateHref} />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <SiteFooter locale={locale} />
      {hideMobileCta ? null : <MobileCtaBar href={`${homePath(locale)}#cita`} label={copy.book} />}
    </div>
  );
}
