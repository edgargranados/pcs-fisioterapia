import { notFound } from "next/navigation";
import { TownView } from "@/components/town-view";
import { townBySlug, towns } from "@/content/towns";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return towns.map((town) => ({ slug: town.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const town = townBySlug(slug);
  if (!town) return {};
  return pageMeta({
    locale: "es",
    title: `Fisioterapeuta cerca de ${town.name}`,
    description: `Fisioterapia en Mataró para quien vive en ${town.name}. Unos ${town.minutes} minutos hasta Via Sèrgia 32. Pol Carmona, cita previa.`,
    path: `/zonas/${town.slug}`,
    esPath: `/zonas/${town.slug}`,
    caPath: `/ca/zones/${town.slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const town = townBySlug(slug);
  if (!town) notFound();
  return <TownView locale="es" town={town} />;
}
