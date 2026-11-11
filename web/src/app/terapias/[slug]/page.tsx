import { notFound } from "next/navigation";
import { TherapyView } from "@/components/therapy-view";
import { therapies, therapyBySlug } from "@/content/therapies";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return therapies.map((therapy) => ({ slug: therapy.slug.es }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const therapy = therapyBySlug("es", slug);
  if (!therapy) return {};
  return pageMeta({
    locale: "es",
    title: `${therapy.name.es} en Mataró`,
    description: therapy.summary.es,
    path: `/terapias/${therapy.slug.es}`,
    esPath: `/terapias/${therapy.slug.es}`,
    caPath: `/ca/terapies/${therapy.slug.ca}`,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const therapy = therapyBySlug("es", slug);
  if (!therapy) notFound();
  return <TherapyView locale="es" therapy={therapy} />;
}
