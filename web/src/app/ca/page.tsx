import { HomePage } from "@/components/home-page";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  locale: "ca",
  title: "Fisioterapeuta a Mataró",
  description:
    "Consulta de fisioteràpia esportiva a Via Sèrgia 32, Mataró. Pol Carmona: teràpia manual, punció seca, neuromodulació i readaptació. Demana hora.",
  path: "/ca",
  esPath: "/",
  caPath: "/ca",
});

export default function Page() {
  return <HomePage locale="ca" />;
}
