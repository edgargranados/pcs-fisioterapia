import { CrossfitView } from "@/components/crossfit-view";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  locale: "ca",
  title: "Fisioteràpia per a CrossFit a Mataró",
  description:
    "Fisioteràpia per a CrossFit i entrenament funcional a Mataró. Pol Carmona valora, tracta i acompanya la tornada al box. Via Sèrgia 32. Demana hora.",
  path: "/ca/fisioterapia-crossfit-mataro",
  esPath: "/fisioterapia-crossfit-mataro",
  caPath: "/ca/fisioterapia-crossfit-mataro",
});

export default function Page() {
  return <CrossfitView locale="ca" />;
}
