import { spawn } from "node:child_process";
import { cp, mkdir, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stash = path.join(root, ".ovh-stash");
const moves = [
  ["src/app/api", "api"],
  ["src/app/admin", "admin"],
  ["src/app/robots.ts", "robots.ts"],
  ["src/app/sitemap.ts", "sitemap.ts"],
];

async function moveOut() {
  await mkdir(stash, { recursive: true });
  for (const [from, to] of moves) {
    await rename(path.join(root, from), path.join(stash, to));
  }
}

async function moveBack() {
  for (const [from, to] of moves) {
    await rename(path.join(stash, to), path.join(root, from));
  }
  await rm(stash, { recursive: true, force: true });
}

await moveOut();
let buildCode = 1;
try {
  buildCode = await new Promise((resolve) => {
    const child = spawn("npx", ["next", "build"], {
      cwd: root,
      stdio: "inherit",
      env: {
        ...process.env,
        OVH_EXPORT: "1",
        NEXT_PUBLIC_LEAD_API: "/cita.php",
      },
    });
    child.on("exit", (code) => resolve(code ?? 1));
  });
} finally {
  await moveBack();
}

if (buildCode !== 0) {
  process.exit(buildCode);
}

const dist = path.join(root, "ovh-dist");
await rm(dist, { recursive: true, force: true });
await cp(path.join(root, "out"), dist, { recursive: true });
await cp(path.join(root, "ovh"), dist, {
  recursive: true,
  filter: (source) => path.basename(source) !== "config.local.php",
});

const localConfig = path.join(root, "ovh", "config.local.php");
try {
  await cp(localConfig, path.join(dist, "config.local.php"));
} catch {
  // The sample stays in the folder until the hosting password is filled in.
}

await writeFile(path.join(dist, "robots.txt"), robotsTxt());
await writeFile(path.join(dist, "sitemap.xml"), await sitemapXml(dist));

function robotsTxt() {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /admin.php",
    "Disallow: /config.local.php",
    "Disallow: /config.sample.php",
    "",
    "Host: https://pcsfisioterapia.com",
    "Sitemap: https://pcsfisioterapia.com/sitemap.xml",
    "",
  ].join("\n");
}

async function sitemapXml(dir) {
  const paths = await htmlPaths(dir);
  const body = paths
    .map((urlPath) => {
      const priority = urlPath === "/" || urlPath === "/es" ? "1.0" : urlPath.includes("mataro") ? "0.9" : urlPath.includes("terap") ? "0.8" : "0.6";
      const loc = urlPath === "/" ? "https://pcsfisioterapia.com" : `https://pcsfisioterapia.com${urlPath}`;
      return `  <url><loc>${loc}</loc><priority>${priority}</priority></url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

async function htmlPaths(dir, base = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
    const rel = base === "" ? entry.name : `${base}/${entry.name}`;
    if (entry.isDirectory()) {
      if (entry.name === "media") continue;
      paths.push(...(await htmlPaths(path.join(dir, entry.name), rel)));
      continue;
    }
    if (!entry.name.endsWith(".html") || entry.name === "404.html") continue;
    let urlPath = `/${rel.slice(0, -".html".length)}`;
    if (urlPath.endsWith("/index")) urlPath = urlPath.slice(0, -"index".length);
    if (urlPath.length > 1 && urlPath.endsWith("/")) urlPath = urlPath.slice(0, -1);
    paths.push(urlPath === "" ? "/" : urlPath);
  }
  return paths.sort();
}
