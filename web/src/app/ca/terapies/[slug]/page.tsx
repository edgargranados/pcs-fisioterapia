import { notFound } from "next/navigation";
import { TherapyView } from "@/components/therapy-view";
import { therapies, therapyBySlug } from "@/content/therapies";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return therapies.map((therapy) => ({ slug: therapy.slug.ca }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const therapy = therapyBySlug("ca", slug);
  if (!therapy) return {};
  return pageMeta({
    locale: "ca",
    title: `${therapy.name.ca} a Mataró`,
    description: therapy.summary.ca,
    path: `/ca/terapies/${therapy.slug.ca}`,
    esPath: `/terapias/${therapy.slug.es}`,
    caPath: `/ca/terapies/${therapy.slug.ca}`,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const therapy = therapyBySlug("ca", slug);
  if (!therapy) notFound();
  return <TherapyView locale="ca" therapy={therapy} />;
}
