import { MataroView } from "@/components/mataro-view";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  locale: "ca",
  title: "Fisioteràpia a Mataró",
  description:
    "Fisioterapeuta a Mataró, carrer Via Sèrgia 32. Pol Carmona atén esquena, espatlla i genoll, i la tornada a l'esport. Demana hora.",
  path: "/ca/fisioterapia-mataro",
  esPath: "/fisioterapia-mataro",
  caPath: "/ca/fisioterapia-mataro",
});

export default function Page() {
  return <MataroView locale="ca" />;
}
