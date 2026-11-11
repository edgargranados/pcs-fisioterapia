import { AppointmentForm } from "@/components/appointment-form";
import type { Locale } from "@/lib/locale";
import { getWhatsappNumber } from "@/lib/whatsapp";

export function BookForm({ locale, page }: { locale: Locale; page: string }) {
  return <AppointmentForm locale={locale} page={page} whatsappNumber={getWhatsappNumber()} />;
}
