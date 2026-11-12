import { CrossfitView } from "@/components/crossfit-view";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  locale: "es",
  title: "Fisioterapia para CrossFit en Mataró",
  description:
    "Fisioterapia para CrossFit y entrenamiento funcional en Mataró. Pol Carmona valora, trata y acompaña la vuelta al box. Via Sèrgia 32. Pide cita.",
  path: "/fisioterapia-crossfit-mataro",
  esPath: "/fisioterapia-crossfit-mataro",
  caPath: "/ca/fisioterapia-crossfit-mataro",
});

export default function Page() {
  return <CrossfitView locale="es" />;
}
