import { LegalView } from "@/components/legal-view";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  locale: "ca",
  title: "Avís legal",
  description: "Avís legal de PCS Fisioterapia, la consulta de Pol Carmona Santandreu a Via Sèrgia 32, Mataró.",
  path: "/ca/avis-legal",
  esPath: "/aviso-legal",
  caPath: "/ca/avis-legal",
});

export default function Page() {
  return <LegalView locale="ca" kind="legal" />;
}
