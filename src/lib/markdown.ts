import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

const MANIFEST_PATH = path.join(process.cwd(), "content/.image-manifest.json");

export function loadManifest(): Record<string, { r2Url: string; contentHash: string }> {
  try {
    const raw = fs.readFileSync(MANIFEST_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function resolveImageUrl(
  relativePath: string,
  context: string,
  manifest: Record<string, { r2Url: string; contentHash: string }>,
  basePath: string
): string {
  const manifestKey = `${context}/${path.basename(relativePath)}`;
  const entry = manifest[relativePath] || manifest[manifestKey];
  if (entry) return entry.r2Url;
  return `${basePath}/content-images/${relativePath.replace(/^images\//, "")}`;
}

export function extractFirstImage(markdown: string): string | null {
  const match = markdown.match(/!\[[^\]]*\]\((images\/[^)]+)\)/);
  return match ? match[1] : null;
}

export function rewriteImageUrls(
  html: string,
  imageContext: string,
  manifest: Record<string, { r2Url: string; contentHash: string }>,
  basePath: string
): string {
  return html.replace(
    /src="(images\/[^"]+)"/g,
    (match, relativePath) => {
      const manifestKey = `${imageContext}/${path.basename(relativePath)}`;
      const entry = manifest[relativePath] || manifest[manifestKey];
      if (entry) return `src="${entry.r2Url}"`;
      return `src="${basePath}/content-images/${relativePath.replace(/^images\//, "")}"`;
    }
  );
}

export function rewriteCrossLinks(html: string, basePath: string): string {
  return html.replace(
    /href="\.\/([^"]+)"/g,
    (_, slug) => `href="${basePath}/${slug}"`
  );
}

export async function renderMarkdown(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(content);
  return String(result);
}
