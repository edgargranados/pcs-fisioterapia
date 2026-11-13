import Image from "next/image";
import Link from "next/link";
import { BookForm } from "@/components/book-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import type { Therapy } from "@/content/therapies";
import { orderedTherapies } from "@/content/therapies";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/locale";
import { homePath, therapyPath } from "@/lib/paths";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";

export function TherapyView({ locale, therapy }: { locale: Locale; therapy: Therapy }) {
  const copy = ui[locale];
  const path = therapyPath(locale, therapy.slug[locale]);
  const alternate = therapyPath(locale === "es" ? "ca" : "es", therapy.slug[locale === "es" ? "ca" : "es"]);
  const crumbs = [
    { name: copy.crumbsHome, href: homePath(locale) },
    { name: therapy.name[locale] },
  ];

  return (
    <SiteShell locale={locale} alternateHref={alternate}>
      <JsonLd data={faqJsonLd(therapy.faq[locale])} />
      <JsonLd data={serviceJsonLd(locale, therapy.name[locale], path, therapy.summary[locale])} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: copy.crumbsHome, path: homePath(locale) },
          { name: therapy.name[locale], path },
        ])}
      />
      <article>
        <header className="mx-auto w-full max-w-6xl px-5 pb-8 pt-12 md:pt-16">
          <Breadcrumbs items={crumbs} />
          <p className="mt-8 text-xs uppercase tracking-[0.18em] text-primary">
            {locale === "ca" ? "Fisioteràpia a Mataró" : "Fisioterapia en Mataró"}
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.02] tracking-tight md:text-6xl">
            {therapy.name[locale]}
            <span className="block italic font-normal text-muted-foreground">
              {locale === "ca" ? "a Mataró" : "en Mataró"}
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{therapy.summary[locale]}</p>
        </header>
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[1.6rem] md:aspect-[21/9]">
            <Image
              src={therapy.image}
              alt={therapy.imageAlt[locale]}
              fill
              priority
              sizes="(min-width: 1152px) 1100px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-14 md:grid-cols-12">
          <div className="space-y-5 text-[17px] leading-8 md:col-span-7">
            {therapy.paragraphs[locale].map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="text-sm leading-6 text-muted-foreground">{therapy.note[locale]}</p>
            <p className="text-sm leading-6 text-muted-foreground">{copy.disclaimer}</p>
          </div>
          <aside className="md:col-span-5">
            <div className="rounded-[1.4rem] bg-[#e7e1d4]/70 p-6">
              <h2 className="font-serif text-2xl">{locale === "ca" ? "Per a qui" : "Para quién"}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6">
                {therapy.forWhom[locale].map((item) => (
                  <li key={item} className="border-t border-[#1c211c]/10 pt-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
        <section className="mx-auto w-full max-w-6xl px-5 pb-8">
          <h2 className="font-serif text-3xl tracking-tight">{copy.faqTitle}</h2>
          <div className="mt-4">
            <FaqList items={therapy.faq[locale]} />
          </div>
        </section>
        <section className="mx-auto w-full max-w-6xl px-5 py-10">
          <h2 className="font-serif text-2xl">{copy.otherTherapies}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {orderedTherapies()
              .filter((item) => item.id !== therapy.id)
              .map((item) => (
                <li key={item.id}>
                  <Link href={therapyPath(locale, item.slug[locale])} className="inline-flex rounded-full border border-border px-4 py-2 text-sm hover:bg-accent">
                    {item.name[locale]}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
        <section id="cita" className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-28 md:grid-cols-12">
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
