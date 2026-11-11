import Link from "next/link";
import { BookForm } from "@/components/book-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
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
    locale === "ca"
      ? `uns ${town.minutes} minuts en cotxe`
      : `unos ${town.minutes} minutos en coche`;
  const faq = [
    {
      q: locale === "ca" ? `Quant es tarda des de ${town.name}?` : `¿Cuánto se tarda desde ${town.name}?`,
      a:
        locale === "ca"
          ? `Orientativament, ${minutes} (${town.km} km), ${town.road.ca}, fins a ${clinic.street}. El trànsit de la C-32 ho pot allargar.`
          : `Orientativamente, ${minutes} (${town.km} km), ${town.road.es}, hasta ${clinic.street}. El tráfico de la C-32 lo puede alargar.`,
    },
    {
      q: locale === "ca" ? "Cal ser soci d'Oikos?" : "¿Hay que ser socio de Oikos?",
      a: copy.mustMember,
    },
  ];

  return (
    <SiteShell locale={locale} alternateHref={alternate}>
      <JsonLd data={faqJsonLd(faq)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: copy.crumbsHome, path: homePath(locale) },
          { name: copy.zones, path: locale === "ca" ? "/ca/zones" : "/zonas" },
          { name: town.name, path },
        ])}
      />
      <article>
        <header className="mx-auto w-full max-w-6xl px-5 pb-6 pt-12 md:pt-16">
          <Breadcrumbs
            items={[
              { name: copy.crumbsHome, href: homePath(locale) },
              { name: copy.zones, href: locale === "ca" ? "/ca/zones" : "/zonas" },
              { name: town.name },
            ]}
          />
          <p className="mt-8 text-xs uppercase tracking-[0.18em] text-primary">
            {locale === "ca" ? "Fisioterapeuta a Mataró" : "Fisioterapeuta en Mataró"}
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.02] tracking-tight md:text-6xl">
            {locale === "ca" ? "Fisioterapeuta" : "Fisioterapeuta"} {place} {town.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{town.intro[locale]}</p>
        </header>
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-8 md:grid-cols-12">
          <div className="space-y-5 text-[17px] leading-8 md:col-span-7">
            <p>{town.local[locale]}</p>
            <p>{town.who[locale]}</p>
            <p>
              {locale === "ca"
                ? `La visita és amb hora prèvia a ${clinic.place}, ${clinic.street}, ${clinic.postalCode} ${clinic.city}. El camí: ${town.road.ca}.`
                : `La visita es hace con cita previa en ${clinic.place}, ${clinic.street}, ${clinic.postalCode} ${clinic.city}. El camino: ${town.road.es}.`}
            </p>
            <p className="text-sm text-muted-foreground">{copy.emergency}</p>
          </div>
          <aside className="rounded-[1.4rem] border border-border p-6 md:col-span-5">
            <p className="text-xs uppercase tracking-[0.16em] text-primary">{minutes}</p>
            <p className="mt-3 font-serif text-3xl tracking-tight">{clinic.street}</p>
            <p className="mt-2 text-muted-foreground">
              {clinic.postalCode} {clinic.city}
            </p>
            <a href={clinic.maps} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm underline underline-offset-4">
              {copy.howToGet}
            </a>
            <p className="mt-6 text-sm">
              <Link href={mataroPath(locale)} className="underline underline-offset-4">
                {copy.mataroTitle}
              </Link>
            </p>
          </aside>
        </div>
        <section className="mx-auto w-full max-w-6xl px-5 py-6">
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
        </section>
        <section className="mx-auto w-full max-w-6xl px-5 py-6">
          <h2 className="font-serif text-2xl">{copy.faqTitle}</h2>
          <FaqList items={faq} />
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
