import { BookButton } from "@/components/appointment-wizard";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/locale";

export function BookForm({ locale, page }: { locale: Locale; page: string }) {
  const copy = ui[locale];
  return (
    <div id="cita-accion" className="rounded-[1.6rem] border border-border bg-card p-6 shadow-[0_24px_60px_-36px_rgba(28,33,28,0.55)] sm:p-8">
      <p className="text-xs uppercase tracking-[0.18em] text-primary">{copy.formKicker}</p>
      <h3 className="mt-3 font-serif text-3xl tracking-tight">{copy.wizardPrefTitle}</h3>
      <BookButton
        page={page}
        className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground hover:bg-[#08685f] sm:w-auto"
      >
        {copy.formSubmit}
      </BookButton>
    </div>
  );
}
