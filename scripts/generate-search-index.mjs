import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const mode = process.argv[2] || "blog";
const MANIFEST_PATH = path.join(process.cwd(), "content/.image-manifest.json");

function loadManifest() {
  try { return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8")); } catch { return {}; }
}

function generateBlogIndex() {
  const POSTS_DIR = path.join(process.cwd(), "content/blog");
  const OUTPUT_PATH = path.join(process.cwd(), "public/search-index.json");

  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, "[]");
    console.log("No blog posts found. Created empty search index.");
    return;
  }

  const manifest = loadManifest();
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const posts = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    if (data.draft) continue;
    const slug = file.replace(/\.md$/, "");
    const stats = readingTime(content);
    const firstImageMatch = content.match(/!\[[^\]]*\]\((images\/[^)]+)\)/);
    let heroImage = data.image || (firstImageMatch ? firstImageMatch[1] : "") || "";
    if (heroImage && !heroImage.startsWith("http")) {
      const entry = manifest[`blog/images/${slug}/${path.basename(heroImage)}`] || manifest[heroImage];
      heroImage = entry ? entry.r2Url : `/blog/content-images/${heroImage.replace(/^images\//, "")}`;
    }
    posts.push({ slug, title: data.title, description: data.description, date: data.date, categories: data.categories || [], image: heroImage, readingTime: stats.text });
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(posts));
  console.log(`Blog search index generated: ${posts.length} posts`);
}

function generateWikiIndex() {
  const WIKI_DIR = path.join(process.cwd(), "content/wiki");
  const OUTPUT_PATH = path.join(process.cwd(), "public/search-index.json");

  if (!fs.existsSync(WIKI_DIR)) {
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, "[]");
    console.log("No wiki pages found. Created empty search index.");
    return;
  }

  const pages = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "images") { walk(fullPath); }
      else if (entry.isFile() && entry.name.endsWith(".md")) {
        const raw = fs.readFileSync(fullPath, "utf-8");
        const { data } = matter(raw);
        if (data.draft) continue;
        let slug = path.relative(WIKI_DIR, fullPath).replace(/\\/g, "/").replace(/\.md$/, "").replace(/\/index$/, "");
        pages.push({ slug, title: data.title, description: data.description || "" });
      }
    }
  }
  walk(WIKI_DIR);

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(pages));
  console.log(`Wiki search index generated: ${pages.length} pages`);
}

if (mode === "wiki") generateWikiIndex();
else generateBlogIndex();
