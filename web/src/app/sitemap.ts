import type { MetadataRoute } from "next";
import { therapies } from "@/content/therapies";
import { towns } from "@/content/towns";
import { absoluteUrl } from "@/lib/paths";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/ca", priority: 1 },
    { path: "/fisioterapia-mataro", priority: 0.9 },
    { path: "/ca/fisioterapia-mataro", priority: 0.9 },
    { path: "/cita", priority: 0.7 },
    { path: "/ca/hora", priority: 0.7 },
    { path: "/zonas", priority: 0.7 },
    { path: "/ca/zones", priority: 0.7 },
    { path: "/aviso-legal", priority: 0.2 },
    { path: "/ca/avis-legal", priority: 0.2 },
    { path: "/privacidad", priority: 0.2 },
    { path: "/ca/privacitat", priority: 0.2 },
  ];

  for (const therapy of therapies) {
    entries.push({ path: `/terapias/${therapy.slug.es}`, priority: 0.8 });
    entries.push({ path: `/ca/terapies/${therapy.slug.ca}`, priority: 0.8 });
  }
  for (const town of towns) {
    entries.push({ path: `/zonas/${town.slug}`, priority: 0.6 });
    entries.push({ path: `/ca/zones/${town.slug}`, priority: 0.6 });
  }

  return entries.map((entry) => ({
    url: absoluteUrl(entry.path),
    changeFrequency: "monthly",
    priority: entry.priority,
  }));
}
