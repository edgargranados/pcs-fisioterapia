import { HomePage } from "@/components/home-page";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  locale: "es",
  title: "Fisioterapeuta en Mataró",
  description:
    "Consulta de fisioterapia deportiva en Via Sèrgia 32, Mataró. Pol Carmona: terapia manual, punción seca, neuromodulación y readaptación. Pide cita.",
  path: "/",
  esPath: "/",
  caPath: "/ca",
});

export default function Page() {
  return <HomePage locale="es" />;
}
