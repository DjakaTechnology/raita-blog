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

export const WIKI_LOCALES = ["en", "id"] as const;
export type WikiLocale = (typeof WIKI_LOCALES)[number];

const WIKI_DIR_BASE = path.join(process.cwd(), "content");

function getWikiDir(locale: WikiLocale = "en"): string {
  return path.join(WIKI_DIR_BASE, locale === "en" ? "wiki" : `wiki-${locale}`);
}

// Keep backward compat — default English
const WIKI_DIR = getWikiDir("en");

function readWikiFile(filePath: string): { frontmatter: WikiFrontmatter; content: string } | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as WikiFrontmatter;
  if (frontmatter.draft) return null;
  return { frontmatter, content };
}

function slugFromPath(filePath: string, wikiDir: string = WIKI_DIR): string {
  const relative = path.relative(wikiDir, filePath).replace(/\\/g, "/");
  return relative.replace(/\.md$/, "").replace(/\/index$/, "");
}

export function getWikiTree(locale: WikiLocale = "en"): WikiSection[] {
  const wikiDir = getWikiDir(locale);
  if (!fs.existsSync(wikiDir)) return [];

  function buildSection(dir: string): WikiSection {
    const indexPath = path.join(dir, "index.md");
    const indexData = readWikiFile(indexPath);
    const dirName = path.basename(dir);
    const slug = path.relative(wikiDir, dir).replace(/\\/g, "/");

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
            slug: slugFromPath(fullPath, wikiDir),
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

  const entries = fs.readdirSync(wikiDir, { withFileTypes: true });
  const sections: WikiSection[] = [];

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== "images") {
      sections.push(buildSection(path.join(wikiDir, entry.name)));
    }
  }

  return sections.sort((a, b) => a.order - b.order);
}

export function getAllWikiSlugs(locale: WikiLocale = "en"): string[] {
  const wikiDir = getWikiDir(locale);
  if (!fs.existsSync(wikiDir)) return [];
  const slugs: string[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "images") {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const slug = slugFromPath(fullPath, wikiDir);
        if (slug) slugs.push(slug);
      }
    }
  }

  walk(wikiDir);
  return slugs;
}

export async function getWikiPage(slugParts: string[], locale: WikiLocale = "en"): Promise<WikiPage | undefined> {
  const wikiDir = getWikiDir(locale);
  const slugPath = slugParts.join("/");

  let filePath = path.join(wikiDir, `${slugPath}.md`);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(wikiDir, slugPath, "index.md");
  }
  if (!fs.existsSync(filePath)) return undefined;

  const data = readWikiFile(filePath);
  if (!data) return undefined;

  const manifest = loadManifest();
  const dirForImages = path.dirname(path.relative(wikiDir, filePath)).replace(/\\/g, "/");
  const imageContext = `wiki/${dirForImages}/images`;

  const basePath = locale === "en" ? "/wiki" : `/wiki/id`;
  let html = await renderMarkdown(data.content);
  html = rewriteImageUrls(html, imageContext, manifest, "/wiki");
  html = rewriteCrossLinks(html, basePath);

  return {
    slug: slugPath,
    title: data.frontmatter.title,
    description: data.frontmatter.description || "",
    order: data.frontmatter.order ?? 999,
    content: html,
  };
}

export function getWikiSection(slug: string, locale: WikiLocale = "en"): WikiSection | undefined {
  const sections = getWikiTree(locale);

  function find(sections: WikiSection[], target: string): WikiSection | undefined {
    for (const s of sections) {
      if (s.slug === target) return s;
      const found = find(s.children, target);
      if (found) return found;
    }
    return undefined;
  }

  return find(sections, slug);
}

/** Flat ordered list of all pages following the sidebar order (section index → pages → children recursively) */
export function getWikiPageList(locale: WikiLocale = "en"): WikiPageMeta[] {
  const sections = getWikiTree(locale);
  const list: WikiPageMeta[] = [];

  function flatten(section: WikiSection) {
    // Add section index page
    list.push({
      slug: section.slug,
      title: section.title,
      description: section.description,
      order: section.order,
    });
    // Add section's pages
    for (const page of section.pages) {
      list.push(page);
    }
    // Recurse into children
    for (const child of section.children) {
      flatten(child);
    }
  }

  for (const section of sections) {
    flatten(section);
  }

  return list;
}

export function getAllWikiPageMeta(locale: WikiLocale = "en"): WikiPageMeta[] {
  const wikiDir = getWikiDir(locale);
  if (!fs.existsSync(wikiDir)) return [];
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
          const slug = slugFromPath(fullPath, wikiDir);
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

  walk(wikiDir);
  return pages;
}
