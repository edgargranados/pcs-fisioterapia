import { LegalView } from "@/components/legal-view";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  locale: "es",
  title: "Aviso legal",
  description: "Aviso legal de PCS Fisioterapia, la consulta de Pol Carmona Santandreu en Via Sèrgia 32, Mataró.",
  path: "/aviso-legal",
  esPath: "/aviso-legal",
  caPath: "/ca/avis-legal",
});

export default function Page() {
  return <LegalView locale="es" kind="legal" />;
}
