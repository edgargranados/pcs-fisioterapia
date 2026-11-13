import Image from "next/image";
import Link from "next/link";
import { BookButton } from "@/components/appointment-wizard";
import { BookForm } from "@/components/book-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { HeroVideo } from "@/components/hero-video";
import { JsonLd } from "@/components/json-ld";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { SiteShell } from "@/components/site-shell";
import { orderedTherapies } from "@/content/therapies";
import { townBySlug, type Town } from "@/content/towns";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/locale";
import { homePath, mataroPath, therapyPath, zonePath } from "@/lib/paths";
import { clinic } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export function TownView({ locale, town }: { locale: Locale; town: Town }) {
  const copy = ui[locale];
  const path = zonePath(locale, town.slug);
  const alternate = zonePath(locale === "es" ? "ca" : "es", town.slug);
  const place = locale === "ca" ? "a prop de" : "cerca de";
  const minutes =
    locale === "ca" ? `uns ${town.minutes} minuts en cotxe` : `unos ${town.minutes} minutos en coche`;
  const lede =
    locale === "ca"
      ? `${minutes[0].toUpperCase()}${minutes.slice(1)} fins a ${clinic.street}, ${clinic.city}.`
      : `${minutes[0].toUpperCase()}${minutes.slice(1)} hasta ${clinic.street}, ${clinic.city}.`;
  const road = locale === "ca" ? town.road.ca : town.road.es;
  const crumbs = [
    { name: copy.crumbsHome, href: homePath(locale) },
    { name: copy.zones, href: locale === "ca" ? "/ca/zones" : "/zonas" },
    { name: town.name },
  ];
  const faq = [
    {
      q: locale === "ca" ? `Quant es tarda des de ${town.name}?` : `¿Cuánto se tarda desde ${town.name}?`,
      a:
        locale === "ca"
          ? `${lede} El camí: ${road}. El trànsit de la C-32 ho pot allargar.`
          : `${lede} El camino: ${road}. El tráfico de la C-32 lo puede alargar.`,
    },
    {
      q: locale === "ca" ? "Cal ser soci d'Oikos?" : "¿Hay que ser socio de Oikos?",
      a: copy.mustMember,
    },
  ];

  return (
    <SiteShell locale={locale} alternateHref={alternate} hideMobileCta>
      <JsonLd data={faqJsonLd(faq)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: copy.crumbsHome, path: homePath(locale) },
          { name: copy.zones, path: locale === "ca" ? "/ca/zones" : "/zonas" },
          { name: town.name, path },
        ])}
      />
      <section className="home-hero relative overflow-hidden bg-[#141815] text-[#f6f3ec]">
        <Image
          src="/media/hero-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <HeroVideo />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,20,17,0.5)_0%,rgba(16,20,17,0.28)_42%,rgba(16,20,17,0.62)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,20,17,0.82)_0%,rgba(16,20,17,0.42)_52%,rgba(16,20,17,0.12)_100%)]" />
        <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col justify-between px-5 py-6 md:py-10">
          <Breadcrumbs items={crumbs} light />
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#f6f3ec]/85">{copy.heroBrand}</p>
            <h1 className="mt-4 max-w-4xl font-serif text-[2.5rem] leading-[1.05] tracking-[-0.03em] sm:text-6xl">
              {locale === "ca" ? "Fisioterapeuta" : "Fisioterapeuta"} {place} {town.name}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#f6f3ec]/90 sm:text-lg">{lede}</p>
            <div className="mt-8">
              <BookButton className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground hover:bg-[#08685f]">
                {copy.heroCta}
              </BookButton>
            </div>
            <p className="mt-6 text-sm tracking-wide text-[#f6f3ec]/85">{copy.heroPlace}</p>
          </div>
        </div>
      </section>

      <MobileCtaBar label={copy.book} dock="under-hero" />

      <article>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-base leading-7">
            {locale === "ca" ? "El camí" : "El camino"}: {road}. {clinic.place}, {clinic.street}.
          </p>
          <a href={clinic.maps} target="_blank" rel="noopener noreferrer" className="shrink-0 text-sm underline underline-offset-4">
            {copy.howToGet}
          </a>
        </div>

        <section className="mx-auto w-full max-w-6xl px-5 py-4">
          <h2 className="font-serif text-3xl">{copy.therapies}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {orderedTherapies().map((therapy) => (
              <li key={therapy.id}>
                <Link href={therapyPath(locale, therapy.slug[locale])} className="inline-flex rounded-full border border-border px-4 py-2 text-sm hover:bg-accent">
                  {therapy.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link href={mataroPath(locale)} className="text-sm underline underline-offset-4">
              {copy.mataroTitle}
            </Link>
          </p>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-6">
          <h2 className="font-serif text-2xl">{copy.faqTitle}</h2>
          <FaqList items={faq} />
          <p className="mt-4 text-sm text-muted-foreground">{copy.emergency}</p>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-6">
          <h2 className="font-serif text-2xl">{copy.nearby}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {town.nearby.map((slug) => {
              const neighbor = townBySlug(slug);
              if (!neighbor) return null;
              return (
                <li key={slug}>
                  <Link href={zonePath(locale, slug)} className="inline-flex rounded-full bg-secondary px-4 py-2 text-sm">
                    {neighbor.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section id="cita" className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 pb-28 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="font-serif text-4xl tracking-tight">{copy.formTitle}</h2>
            <p className="mt-4 text-muted-foreground">{copy.formLede}</p>
          </div>
          <div className="md:col-span-7">
            <BookForm locale={locale} page={path} />
          </div>
        </section>
      </article>
    </SiteShell>
  );
}
