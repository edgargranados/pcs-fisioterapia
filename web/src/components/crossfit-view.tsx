import Image from "next/image";
import Link from "next/link";
import { BookForm } from "@/components/book-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import { orderedTherapies } from "@/content/therapies";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/locale";
import { crossfitPath, homePath, therapyPath } from "@/lib/paths";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";
import { clinic } from "@/lib/site";

const copy = {
  es: {
    name: "Fisioterapia para CrossFit",
    eyebrow: "Fisioterapia deportiva en Mataró",
    title: "Fisioterapia para CrossFit en Mataró",
    lede: "Valoración, tratamiento y vuelta al entrenamiento para quien hace CrossFit o entrenamiento funcional. La consulta de Pol Carmona está en Carrer Via Sèrgia 32, dentro de Oikos Training System.",
    paragraphs: [
      "Pol trabaja con personas que entrenan CrossFit: de quien va al box unos días a la semana a quien compite. Conoce el deporte como atleta y como profesional, y por eso la visita parte de lo que haces en el entreno, no de una pauta genérica.",
      "En la primera visita se habla de la molestia, de los síntomas y del objetivo: seguir entrenando, volver a un movimiento o preparar una competición. Después hay una valoración para ver qué está limitando el gesto. El tratamiento se adapta a ese caso.",
      "Las herramientas son terapia manual, ejercicio terapéutico, punción seca, neuromodulación y readaptación deportiva. No es un protocolo fijo de CrossFit. Se usa lo que encaja con la lesión y con la carga que puedes tolerar.",
      "La consulta está en Mataró oeste, Carrer Via Sèrgia 32, 08302, con acceso fácil desde la C-32. Atiende en castellano y en catalán. Número de colegiado 18685 del Col·legi de Fisioterapeutes de Catalunya.",
    ],
    situationsTitle: "Motivos habituales de consulta",
    situations: [
      "Hombro después de trabajo por encima de la cabeza, muscle-up o kipping.",
      "Rodilla después de sentadillas, saltos al cajón o lunges.",
      "Zona lumbar después de peso muerto o movimientos olímpicos.",
      "Muñeca, codo o tendón que avisa al cargar la barra.",
      "Vuelta al WOD después de una lesión muscular, tendinosa o articular.",
    ],
    note: "La fisioterapia no sustituye una valoración médica cuando el caso lo pide. Si un gesto no toca esa semana, se dice en la visita.",
    faq: [
      {
        q: "¿Puedo seguir haciendo CrossFit durante el tratamiento?",
        a: "En la mayoría de casos sí, con los ajustes que hagan falta. El objetivo es que sigas activo mientras recuperas fuerza, movilidad y confianza. Si un ejercicio no toca, se acuerda en la visita.",
      },
      {
        q: "¿La primera visita es distinta si vengo por el CrossFit?",
        a: "La estructura es la misma: historia, síntomas y objetivos, y después la valoración. Se tiene en cuenta el entreno, los movimientos que molestan y lo que quieres volver a hacer.",
      },
      {
        q: "¿Tengo que dejar de entrenar hasta tener una prueba médica?",
        a: "No es obligatorio traer pruebas. Si tienes una resonancia o un informe, tráelos. La fisioterapia no sustituye una valoración médica cuando el caso lo pide.",
      },
      {
        q: "¿Solo tratas a quien compite?",
        a: "No. La consulta es para quien entrena CrossFit o entrenamiento funcional, compita o no. También para quien quiere volver a ese deporte después de una lesión.",
      },
    ],
  },
  ca: {
    name: "Fisioteràpia per a CrossFit",
    eyebrow: "Fisioteràpia esportiva a Mataró",
    title: "Fisioteràpia per a CrossFit a Mataró",
    lede: "Valoració, tractament i tornada a l'entrenament per a qui fa CrossFit o entrenament funcional. La consulta de Pol Carmona és al carrer Via Sèrgia 32, dins d'Oikos Training System.",
    paragraphs: [
      "Pol treballa amb persones que entrenen CrossFit: de qui va al box uns dies a la setmana a qui competeix. Coneix l'esport com a atleta i com a professional, i per això la visita parteix del que fas a l'entrenament, no d'una pauta genèrica.",
      "A la primera visita es parla de la molèstia, dels símptomes i de l'objectiu: seguir entrenant, tornar a un moviment o preparar una competició. Després hi ha una valoració per veure què limita el gest. El tractament s'adapta a aquell cas.",
      "Les eines són teràpia manual, exercici terapèutic, punció seca, neuromodulació i readaptació esportiva. No és un protocol fix de CrossFit. S'usa el que encaixa amb la lesió i amb la càrrega que pots tolerar.",
      "La consulta és a Mataró oest, carrer Via Sèrgia 32, 08302, amb accés fàcil des de la C-32. Atén en català i en castellà. Número de col·legiat 18685 del Col·legi de Fisioterapeutes de Catalunya.",
    ],
    situationsTitle: "Motius habituals de consulta",
    situations: [
      "Espatlla després de treball per sobre del cap, muscle-up o kipping.",
      "Genoll després d'esquats, salts al caixó o lunges.",
      "Zona lumbar després de pes mort o moviments olímpics.",
      "Canell, colze o tendó que avisa en carregar la barra.",
      "Tornada al WOD després d'una lesió muscular, tendinosa o articular.",
    ],
    note: "La fisioteràpia no substitueix una valoració mèdica quan el cas ho demana. Si un gest no toca aquella setmana, es diu a la visita.",
    faq: [
      {
        q: "Puc seguir fent CrossFit durant el tractament?",
        a: "En la majoria de casos sí, amb els ajustos que calguin. L'objectiu és que segueixis actiu mentre recuperes força, mobilitat i confiança. Si un exercici no toca, s'acorda a la visita.",
      },
      {
        q: "La primera visita és diferent si vinc pel CrossFit?",
        a: "L'estructura és la mateixa: història, símptomes i objectius, i després la valoració. Es té en compte l'entrenament, els moviments que molesten i el que vols tornar a fer.",
      },
      {
        q: "He de deixar d'entrenar fins a tenir una prova mèdica?",
        a: "No és obligatori portar proves. Si tens una ressonància o un informe, porta'ls. La fisioteràpia no substitueix una valoració mèdica quan el cas ho demana.",
      },
      {
        q: "Només tractes qui competeix?",
        a: "No. La consulta és per a qui entrena CrossFit o entrenament funcional, competeixi o no. També per a qui vol tornar a aquest esport després d'una lesió.",
      },
    ],
  },
} as const;

