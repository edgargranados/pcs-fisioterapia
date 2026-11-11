import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin.php", "/api/", "/config.local.php", "/config.sample.php"],
    },
    sitemap: "https://pcsfisioterapia.com/sitemap.xml",
    host: "https://pcsfisioterapia.com",
  };
}
