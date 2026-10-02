/**
 * Build do institucional com pré-renderização.
 *
 * 1. Build normal do Vite (cliente) em `BUILD_OUT_DIR`, padrão `dist/`.
 * 2. Build SSR de `src/entry-server.tsx` numa pasta temporária.
 * 3. Renderiza o React para HTML e injeta no `index.html` do passo 1.
 *
 * O resultado é uma página que chega pronta, como no export do Next, e que o
 * `main.tsx` só hidrata. Robôs de busca e prévias de link leem o conteúdo sem
 * executar JavaScript.
 */
import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.resolve(root, process.env.BUILD_OUT_DIR || "dist");
const ssrDir = path.resolve(root, "node_modules/.ssr-build");

await build({ root, build: { outDir, emptyOutDir: true } });
await build({
  root,
  logLevel: "warn",
  build: { ssr: "src/entry-server.tsx", outDir: ssrDir, emptyOutDir: true },
});

const { render } = await import(
  pathToFileURL(path.join(ssrDir, "entry-server.js")).href
);
const indexPath = path.join(outDir, "index.html");
const template = await readFile(indexPath, "utf8");
if (!template.includes("<!--app-html-->")) {
  throw new Error("index.html sem o marcador <!--app-html-->");
}
await writeFile(indexPath, template.replace("<!--app-html-->", render()));

// O vite.config.ts normaliza VITE_SITE_URL em process.env ao ser carregado,
// então aqui ela já vem definida e sem barra final.
const siteUrl = process.env.VITE_SITE_URL;
await writeFile(
  path.join(outDir, "robots.txt"),
  `User-Agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);
await writeFile(
  path.join(outDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>${siteUrl}/</loc>
<lastmod>${new Date().toISOString()}</lastmod>
<changefreq>monthly</changefreq>
<priority>1</priority>
</url>
</urlset>
`,
);

await rm(ssrDir, { recursive: true, force: true });
console.log(`institucional pré-renderizado em ${outDir}`);
