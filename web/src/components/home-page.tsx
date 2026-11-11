import Image from "next/image";
import Link from "next/link";
import { BookForm } from "@/components/book-form";
import { FaqList } from "@/components/faq-list";
import { HeroVideo } from "@/components/hero-video";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import { therapies } from "@/content/therapies";
import { towns } from "@/content/towns";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/locale";
import { bookPath, homePath, mataroPath, therapyPath, zonePath, zonesPath } from "@/lib/paths";
import { clinic, mapEmbed } from "@/lib/site";
import { faqJsonLd } from "@/lib/seo";

export function HomePage({ locale }: { locale: Locale }) {
  const copy = ui[locale];
  const alternate = locale === "es" ? "/ca" : "/";

  return (
    <SiteShell locale={locale} alternateHref={alternate}>
      <JsonLd data={faqJsonLd(copy.homeFaq)} />
      <section className="relative min-h-[100svh] overflow-hidden bg-[#141815] text-[#f6f3ec]">
        <Image
          src="/media/hero-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <HeroVideo />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,20,17,0.35)_0%,rgba(16,20,17,0.18)_38%,rgba(16,20,17,0.62)_72%,rgba(16,20,17,0.82)_86%,#f3efe6_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,20,17,0.72)_0%,rgba(16,20,17,0.28)_58%,rgba(16,20,17,0.08)_100%)]" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-36 pt-28 md:justify-center md:pb-28">
          <p className="text-xs uppercase tracking-[0.2em] text-[#f6f3ec]/80">{copy.heroEyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-serif text-[3.2rem] leading-[0.92] tracking-[-0.03em] sm:text-7xl lg:text-[6rem]">
            {copy.heroTitleLead}
            <span className="block italic font-normal">{copy.heroTitlePlace}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#f6f3ec]/88 sm:text-lg">{copy.heroLede}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={bookPath(locale)} className="inline-flex h-12 items-center justify-center rounded-full bg-[#f6f3ec] px-6 text-base font-medium text-[#1c211c] hover:bg-white">
              {copy.book}
            </Link>
            <Link
              href="#terapias"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-6 text-base text-[#f6f3ec] hover:bg-white/10"
            >
              {copy.heroSecondary}
            </Link>
          </div>
          <p className="mt-8 text-sm text-[#f6f3ec]/80">
            {clinic.street} · {clinic.postalCode} {clinic.city}
          </p>
        </div>
      </section>

      <div className="border-b border-border">
        <ul className="mx-auto flex w-full max-w-6xl gap-x-6 gap-y-3 overflow-x-auto px-5 py-4 text-sm">
          {therapies.map((therapy) => (
            <li key={therapy.id} className="shrink-0">
              <Link href={therapyPath(locale, therapy.slug[locale])} className="hover:text-primary">
                {therapy.name[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-4">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">{copy.introKicker}</p>
        </div>
        <div className="md:col-span-8">
          <h2 className="font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl">{copy.introTitle}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{copy.introBody}</p>
        </div>
      </section>

      <section className="bg-[#e7e1d4]/50">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-24">
          <h2 className="font-serif text-3xl tracking-tight md:text-4xl">{copy.stepsTitle}</h2>
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

      <section id="terapias" className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-serif text-4xl tracking-tight md:text-5xl">{copy.therapies}</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {therapies.map((therapy, index) => (
            <Link
              key={therapy.id}
              href={therapyPath(locale, therapy.slug[locale])}
              className={`group relative overflow-hidden rounded-[1.6rem] bg-[#1c211c] text-[#f6f3ec] ${index === 0 ? "min-h-[28rem] md:min-h-[34rem]" : "min-h-80"}`}
            >
              <Image
                src={therapy.image}
                alt={therapy.imageAlt[locale]}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover opacity-80 transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141815] via-[#141815]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <h3 className="font-serif text-3xl tracking-tight md:text-4xl">{therapy.name[locale]}</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-[#f6f3ec]/85">{therapy.summary[locale]}</p>
                <p className="mt-4 text-sm underline underline-offset-4">{copy.readMore}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="pol" className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-8 md:grid-cols-12 md:py-16">
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
          <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">{clinic.graduation}</dt>
              <dd className="mt-1 font-medium">{clinic.graduationYears}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{copy.college}</dt>
              <dd className="mt-1 font-medium">{clinic.collegeName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{clinic.city}</dt>
              <dd className="mt-1 font-medium">{copy.languages}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="consulta" className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary">{copy.addressLabel}</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight">{clinic.place}</h2>
          <p className="mt-4 text-lg leading-8">
            {clinic.street}
            <br />
            {clinic.postalCode} {clinic.city}
          </p>
          <p className="mt-4 text-muted-foreground">{copy.byAppointment}. {copy.mustMember}</p>
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

      <section className="bg-[#16281f] text-[#f6f3ec]">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <p className="text-xs uppercase tracking-[0.18em] text-[#f6f3ec]/60">{copy.zonesKicker}</p>
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

      <section className="mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
        <h2 className="max-w-xl font-serif text-4xl tracking-tight md:text-5xl">{copy.faqTitle}</h2>
        <div className="mt-8">
          <FaqList items={copy.homeFaq} />
        </div>
      </section>

      <section id="cita" className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-28 md:grid-cols-12 md:pb-32">
        <div className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">{copy.formKicker}</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight md:text-5xl">{copy.formTitle}</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{copy.formLede}</p>
          <p className="mt-6 text-sm text-muted-foreground">
            <Link href={homePath(locale)} className="underline underline-offset-4">
              {clinic.brand}
            </Link>
            {" · "}
            {clinic.street}, {clinic.city}
          </p>
        </div>
        <div className="md:col-span-7">
          <BookForm locale={locale} page={homePath(locale)} />
        </div>
      </section>
    </SiteShell>
  );
}
