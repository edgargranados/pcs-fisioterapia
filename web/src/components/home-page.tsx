import Image from "next/image";
import Link from "next/link";
import { BookButton } from "@/components/appointment-wizard";
import { BookForm } from "@/components/book-form";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { FaqList } from "@/components/faq-list";
import { HeroVideo } from "@/components/hero-video";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import { orderedTherapies } from "@/content/therapies";
import { towns } from "@/content/towns";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/locale";
import { crossfitPath, homePath, mataroPath, therapyPath, zonePath, zonesPath } from "@/lib/paths";
import { clinic, mapEmbed } from "@/lib/site";
import { faqJsonLd } from "@/lib/seo";

export function HomePage({ locale }: { locale: Locale }) {
  const copy = ui[locale];
  const alternate = homePath(locale === "ca" ? "es" : "ca");
  const facts = [
    { label: copy.factName, value: clinic.person },
    { label: copy.factCentre, value: clinic.brand },
    { label: copy.factAddress, value: copy.factAddressValue },
    { label: copy.factCollege, value: clinic.collegeNumber },
  ];

  return (
    <SiteShell locale={locale} alternateHref={alternate} hideMobileCta>
      <JsonLd data={faqJsonLd(copy.homeFaq)} />
      <section className="hero-screen home-hero relative overflow-hidden bg-[#141815] text-[#f6f3ec]">
        <Image
          src="/media/hero-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <HeroVideo />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,20,17,0.45)_0%,rgba(16,20,17,0.22)_42%,rgba(16,20,17,0.55)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,20,17,0.82)_0%,rgba(16,20,17,0.42)_52%,rgba(16,20,17,0.12)_100%)]" />
        <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col justify-end overflow-hidden px-5 py-8 md:justify-center md:py-16">
          <h1 className="max-w-4xl">
            <span className="block text-sm font-medium uppercase tracking-[0.28em] text-[#f6f3ec]/85">
              {copy.heroBrand}
            </span>
            <span className="mt-4 block font-serif text-[2.7rem] leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
              {copy.heroTitle.split(/(?<=\.)\s+/).map((sentence) => (
                <span key={sentence} className="inline-block pr-[0.25em]">
                  {sentence}
                </span>
              ))}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#f6f3ec]/90 sm:text-lg">{copy.heroLede}</p>
          <div className="mt-8">
            <BookButton className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground hover:bg-[#08685f]">
              {copy.heroCta}
            </BookButton>
          </div>
          <p className="mt-8 text-sm tracking-wide text-[#f6f3ec]/85">{copy.heroPlace}</p>
        </div>
      </section>

      <MobileCtaBar label={copy.book} dock="under-hero" />

      <section id="pol" className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-12 md:py-28">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] md:col-span-5">
          <Image
            src="/media/pol-carmona.jpg"
            alt={copy.aboutImageAlt}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="md:col-span-7 md:pl-6">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">{copy.aboutKicker}</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight md:text-6xl">{copy.aboutTitle}</h2>
          <div className="mt-6 space-y-4 text-[17px] leading-8 text-muted-foreground">
            {copy.aboutBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label} className="border-t border-border pt-3">
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{fact.label}</dt>
                <dd className="mt-1 font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="serveis" className="border-t border-border bg-[#f7f4ee]">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
          <h2 className="font-serif text-4xl tracking-tight md:text-6xl">{copy.servicesTitle}</h2>
          <ol className="mt-12">
            {orderedTherapies().map((therapy, index) => (
              <li key={therapy.id} className="grid items-center gap-6 border-t border-border py-8 md:grid-cols-12 md:gap-10 md:py-10">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.4rem] md:col-span-5">
                  <Image
                    src={therapy.image}
                    alt={therapy.imageAlt[locale]}
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="md:col-span-7">
                  <p className="font-serif text-sm text-primary">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 font-serif text-3xl tracking-tight md:text-5xl">{therapy.name[locale]}</h3>
                  <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">{therapy.summary[locale]}</p>
                  <Link
                    href={therapyPath(locale, therapy.slug[locale])}
                    className="mt-5 inline-block text-sm underline underline-offset-4"
                  >
                    {copy.readMore}
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="proces" className="bg-[#e7e1d4]/70">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-24">
          <h2 className="font-serif text-4xl tracking-tight md:text-5xl">{copy.stepsTitle}</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-4">
            {copy.steps.map((step, index) => (
              <li key={step.title}>
                <p className="font-serif text-4xl text-primary/70">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-serif text-2xl leading-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="pacients" className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <h2 className="max-w-xl font-serif text-4xl tracking-tight md:text-5xl">{copy.audienceTitle}</h2>
        <ul className="mt-10 grid gap-x-12 md:grid-cols-2">
          {copy.audience.map((item, index) => (
            <li key={item} className="border-t border-border py-4 font-serif text-2xl leading-snug">
              {index === 0 ? (
                <Link href={crossfitPath(locale)} className="underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
                  {item}
                </Link>
              ) : (
                item
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-8 md:pb-12">
        <h2 className="max-w-xl font-serif text-4xl tracking-tight md:text-5xl">{copy.faqTitle}</h2>
        <div className="mt-8">
          <FaqList items={copy.homeFaq} />
        </div>
      </section>

      <section className="bg-primary text-[#f6f3ec]">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <p className="text-xs uppercase tracking-[0.18em] text-[#f6f3ec]/80">{copy.zonesKicker}</p>
          <h2 className="mt-3 max-w-xl font-serif text-4xl tracking-tight md:text-5xl">{copy.zonesTitle}</h2>
          <p className="mt-5 max-w-2xl text-[#f6f3ec]/80">{copy.zonesBody}</p>
          <ul className="mt-10 flex flex-wrap gap-2">
            {towns.map((town) => (
              <li key={town.slug}>
                <Link
                  href={zonePath(locale, town.slug)}
                  className="inline-flex rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
                >
                  {town.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={zonesPath(locale)} className="mt-8 inline-block text-sm underline underline-offset-4">
            {copy.allZones}
          </Link>
        </div>
      </section>

      <section id="consulta" className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary">{copy.addressLabel}</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight">{clinic.brand}</h2>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-muted-foreground">{fact.label}</dt>
                <dd className="mt-1 font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-muted-foreground">{copy.locationNote}</p>
          <p className="mt-3 text-muted-foreground">{copy.byAppointment}. {copy.mustMember}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link href={mataroPath(locale)} className="underline underline-offset-4">
              {copy.mataroTitle}
            </Link>
            <a href={clinic.maps} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              {copy.howToGet}
            </a>
          </div>
        </div>
        <iframe
          title={copy.mapTitle}
          src={mapEmbed}
          className="h-80 w-full rounded-[1.4rem] border border-border"
          loading="lazy"
        />
      </section>

      <section id="cita" className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-28 md:grid-cols-12 md:pb-32">
        <div className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">{copy.formKicker}</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight md:text-5xl">{copy.formTitle}</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{copy.formLede}</p>
          <p className="mt-6 text-sm text-muted-foreground">
            {clinic.brand}
            {" · "}
            {copy.heroPlace}
          </p>
        </div>
        <div className="md:col-span-7">
          <BookForm locale={locale} page={homePath(locale)} />
        </div>
      </section>
    </SiteShell>
  );
}
