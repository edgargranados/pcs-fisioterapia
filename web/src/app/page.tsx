import { HomePage } from "@/components/home-page";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  locale: "ca",
  title: "Fisioteràpia esportiva a Mataró",
  description:
    "Fisioteràpia esportiva i readaptació funcional. Pol Carmona t'ajuda a recuperar-te de les lesions, millorar la mobilitat i tornar a l'esport. Via Sèrgia 32, Mataró.",
  path: "/",
  esPath: "/es",
  caPath: "/",
  xDefault: "/",
});

export default function Page() {
  return <HomePage locale="ca" />;
}
