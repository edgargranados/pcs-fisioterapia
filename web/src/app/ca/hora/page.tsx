import { BookForm } from "@/components/book-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteShell } from "@/components/site-shell";
import { ui } from "@/content/ui";
import { bookPath, homePath } from "@/lib/paths";
import { clinic } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  locale: "ca",
  title: "Demanar hora de fisioteràpia a Mataró",
  description:
    "Demana hora amb Pol Carmona, fisioterapeuta a Via Sèrgia 32, Mataró. Nom i telèfon. El correu és opcional.",
  path: "/ca/hora",
  esPath: "/cita",
  caPath: "/ca/hora",
});

export default function Page() {
  const copy = ui.ca;
  return (
    <SiteShell locale="ca" alternateHref="/cita" hideMobileCta>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 pb-28 md:grid-cols-12">
        <div className="md:col-span-5">
          <Breadcrumbs items={[{ name: copy.crumbsHome, href: homePath("ca") }, { name: copy.book }]} />
          <p className="mt-8 text-xs uppercase tracking-[0.18em] text-primary">{copy.bookEyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight md:text-6xl">{copy.bookTitle}</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{copy.bookLede}</p>
          <p className="mt-6 text-sm leading-7">
            {clinic.brand}
            <br />
            {clinic.person}
            <br />
            {copy.factAddressValue}
            <br />
            {copy.college}
          </p>
        </div>
        <div id="cita" className="md:col-span-7">
          <BookForm locale="ca" page={bookPath("ca")} />
        </div>
      </div>
    </SiteShell>
  );
}
