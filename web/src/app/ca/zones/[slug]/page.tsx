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
    locale: "ca",
    title: `Fisioterapeuta a prop de ${town.name}`,
    description: `Fisioteràpia a Mataró per a qui viu a ${town.name}. Uns ${town.minutes} minuts fins a Via Sèrgia 32. Pol Carmona, hora prèvia.`,
    path: `/ca/zones/${town.slug}`,
    esPath: `/zonas/${town.slug}`,
    caPath: `/ca/zones/${town.slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const town = townBySlug(slug);
  if (!town) notFound();
  return <TownView locale="ca" town={town} />;
}
