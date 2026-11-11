import { HomePage } from "@/components/home-page";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  locale: "es",
  title: "Fisioterapia deportiva en Mataró",
  description:
    "Fisioterapia deportiva y readaptación funcional. Pol Carmona te ayuda a recuperarte de las lesiones, mejorar la movilidad y volver al deporte. Via Sèrgia 32, Mataró.",
  path: "/es",
  esPath: "/es",
  caPath: "/",
  xDefault: "/",
});

export default function Page() {
  return <HomePage locale="es" />;
}
