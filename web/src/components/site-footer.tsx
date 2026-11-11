import Link from "next/link";
import { orderedTherapies } from "@/content/therapies";
import { towns } from "@/content/towns";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/locale";
import { bookPath, homePath, legalPath, mataroPath, privacyPath, therapyPath, zonePath, zonesPath } from "@/lib/paths";
import { clinic } from "@/lib/site";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = ui[locale];

  return (
    <footer className="bg-[#16281f] pb-24 text-[#f6f3ec] md:pb-0">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-serif text-3xl tracking-tight">{clinic.brand}</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-[#f6f3ec]/75">{copy.footerNote}</p>
          <address className="mt-6 text-sm leading-7 not-italic">
            {clinic.person}
            <br />
            {clinic.brand}
            <br />
            {copy.factAddressValue}
            <br />
            {copy.college}
          </address>
          <a href={clinic.maps} className="mt-4 inline-block text-sm underline underline-offset-4" target="_blank" rel="noopener noreferrer">
            {copy.howToGet}
          </a>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs uppercase tracking-[0.16em] text-[#f6f3ec]/60">{copy.therapies}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {orderedTherapies().map((therapy) => (
              <li key={therapy.id}>
                <Link href={therapyPath(locale, therapy.slug[locale])} className="hover:underline">
                  {therapy.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs uppercase tracking-[0.16em] text-[#f6f3ec]/60">{copy.footerZones}</p>
          <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-sm">
            <li>
              <Link href={mataroPath(locale)} className="hover:underline">
                Mataró
              </Link>
            </li>
            {towns.map((town) => (
              <li key={town.slug}>
                <Link href={zonePath(locale, town.slug)} className="whitespace-nowrap hover:underline">
                  {town.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs uppercase tracking-[0.16em] text-[#f6f3ec]/60">{copy.consult}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href={bookPath(locale)} className="hover:underline">
                {copy.book}
              </Link>
            </li>
            <li>
              <Link href={zonesPath(locale)} className="hover:underline">
                {copy.zones}
              </Link>
            </li>
            <li>
              <Link href={homePath(locale)} className="hover:underline">
                {copy.crumbsHome}
              </Link>
            </li>
            <li>
              <Link href={legalPath(locale)} className="hover:underline">
                {copy.legalTitle}
              </Link>
            </li>
            <li>
              <Link href={privacyPath(locale)} className="hover:underline">
                {copy.privacyTitle}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-[#f6f3ec]/60 sm:flex-row sm:justify-between">
          <p>© 2026 {clinic.fullName}</p>
          <p>
            {clinic.collegeName} · {clinic.collegeNumber}
          </p>
        </div>
      </div>
    </footer>
  );
}
