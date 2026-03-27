import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const WIKI_DIR = path.join(process.cwd(), "content/wiki");
const OUTPUT_PATH = path.join(process.cwd(), "public/sitemap.xml");

function main() {
  const urls = [];

  urls.push({ loc: "https://raita.ai/blog", changefreq: "daily", priority: "1.0" });
  const categories = new Set();
  if (fs.existsSync(BLOG_DIR)) {
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data } = matter(raw);
      if (data.draft) continue;
      const slug = file.replace(/\.md$/, "");
      urls.push({ loc: `https://raita.ai/blog/${slug}`, lastmod: new Date(data.date).toISOString().split("T")[0], changefreq: "monthly", priority: "0.8" });
      (data.categories || []).forEach((c) => categories.add(c));
    }
  }
  for (const cat of categories) {
    urls.push({ loc: `https://raita.ai/blog/category/${encodeURIComponent(cat)}`, changefreq: "weekly", priority: "0.5" });
  }

  urls.push({ loc: "https://raita.ai/wiki", changefreq: "weekly", priority: "0.9" });
  if (fs.existsSync(WIKI_DIR)) {
    function walkWiki(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== "images") { walkWiki(fullPath); }
        else if (entry.isFile() && entry.name.endsWith(".md")) {
          const raw = fs.readFileSync(fullPath, "utf-8");
          const { data } = matter(raw);
          if (data.draft) continue;
          let slug = path.relative(WIKI_DIR, fullPath).replace(/\\/g, "/").replace(/\.md$/, "").replace(/\/index$/, "");
          if (slug) {
            urls.push({ loc: `https://raita.ai/wiki/${slug}`, changefreq: "weekly", priority: "0.7" });
          }
        }
      }
    }
    walkWiki(WIKI_DIR);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, xml);
  console.log(`Sitemap generated: ${urls.length} URLs`);
}

main();
