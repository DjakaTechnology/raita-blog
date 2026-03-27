import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { WikiPage, WikiPageMeta, WikiSection, WikiFrontmatter } from "./types";
import {
  loadManifest,
  rewriteImageUrls,
  rewriteCrossLinks,
  renderMarkdown,
} from "./markdown";

const WIKI_DIR = path.join(process.cwd(), "content/wiki");

function readWikiFile(filePath: string): { frontmatter: WikiFrontmatter; content: string } | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as WikiFrontmatter;
  if (frontmatter.draft) return null;
  return { frontmatter, content };
}

function slugFromPath(filePath: string): string {
  const relative = path.relative(WIKI_DIR, filePath).replace(/\\/g, "/");
  return relative.replace(/\.md$/, "").replace(/\/index$/, "");
}

export function getWikiTree(): WikiSection[] {
  if (!fs.existsSync(WIKI_DIR)) return [];

  function buildSection(dir: string): WikiSection {
    const indexPath = path.join(dir, "index.md");
    const indexData = readWikiFile(indexPath);
    const dirName = path.basename(dir);
    const slug = path.relative(WIKI_DIR, dir).replace(/\\/g, "/");

    const section: WikiSection = {
      title: indexData?.frontmatter.title || dirName.replace(/-/g, " "),
      slug,
      description: indexData?.frontmatter.description || "",
      order: indexData?.frontmatter.order ?? 999,
      pages: [],
      children: [],
    };

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "images") {
        section.children.push(buildSection(fullPath));
      } else if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "index.md") {
        const data = readWikiFile(fullPath);
        if (data) {
          section.pages.push({
            slug: slugFromPath(fullPath),
            title: data.frontmatter.title,
            description: data.frontmatter.description || "",
            order: data.frontmatter.order ?? 999,
          });
        }
      }
    }

    section.pages.sort((a, b) => a.order - b.order);
    section.children.sort((a, b) => a.order - b.order);
    return section;
  }

  const entries = fs.readdirSync(WIKI_DIR, { withFileTypes: true });
  const sections: WikiSection[] = [];

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== "images") {
      sections.push(buildSection(path.join(WIKI_DIR, entry.name)));
    }
  }

  return sections.sort((a, b) => a.order - b.order);
}

export function getAllWikiSlugs(): string[] {
  if (!fs.existsSync(WIKI_DIR)) return [];
  const slugs: string[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "images") {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const slug = slugFromPath(fullPath);
        if (slug) slugs.push(slug);
      }
    }
  }

  walk(WIKI_DIR);
  return slugs;
}

export async function getWikiPage(slugParts: string[]): Promise<WikiPage | undefined> {
  const slugPath = slugParts.join("/");

  let filePath = path.join(WIKI_DIR, `${slugPath}.md`);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(WIKI_DIR, slugPath, "index.md");
  }
  if (!fs.existsSync(filePath)) return undefined;

  const data = readWikiFile(filePath);
  if (!data) return undefined;

  const manifest = loadManifest();
  const dirForImages = path.dirname(path.relative(WIKI_DIR, filePath)).replace(/\\/g, "/");
  const imageContext = `wiki/${dirForImages}/images`;

  let html = await renderMarkdown(data.content);
  html = rewriteImageUrls(html, imageContext, manifest, "/wiki");
  html = rewriteCrossLinks(html, "/wiki");

  return {
    slug: slugPath,
    title: data.frontmatter.title,
    description: data.frontmatter.description || "",
    order: data.frontmatter.order ?? 999,
    content: html,
  };
}

export function getAllWikiPageMeta(): WikiPageMeta[] {
  if (!fs.existsSync(WIKI_DIR)) return [];
  const pages: WikiPageMeta[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "images") {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const data = readWikiFile(fullPath);
        if (data) {
          const slug = slugFromPath(fullPath);
          pages.push({
            slug,
            title: data.frontmatter.title,
            description: data.frontmatter.description || "",
            order: data.frontmatter.order ?? 999,
          });
        }
      }
    }
  }

  walk(WIKI_DIR);
  return pages;
}
