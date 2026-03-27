import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostMeta, PostFrontmatter } from "./types";
import {
  loadManifest,
  resolveImageUrl,
  extractFirstImage,
  rewriteImageUrls,
  rewriteCrossLinks,
  renderMarkdown,
} from "./markdown";

const POSTS_DIR = path.join(process.cwd(), "content/blog");

export async function getPost(slug: string): Promise<Post | undefined> {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as PostFrontmatter;

  if (frontmatter.draft) return undefined;

  let html = await renderMarkdown(content);
  const manifest = loadManifest();
  const imageContext = `blog/images/${slug}`;
  html = rewriteImageUrls(html, imageContext, manifest, "/blog");
  html = rewriteCrossLinks(html, "/blog");

  const stats = readingTime(content);

  const firstBodyImage = extractFirstImage(content);
  let heroImage = frontmatter.image || firstBodyImage || "";
  if (heroImage && !heroImage.startsWith("http")) {
    heroImage = resolveImageUrl(heroImage, imageContext, manifest, "/blog");
  }

  if (heroImage && firstBodyImage && !frontmatter.image) {
    html = html.replace(/<p>\s*<img[^>]*>\s*<\/p>/, "");
  }

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    categories: frontmatter.categories || [],
    image: heroImage,
    readingTime: stats.text,
    content: html,
  };
}

export function getAllPostMeta(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const manifest = loadManifest();
  const posts: PostMeta[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const frontmatter = data as PostFrontmatter;

    if (frontmatter.draft) continue;

    const slug = file.replace(/\.md$/, "");
    const stats = readingTime(content);
    const imageContext = `blog/images/${slug}`;

    let heroImage = frontmatter.image || extractFirstImage(content) || "";
    if (heroImage && !heroImage.startsWith("http")) {
      heroImage = resolveImageUrl(heroImage, imageContext, manifest, "/blog");
    }

    posts.push({
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      categories: frontmatter.categories || [],
      image: heroImage,
      readingTime: stats.text,
    });
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getAllCategories(): string[] {
  const posts = getAllPostMeta();
  const categories = new Set<string>();
  for (const post of posts) {
    for (const cat of post.categories) {
      categories.add(cat);
    }
  }
  return Array.from(categories).sort();
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
