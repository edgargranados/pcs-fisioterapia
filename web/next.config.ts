import type { NextConfig } from "next";

const ovhExport = process.env.OVH_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(ovhExport
    ? { output: "export" as const, images: { unoptimized: true } }
    : { cacheComponents: true, partialPrefetching: true }),
  serverExternalPackages: ["@electric-sql/pglite", "pg"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  ...(ovhExport
    ? {}
    : {
        async redirects() {
          return [
            { source: "/ca/cita", destination: "/ca/hora", permanent: true },
            { source: "/ca", destination: "/", permanent: true },
          ];
        },
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
              ],
            },
            {
              source: "/admin",
              headers: [{ key: "Cache-Control", value: "private, no-store" }],
            },
            {
              source: "/api/:path*",
              headers: [{ key: "Cache-Control", value: "no-store" }],
            },
          ];
        },
      }),
};

export default nextConfig;
