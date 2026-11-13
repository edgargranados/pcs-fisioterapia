import Link from "next/link";
import { BookForm } from "@/components/book-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import { orderedTherapies } from "@/content/therapies";
import { towns } from "@/content/towns";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/locale";
import { homePath, mataroPath, therapyPath, zonePath } from "@/lib/paths";
import { clinic, mapEmbed } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/seo";

const districts = {
  es: ["Centre", "Eixample", "Cerdanyola", "Rocafonda", "Cirera", "Pla d'en Boet", "Vista Alegre", "Els Molins"],
  ca: ["Centre", "Eixample", "Cerdanyola", "Rocafonda", "Cirera", "Pla d'en Boet", "Vista Alegre", "Els Molins"],
};

export function MataroView({ locale }: { locale: Locale }) {
  const copy = ui[locale];
  const path = mataroPath(locale);
  const alternate = mataroPath(locale === "es" ? "ca" : "es");

  return (
    <SiteShell locale={locale} alternateHref={alternate}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: copy.crumbsHome, path: homePath(locale) },
          { name: "Mataró", path },
        ])}
      />
      <article>
        <header className="mx-auto w-full max-w-6xl px-5 pb-6 pt-12 md:pt-16">
          <Breadcrumbs items={[{ name: copy.crumbsHome, href: homePath(locale) }, { name: "Mataró" }]} />
          <p className="mt-8 text-xs uppercase tracking-[0.18em] text-primary">{copy.mataroEyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.02] tracking-tight md:text-6xl">{copy.mataroTitle}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{copy.mataroLede}</p>
        </header>
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-8 md:grid-cols-12">
          <div className="space-y-5 text-[17px] leading-8 md:col-span-7">
            {locale === "ca" ? (
              <>
                <p>
                  Si busques fisioterapeuta a Mataró, fisio a Mataró o fisioteràpia esportiva al Maresme, la consulta de Pol Carmona és al carrer Via Sèrgia 32, 08302. És la zona oest, dins d&apos;Oikos Training System, amb accés fàcil des de la C-32. Des de l&apos;estació de Rodalies, al centre, són uns minuts en taxi o bus urbà.
                </p>
                <p>
                  Viuis al {districts.ca.join(", ")}, la consulta no és al casc antic: és a Via Sèrgia. S&apos;hi arriba amb cotxe sense haver de creuar tot el centre.
                </p>
                <p>
                  Pol tracta esquena, espatlla, genoll, turmell i les molèsties de qui entrena, corre, juga a pàdel o simplement treballa. Les eines són teràpia manual, punció seca, neuromodulació, exercici terapèutic i readaptació esportiva. La llengua de la visita és el català o el castellà.
                </p>
              </>
            ) : (
              <>
                <p>
                  Si buscas fisioterapeuta en Mataró, fisio en Mataró o fisioterapia deportiva en el Maresme, la consulta de Pol Carmona está en Carrer Via Sèrgia 32, 08302. Es la zona oeste, dentro de Oikos Training System, con acceso fácil desde la C-32. Desde la estación de Rodalies, en el centro, son unos minutos en taxi o bus urbano.
                </p>
                <p>
                  Vivas en {districts.es.join(", ")}, la consulta no está en el casco antiguo: está en Via Sèrgia. Se llega en coche sin cruzar todo el centro.
                </p>
                <p>
                  Pol trata espalda, hombro, rodilla, tobillo y las molestias de quien entrena, corre, juega a pádel o simplemente trabaja. Las herramientas son terapia manual, punción seca, neuromodulación, ejercicio terapéutico y readaptación deportiva. La visita puede ser en catalán o en castellano.
                </p>
              </>
            )}
            <h2 className="pt-4 font-serif text-3xl">{copy.firstVisit}</h2>
            <ol className="space-y-3">
              {copy.steps.map((step, index) => (
                <li key={step.title}>
                  <span className="font-medium">{index + 1}. {step.title}. </span>
                  <span className="text-muted-foreground">{step.text}</span>
                </li>
              ))}
            </ol>
            <p className="text-sm text-muted-foreground">{copy.emergency}</p>
          </div>
          <aside className="md:col-span-5">
            <iframe title={copy.mapTitle} src={mapEmbed} className="h-72 w-full rounded-[1.4rem] border border-border" loading="lazy" />
            <p className="mt-4 text-sm leading-6">
              {clinic.place}
              <br />
              {clinic.street}
              <br />
              {clinic.postalCode} {clinic.city}
            </p>
            <a href={clinic.maps} className="mt-3 inline-block text-sm underline underline-offset-4" target="_blank" rel="noopener noreferrer">
              {copy.howToGet}
            </a>
          </aside>
        </div>
        <section className="mx-auto w-full max-w-6xl px-5 py-6">
          <h2 className="font-serif text-3xl">{copy.therapies}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {orderedTherapies().map((therapy) => (
              <li key={therapy.id}>
                <Link href={therapyPath(locale, therapy.slug[locale])} className="block rounded-2xl border border-border px-4 py-4 hover:bg-accent">
                  <span className="font-serif text-2xl">{therapy.name[locale]}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{therapy.summary[locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="mx-auto w-full max-w-6xl px-5 py-8">
          <h2 className="font-serif text-3xl">{copy.zonesTitle}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {towns.map((town) => (
              <li key={town.slug}>
                <Link href={zonePath(locale, town.slug)} className="inline-flex rounded-full border border-border px-4 py-2 text-sm">
                  {town.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section id="cita" className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-10 pb-28 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="font-serif text-4xl tracking-tight">{copy.formTitle}</h2>
          </div>
          <div className="md:col-span-7">
            <BookForm locale={locale} page={path} />
          </div>
        </section>
      </article>
    </SiteShell>
  );
}
