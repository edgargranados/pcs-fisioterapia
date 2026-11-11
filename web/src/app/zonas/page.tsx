import { ZonesView } from "@/components/zones-view";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  locale: "es",
  title: "Fisioterapia cerca de Mataró",
  description:
    "Pol Carmona pasa consulta en Mataró y atiende a gente de Cabrils, Argentona, Premià, Vilassar, Llavaneres, Alella y el Maresme.",
  path: "/zonas",
  esPath: "/zonas",
  caPath: "/ca/zones",
});

export default function Page() {
  return <ZonesView locale="es" />;
}