export function CrossfitView({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const site = ui[locale];
  const path = crossfitPath(locale);
  const alternate = crossfitPath(locale === "es" ? "ca" : "es");

  return (
    <SiteShell locale={locale} alternateHref={alternate}>
      <JsonLd data={faqJsonLd([...text.faq])} />
      <JsonLd data={serviceJsonLd(locale, text.name, path, text.lede)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: site.crumbsHome, path: homePath(locale) },
          { name: text.name, path },
        ])}
      />
      <article>
        <header className="mx-auto w-full max-w-6xl px-5 pb-8 pt-12 md:pt-16">
          <Breadcrumbs items={[{ name: site.crumbsHome, href: homePath(locale) }, { name: text.name }]} />
          <p className="mt-8 text-xs uppercase tracking-[0.18em] text-primary">{text.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.02] tracking-tight md:text-6xl">{text.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{text.lede}</p>
        </header>
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[1.6rem] md:aspect-[21/9]">
            <Image
              src="/media/pol-carmona.jpg"
              alt={locale === "ca" ? "Pol Carmona, fisioterapeuta a Mataró" : "Pol Carmona, fisioterapeuta en Mataró"}
              fill
              priority
              sizes="(min-width: 1152px) 1100px, 100vw"
              className="object-cover object-[center_20%]"
            />
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-14 md:grid-cols-12">
          <div className="space-y-5 text-[17px] leading-8 md:col-span-7">
            {text.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="text-sm leading-6 text-muted-foreground">{text.note}</p>
            <p className="text-sm leading-6 text-muted-foreground">{site.disclaimer}</p>
          </div>
          <aside className="md:col-span-5">
            <div className="rounded-[1.4rem] bg-[#e7e1d4]/70 p-6">
              <h2 className="font-serif text-2xl">{text.situationsTitle}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6">
                {text.situations.map((item) => (
                  <li key={item} className="border-t border-[#1c211c]/10 pt-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
        <section className="mx-auto w-full max-w-6xl px-5 pb-8">
          <h2 className="font-serif text-3xl tracking-tight">{site.faqTitle}</h2>
          <div className="mt-4">
            <FaqList items={[...text.faq]} />
          </div>
        </section>
        <section className="mx-auto w-full max-w-6xl px-5 py-10">
          <h2 className="font-serif text-2xl">{site.otherTherapies}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            <TherapyLinks locale={locale} />
          </ul>
        </section>
        <section id="cita" className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-28 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="font-serif text-4xl tracking-tight">{site.formTitle}</h2>
            <p className="mt-4 text-muted-foreground">{site.formLede}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              {clinic.street}, {clinic.postalCode} {clinic.city}
            </p>
          </div>
          <div className="md:col-span-7">
            <BookForm locale={locale} page={path} />
          </div>
        </section>
      </article>
    </SiteShell>
  );
}

function TherapyLinks({ locale }: { locale: Locale }) {
  return (
    <>
      {orderedTherapies().map((therapy) => (
        <li key={therapy.id}>
          <Link
            href={therapyPath(locale, therapy.slug[locale])}
            className="inline-flex rounded-full border border-border px-4 py-2 text-sm hover:bg-accent"
          >
            {therapy.name[locale]}
          </Link>
        </li>
      ))}
    </>
  );
}
