import { ZonesView } from "@/components/zones-view";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  locale: "ca",
  title: "Fisioteràpia a prop de Mataró",
  description:
    "Pol Carmona passa consulta a Mataró i atén gent de Cabrils, Argentona, Premià, Vilassar, Llavaneres, Alella i el Maresme.",
  path: "/ca/zones",
  esPath: "/zonas",
  caPath: "/ca/zones",
});

export default function Page() {
  return <ZonesView locale="ca" />;
}
