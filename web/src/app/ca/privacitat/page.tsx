import { LegalView } from "@/components/legal-view";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  locale: "ca",
  title: "Privacitat",
  description: "Com PCS Fisioterapia desa el nom i el telèfon quan demanes hora a Mataró.",
  path: "/ca/privacitat",
  esPath: "/privacidad",
  caPath: "/ca/privacitat",
});

export default function Page() {
  return <LegalView locale="ca" kind="privacy" />;
}
