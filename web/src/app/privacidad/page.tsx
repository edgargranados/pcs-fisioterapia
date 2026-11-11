import { LegalView } from "@/components/legal-view";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  locale: "es",
  title: "Privacidad",
  description: "Cómo PCS Fisioterapia guarda el nombre y el teléfono cuando pides cita en Mataró.",
  path: "/privacidad",
  esPath: "/privacidad",
  caPath: "/ca/privacitat",
});

export default function Page() {
  return <LegalView locale="es" kind="privacy" />;
}
