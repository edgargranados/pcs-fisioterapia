import { MataroView } from "@/components/mataro-view";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  locale: "es",
  title: "Fisioterapia en Mataró",
  description:
    "Fisioterapeuta en Mataró, Carrer Via Sèrgia 32. Pol Carmona atiende espalda, hombro y rodilla, y la vuelta al deporte. Pide cita.",
  path: "/fisioterapia-mataro",
  esPath: "/fisioterapia-mataro",
  caPath: "/ca/fisioterapia-mataro",
});

export default function Page() {
  return <MataroView locale="es" />;
}
