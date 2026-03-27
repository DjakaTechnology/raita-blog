# Raita Blog & Wiki Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static blog + wiki site for raita.ai, based on meita-blog's architecture, with raita-desktop's color palette.

**Architecture:** Two Next.js static exports from one repo — blog at `/blog` and wiki at `/wiki`. Shared components, markdown pipeline, and image CDN. Two Vercel projects deploy independently. Wiki uses hierarchical folder-based content with sidebar navigation.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui (Base UI), remark/rehype, Fuse.js, Cloudflare R2 (`cdn.raita.ai`)

---

## File Structure

```
raita-blog/
├── src/
│   ├── app/                          # Blog routes (default app dir)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── blog-content.css
│   │   ├── not-found.tsx
│   │   ├── [slug]/page.tsx
│   │   ├── page/[page]/page.tsx
│   │   ├── category/[category]/page.tsx
│   │   └── category/[category]/page/[page]/page.tsx
│   ├── app-wiki/                     # Wiki routes (swapped in for wiki build)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css               # Same base + wiki-specific
│   │   ├── wiki-content.css
│   │   ├── not-found.tsx
│   │   └── [...slug]/page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PostCard.tsx
│   │   ├── PostList.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Pagination.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── RelatedPosts.tsx
│   │   ├── TableExpander.tsx
│   │   ├── WikiSidebar.tsx
│   │   ├── WikiBreadcrumb.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       └── dialog.tsx
│   └── lib/
│       ├── types.ts
│       ├── utils.ts
│       ├── markdown.ts
│       ├── blog.ts
│       ├── wiki.ts
│       └── pagination.ts
├── content/
│   ├── blog/
│   │   ├── hello-world.md
│   │   └── images/
│   │       └── hello-world/
│   ├── wiki/
│   │   ├── index.md
│   │   ├── getting-started/
│   │   │   ├── index.md
│   │   │   ├── installation.md
│   │   │   └── images/
│   │   └── images/
│   └── .image-manifest.json
├── scripts/
│   ├── upload-images.mjs
│   ├── generate-search-index.mjs
│   ├── generate-rss.mjs
│   ├── generate-sitemap.mjs
│   └── swap-app.mjs
├── public/
│   └── favicon.webp
├── next.config.blog.js
├── next.config.wiki.js
├── tsconfig.json
├── postcss.config.mjs
├── .env.example
├── .gitignore
└── package.json
```

---

### Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `next.config.blog.js`
- Create: `next.config.wiki.js`

- [ ] **Step 1: Initialize package.json**

```json
{
  "name": "raita-blog",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "dev:wiki": "node scripts/swap-app.mjs wiki && next dev -c next.config.wiki.js",
    "build:blog": "node scripts/upload-images.mjs && node scripts/generate-search-index.mjs blog && node scripts/generate-rss.mjs && node scripts/generate-sitemap.mjs && next build -c next.config.blog.js",
    "build:wiki": "node scripts/swap-app.mjs wiki && node scripts/upload-images.mjs && node scripts/generate-search-index.mjs wiki && node scripts/generate-sitemap.mjs && next build -c next.config.wiki.js && node scripts/swap-app.mjs blog",
    "lint": "eslint"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.1014.0",
    "@base-ui/react": "^1.3.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "fuse.js": "^7.1.0",
    "gray-matter": "^4.0.3",
    "lucide-react": "^0.577.0",
    "next": "16.2.1",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "reading-time": "^1.5.0",
    "rehype-raw": "^7.0.0",
    "rehype-stringify": "^10.0.1",
    "remark-gfm": "^4.0.1",
    "remark-parse": "^11.0.0",
    "remark-rehype": "^11.1.2",
    "shadcn": "^4.1.0",
    "tailwind-merge": "^3.5.0",
    "tw-animate-css": "^1.4.0",
    "unified": "^11.0.5"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": [
    "next-env.d.ts", "**/*.ts", "**/*.tsx",
    ".next/types/**/*.ts", ".next/dev/types/**/*.ts", "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create postcss.config.mjs**

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

- [ ] **Step 4: Create next.config.blog.js**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/blog',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

- [ ] **Step 5: Create next.config.wiki.js**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/wiki',
  distDir: 'out-wiki',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

- [ ] **Step 6: Create .env.example**

```
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=https://cdn.raita.ai
```

- [ ] **Step 7: Create .gitignore**

```
node_modules/
.next/
out/
out-wiki/
.env
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 8: Run npm install**

Run: `npm install`
Expected: Dependencies install successfully, `node_modules/` and `package-lock.json` created.

- [ ] **Step 9: Commit**

```bash
git init
git add package.json tsconfig.json postcss.config.mjs next.config.blog.js next.config.wiki.js .env.example .gitignore package-lock.json
git commit -m "feat: initialize raita-blog project with Next.js 16 + Tailwind CSS 4"
```

---

### Task 2: Shared Library — Types, Utils, Markdown

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/utils.ts`
- Create: `src/lib/markdown.ts`
- Create: `src/lib/pagination.ts`

- [ ] **Step 1: Create src/lib/types.ts**

```typescript
export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  draft: boolean;
  categories: string[];
  image: string;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  categories: string[];
  image: string;
  readingTime: string;
  content: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  categories: string[];
  image: string;
  readingTime: string;
}

export interface WikiFrontmatter {
  title: string;
  description: string;
  order: number;
  draft: boolean;
}

export interface WikiPage {
  slug: string;
  title: string;
  description: string;
  order: number;
  content: string;
}

export interface WikiPageMeta {
  slug: string;
  title: string;
  description: string;
  order: number;
}

export interface WikiSection {
  title: string;
  slug: string;
  description: string;
  order: number;
  pages: WikiPageMeta[];
  children: WikiSection[];
}
```

- [ ] **Step 2: Create src/lib/utils.ts**

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 3: Create src/lib/markdown.ts**

This is the shared markdown rendering pipeline. Content-loading functions live in `blog.ts` and `wiki.ts`.

```typescript
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
```

- [ ] **Step 4: Create src/lib/pagination.ts**

```typescript
import type { PostMeta } from "./types";

export const POSTS_PER_PAGE = 10;

export function paginatePosts(
  posts: PostMeta[],
  page: number
): { posts: PostMeta[]; totalPages: number } {
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const start = (page - 1) * POSTS_PER_PAGE;
  return {
    posts: posts.slice(start, start + POSTS_PER_PAGE),
    totalPages,
  };
}
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/
git commit -m "feat: add shared library — types, utils, markdown pipeline, pagination"
```

---

### Task 3: Blog Content Loader

**Files:**
- Create: `src/lib/blog.ts`

- [ ] **Step 1: Create src/lib/blog.ts**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/blog.ts
git commit -m "feat: add blog content loader"
```

---

### Task 4: Wiki Content Loader

**Files:**
- Create: `src/lib/wiki.ts`

- [ ] **Step 1: Create src/lib/wiki.ts**

```typescript
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

  // Try exact file match first: content/wiki/getting-started/installation.md
  let filePath = path.join(WIKI_DIR, `${slugPath}.md`);
  if (!fs.existsSync(filePath)) {
    // Try index: content/wiki/getting-started/index.md
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/wiki.ts
git commit -m "feat: add wiki content loader with hierarchical tree builder"
```

---

### Task 5: Shared UI Components

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/dialog.tsx`

- [ ] **Step 1: Create src/components/ui/button.tsx**

```typescript
"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

- [ ] **Step 2: Create src/components/ui/dialog.tsx**

```typescript
"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-background p-4 text-sm ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add shadcn/ui button and dialog components"
```

---

### Task 6: Shared Page Components

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/SearchBar.tsx`
- Create: `src/components/Pagination.tsx`
- Create: `src/components/CategoryFilter.tsx`
- Create: `src/components/TableExpander.tsx`

- [ ] **Step 1: Create src/components/Header.tsx**

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex flex-row items-center justify-between px-4 py-2">
        <Link href="https://raita.ai" className="flex items-center">
          <img src="/blog/favicon.webp" alt="Raita logo" className="w-8 h-8 rounded" />
          <span className="text-lg font-bold ml-2">Raita</span>
        </Link>
        <nav className="md:flex flex-row gap-2 items-center justify-center hidden">
          <Link href="https://raita.ai" className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">Home</Link>
          <Link href="/blog" className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-primary">Blog</Link>
          <Link href="/wiki" className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">Wiki</Link>
        </nav>
        <button className="md:hidden inline p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-2">
          <Link href="https://raita.ai" className="px-4 py-2 text-sm rounded-md hover:bg-muted" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/blog" className="px-4 py-2 text-sm rounded-md hover:bg-muted text-primary" onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link href="/wiki" className="px-4 py-2 text-sm rounded-md hover:bg-muted" onClick={() => setMenuOpen(false)}>Wiki</Link>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create src/components/Footer.tsx**

```typescript
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-3">
          <Link href="https://raita.ai" className="flex items-center">
            <img src="/blog/favicon.webp" alt="Raita logo" className="w-10 h-10 rounded" />
            <span className="text-lg font-bold text-gray-50 ml-2">Raita</span>
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-gray-50">Content</h3>
          <nav className="flex flex-col gap-2 text-sm">
            <Link href="/blog" className="hover:text-gray-50 transition-colors">Blog</Link>
            <Link href="/wiki" className="hover:text-gray-50 transition-colors">Wiki</Link>
          </nav>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-gray-50">Product</h3>
          <nav className="flex flex-col gap-2 text-sm">
            <Link href="https://raita.ai" className="hover:text-gray-50 transition-colors">Home</Link>
          </nav>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-700 text-center text-sm opacity-60">
        <p>&copy; {new Date().getFullYear()} Raita. All rights reserved.</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Create src/components/SearchBar.tsx**

```typescript
"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input type="text" placeholder="Search..." value={value} onChange={(e) => onChange(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}
```

- [ ] **Step 4: Create src/components/Pagination.tsx**

```typescript
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({ currentPage, totalPages, basePath = "/" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  function getPageUrl(page: number): string {
    if (page === 1) return basePath;
    return `${basePath}/page/${page}`;
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
      {currentPage > 1 && (
        <Link href={getPageUrl(currentPage - 1)} className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Previous</Link>
      )}
      {pages.map((page) => (
        <Link key={page} href={getPageUrl(page)} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${page === currentPage ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>{page}</Link>
      ))}
      {currentPage < totalPages && (
        <Link href={getPageUrl(currentPage + 1)} className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Next</Link>
      )}
    </nav>
  );
}
```

- [ ] **Step 5: Create src/components/CategoryFilter.tsx**

```typescript
"use client";

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => onSelect(null)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selected === null ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>All</button>
      {categories.map((cat) => (
        <button key={cat} onClick={() => onSelect(cat === selected ? null : cat)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selected === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{cat}</button>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Create src/components/TableExpander.tsx**

```typescript
"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TableExpander() {
  const [open, setOpen] = useState(false);
  const [tableHtml, setTableHtml] = useState("");

  useEffect(() => {
    const blogContent = document.querySelector(".blog-content, .wiki-content");
    if (!blogContent) return;

    blogContent.querySelectorAll(".table-expand-btn").forEach((btn) => btn.remove());
    blogContent.querySelectorAll(".table-container").forEach((wrapper) => {
      const table = wrapper.querySelector("table");
      if (table) wrapper.parentNode?.insertBefore(table, wrapper);
      wrapper.remove();
    });

    const tables = blogContent.querySelectorAll("table");
    const wrappers: HTMLDivElement[] = [];

    tables.forEach((table) => {
      const wrapper = document.createElement("div");
      wrapper.className = "table-container";
      const btn = document.createElement("button");
      btn.className = "table-expand-btn";
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg> Expand`;
      btn.onclick = () => {
        const clone = table.cloneNode(true) as HTMLElement;
        clone.style.display = "table";
        clone.style.width = "100%";
        clone.style.margin = "0";
        setTableHtml(clone.outerHTML);
        setOpen(true);
      };
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
      wrapper.appendChild(btn);
      wrappers.push(wrapper);
    });

    return () => {
      wrappers.forEach((wrapper) => {
        const btn = wrapper.querySelector(".table-expand-btn");
        btn?.remove();
        const table = wrapper.querySelector("table");
        if (table) wrapper.parentNode?.insertBefore(table, wrapper);
        wrapper.remove();
      });
    };
  }, []);

  return (
    <>
      <style>{`
        .table-container { position: relative; }
        .table-expand-btn { display: flex; align-items: center; gap: 0.375rem; font-size: 0.75rem; font-weight: 500; color: var(--muted-foreground); background: var(--muted); border: 1px solid var(--border); border-radius: 0.375rem; padding: 0.35rem 0.625rem; cursor: pointer; margin-top: 0.5rem; margin-left: auto; width: fit-content; transition: color 0.15s, border-color 0.15s; }
        .table-expand-btn:hover { color: var(--foreground); border-color: var(--foreground); }
      `}</style>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Table View</DialogTitle>
          </DialogHeader>
          <div
            className="blog-content overflow-auto"
            dangerouslySetInnerHTML={{ __html: tableHtml }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/Header.tsx src/components/Footer.tsx src/components/SearchBar.tsx src/components/Pagination.tsx src/components/CategoryFilter.tsx src/components/TableExpander.tsx
git commit -m "feat: add shared page components — Header, Footer, SearchBar, Pagination, CategoryFilter, TableExpander"
```

---

### Task 7: Blog Components

**Files:**
- Create: `src/components/PostCard.tsx`
- Create: `src/components/PostList.tsx`
- Create: `src/components/RelatedPosts.tsx`

- [ ] **Step 1: Create src/components/PostCard.tsx**

```typescript
import Link from "next/link";
import type { PostMeta } from "@/lib/types";

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/${post.slug}`}
      className="group block rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300 no-underline"
    >
      {post.image && (
        <img src={post.image} alt={post.title} className="w-full h-48 md:h-56 object-cover" />
      )}
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors mb-3">{post.title}</h2>
        {post.description && <p className="text-muted-foreground leading-relaxed mb-4">{post.description}</p>}
        <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
          Read more
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create src/components/PostList.tsx**

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import Fuse from "fuse.js";
import type { PostMeta } from "@/lib/types";
import PostCard from "./PostCard";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";

interface PostListProps {
  initialPosts: PostMeta[];
  allCategories: string[];
  totalPages: number;
  currentPage: number;
  basePath?: string;
}

interface SearchIndexEntry {
  slug: string;
  title: string;
  description: string;
  date: string;
  categories: string[];
  image: string;
  readingTime: string;
}

export default function PostList({ initialPosts, allCategories, totalPages, currentPage, basePath = "/" }: PostListProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<PostMeta[] | null>(null);
  const [allPosts, setAllPosts] = useState<SearchIndexEntry[] | null>(null);
  const [fuse, setFuse] = useState<Fuse<SearchIndexEntry> | null>(null);

  const isFiltering = query.length > 0 || selectedCategory !== null;

  const loadSearchIndex = useCallback(async () => {
    if (allPosts) return;
    try {
      const res = await fetch("/blog/search-index.json");
      const data: SearchIndexEntry[] = await res.json();
      setAllPosts(data);
      setFuse(new Fuse(data, { keys: ["title", "description", "categories"], threshold: 0.3 }));
    } catch (err) {
      console.error("Failed to load search index:", err);
    }
  }, [allPosts]);

  useEffect(() => {
    if (!isFiltering || allPosts) return;
    loadSearchIndex();
  }, [isFiltering, allPosts, loadSearchIndex]);

  useEffect(() => {
    if (!allPosts) return;
    let results = allPosts;
    if (query && fuse) {
      results = fuse.search(query).map((r) => r.item);
    }
    if (selectedCategory) {
      results = results.filter((p) => p.categories.includes(selectedCategory));
    }
    setSearchResults(results as PostMeta[]);
  }, [query, selectedCategory, allPosts, fuse]);

  const displayPosts = isFiltering ? (searchResults || []) : initialPosts;

  return (
    <div className="w-full max-w-2xl flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <SearchBar value={query} onChange={(v) => { setQuery(v); if (v.length > 0) loadSearchIndex(); }} />
        <CategoryFilter categories={allCategories} selected={selectedCategory} onSelect={(cat) => { setSelectedCategory(cat); if (cat) loadSearchIndex(); }} />
      </div>
      {displayPosts.length === 0 ? (
        <div className="text-center py-12"><p className="text-muted-foreground">No articles found.</p></div>
      ) : (
        <div className="grid gap-6">{displayPosts.map((post) => (<PostCard key={post.slug} post={post} />))}</div>
      )}
      {!isFiltering && <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />}
    </div>
  );
}
```

- [ ] **Step 3: Create src/components/RelatedPosts.tsx**

```typescript
import Link from "next/link";
import type { PostMeta } from "@/lib/types";

export default function RelatedPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;
  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-xl font-bold mb-6">Related Articles</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/${post.slug}`} className="group block rounded-lg border border-border p-4 hover:border-primary/40 hover:shadow-md transition-all no-underline">
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">{post.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{post.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/PostCard.tsx src/components/PostList.tsx src/components/RelatedPosts.tsx
git commit -m "feat: add blog components — PostCard, PostList, RelatedPosts"
```

---

### Task 8: Blog App Routes & Styles

**Files:**
- Create: `src/app/globals.css`
- Create: `src/app/blog-content.css`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/app/[slug]/page.tsx`
- Create: `src/app/page/[page]/page.tsx`
- Create: `src/app/category/[category]/page.tsx`
- Create: `src/app/category/[category]/page/[page]/page.tsx`

- [ ] **Step 1: Create src/app/globals.css**

Raita-desktop color palette (brand blue + slate grays) translated to Tailwind CSS 4 variables:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.5rem;
  /* Raita brand blue palette */
  --background: #f8fafc;
  --foreground: #0f172a;
  --card: #ffffff;
  --card-foreground: #0f172a;
  --popover: #ffffff;
  --popover-foreground: #0f172a;
  --primary: #0B99F4;
  --primary-foreground: #ffffff;
  --secondary: #e2e8f0;
  --secondary-foreground: #0f172a;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --accent: #f1f5f9;
  --accent-foreground: #0f172a;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #0B99F4;
  --chart-1: #0B99F4;
  --chart-2: #097BC3;
  --chart-3: #075C92;
  --chart-4: #37ACF6;
  --chart-5: #63BEF8;
  --sidebar: #f1f5f9;
  --sidebar-foreground: #0f172a;
  --sidebar-primary: #0B99F4;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #f1f5f9;
  --sidebar-accent-foreground: #0f172a;
  --sidebar-border: #e2e8f0;
  --sidebar-ring: #0B99F4;
}

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-heading: 'Inter', system-ui, sans-serif;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

- [ ] **Step 2: Create src/app/blog-content.css**

```css
.blog-content {
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.blog-content h1 { font-size: 1.5rem; font-weight: 700; line-height: 1.375; color: var(--foreground); margin-bottom: 0.75rem; margin-top: 1.5rem; font-family: var(--font-sans); }
.blog-content h2 { font-size: 1.5rem; font-weight: 700; line-height: 1.375; color: var(--foreground); margin-bottom: 0.75rem; margin-top: 2rem; font-family: var(--font-sans); }
.blog-content h3 { font-size: 1.25rem; font-weight: 600; line-height: 1.375; color: var(--foreground); margin-bottom: 0.5rem; margin-top: 1.5rem; font-family: var(--font-sans); }
.blog-content h4 { font-size: 1rem; font-weight: 500; line-height: 1.375; color: var(--foreground); margin-bottom: 0.25rem; margin-top: 0.75rem; font-family: var(--font-sans); }
.blog-content p { font-size: 1.125rem; line-height: 1.8; margin-bottom: 1.25rem; color: var(--foreground); }
.blog-content a { color: var(--primary); text-decoration: none; transition: color 0.2s; }
.blog-content a:hover { text-decoration: underline; }
.blog-content ul, .blog-content ol { font-size: 1.125rem; line-height: 1.8; margin-bottom: 1.25rem; margin-left: 1.5rem; color: var(--foreground); }
.blog-content ul { list-style-type: disc; }
.blog-content ol { list-style-type: decimal; }
.blog-content li { margin-bottom: 0.5rem; }
.blog-content strong, .blog-content b { font-weight: 600; color: var(--foreground); }
.blog-content blockquote { font-size: 1rem; font-style: italic; line-height: 1.625; color: var(--muted-foreground); background: var(--muted); margin: 1rem 0; padding: 0.75rem 1.25rem; border-left: 4px solid var(--primary); }
.blog-content code { font-size: 0.875rem; font-family: monospace; background: var(--muted); color: var(--destructive); padding: 0.125rem 0.25rem; border-radius: 0.25rem; }
.blog-content pre { font-size: 0.875rem; font-family: monospace; line-height: 1.625; background: var(--muted); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1.5rem 0; }
.blog-content img { border-radius: 0.5rem; max-width: 100%; height: auto; margin: 2rem 0; }
.blog-content figure { margin: 2rem 0; }
.blog-content figure img { margin: 0; }
.blog-content figcaption { font-size: 0.875rem; color: var(--muted-foreground); text-align: center; margin-top: 0.5rem; font-style: italic; }
.blog-content .table-container { margin: 1.5rem -4rem; width: calc(100% + 8rem); overflow-x: auto; }
.blog-content table { font-size: 0.875rem; border-collapse: collapse; width: 100%; border: 1px solid var(--border); border-radius: 0.5rem; display: table; margin: 0; }
@media (max-width: 768px) {
  .blog-content .table-container { margin: 1.5rem -1rem; width: calc(100% + 2rem); }
}
.blog-content th, .blog-content td { text-align: left; border: 1px solid var(--border); padding: 0.75rem 1.25rem; white-space: nowrap; vertical-align: top; }
.blog-content th { font-weight: 600; background: var(--muted); vertical-align: middle; }
.blog-content td:last-child, .blog-content th:last-child { white-space: normal; min-width: 180px; }
.blog-content td:first-child { font-weight: 600; }
.blog-content hr { margin: 1rem 0; border: none; background: var(--border); height: 1px; }
@media (max-width: 768px) {
  .blog-content h1 { font-size: 1.25rem; }
  .blog-content h2 { font-size: 1.125rem; }
  .blog-content h3 { font-size: 1rem; }
  .blog-content p, .blog-content ul, .blog-content ol { font-size: 0.875rem; }
  .blog-content blockquote { font-size: 0.875rem; }
}
```

- [ ] **Step 3: Create src/app/layout.tsx**

```typescript
import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Raita Blog",
    template: "%s | Raita Blog",
  },
  description: "Articles and insights from the Raita team.",
  metadataBase: new URL("https://raita.ai"),
  icons: {
    icon: "/blog/favicon.webp",
    apple: "/blog/favicon.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Create src/app/page.tsx**

```typescript
import type { Metadata } from "next";
import { getAllPostMeta, getAllCategories } from "@/lib/blog";
import { paginatePosts } from "@/lib/pagination";
import PostList from "@/components/PostList";

export const metadata: Metadata = {
  title: "Raita Blog",
  description: "Articles and insights from the Raita team.",
  alternates: { canonical: "https://raita.ai/blog" },
  openGraph: {
    title: "Raita Blog",
    description: "Articles and insights from the Raita team.",
    type: "website",
    url: "https://raita.ai/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raita Blog",
    description: "Articles and insights from the Raita team.",
  },
};

export default function BlogPage() {
  const allPosts = getAllPostMeta();
  const { posts, totalPages } = paginatePosts(allPosts, 1);
  const categories = getAllCategories();

  return (
    <div className="flex flex-col items-center py-8 px-4 gap-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-sm text-muted-foreground">Latest insights and updates</p>
      </div>
      <PostList initialPosts={posts} allCategories={categories} totalPages={totalPages} currentPage={1} />
    </div>
  );
}
```

- [ ] **Step 5: Create src/app/not-found.tsx**

```typescript
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
      <Link href="/" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Back to Blog</Link>
    </div>
  );
}
```

- [ ] **Step 6: Create src/app/[slug]/page.tsx**

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getAllSlugs, getAllPostMeta } from "@/lib/blog";
import TableExpander from "@/components/TableExpander";
import RelatedPosts from "@/components/RelatedPosts";
import Link from "next/link";
import "@/app/blog-content.css";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://raita.ai/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.description, type: "article", url: `https://raita.ai/blog/${post.slug}`, publishedTime: post.date, tags: post.categories, ...(post.image && { images: [post.image] }) },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, ...(post.image && { images: [post.image] }) },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const allPosts = getAllPostMeta();
  const related = allPosts.filter((p) => p.slug !== post.slug && p.categories.some((c) => post.categories.includes(c))).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `https://raita.ai/blog/${post.slug}`,
    publisher: { "@type": "Organization", name: "Raita", url: "https://raita.ai" },
    ...(post.image && { image: post.image }),
  };

  return (
    <article className="max-w-[680px] mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex flex-col pt-4 pb-6 border-b border-border mb-6">
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200">
            <svg className="w-3.5 h-3.5 mr-1.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            All Articles
          </Link>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold leading-snug text-foreground mb-3" style={{ fontFamily: "var(--font-sans)" }}>{post.title}</h1>
        <div className="flex items-center gap-2 text-sm">
          <time dateTime={post.date} className="text-muted-foreground">{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
          <span className="text-muted-foreground">&middot;</span>
          <span className="text-muted-foreground">{post.readingTime}</span>
        </div>
      </div>
      {post.image && <img src={post.image} alt={post.title} className="w-full rounded-lg mb-8" />}
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      <TableExpander />
      <RelatedPosts posts={related} />
    </article>
  );
}
```

- [ ] **Step 7: Create src/app/page/[page]/page.tsx**

```typescript
import type { Metadata } from "next";
import { getAllPostMeta, getAllCategories } from "@/lib/blog";
import { paginatePosts, POSTS_PER_PAGE } from "@/lib/pagination";
import PostList from "@/components/PostList";

export function generateStaticParams() {
  const allPosts = getAllPostMeta();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  })).filter((p) => p.page !== "1");
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Blog — Page ${page}`,
    alternates: { canonical: `https://raita.ai/blog/page/${page}` },
  };
}

export default async function PaginatedBlogPage({ params }: { params: Promise<{ page: string }> }) {
  const { page: pageStr } = await params;
  const page = parseInt(pageStr, 10);
  const allPosts = getAllPostMeta();
  const { posts, totalPages } = paginatePosts(allPosts, page);
  const categories = getAllCategories();

  return (
    <div className="flex flex-col items-center py-8 px-4 gap-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-sm text-muted-foreground">Latest insights and updates</p>
      </div>
      <PostList initialPosts={posts} allCategories={categories} totalPages={totalPages} currentPage={page} />
    </div>
  );
}
```

- [ ] **Step 8: Create src/app/category/[category]/page.tsx**

```typescript
import type { Metadata } from "next";
import { getAllPostMeta, getAllCategories } from "@/lib/blog";
import { paginatePosts } from "@/lib/pagination";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

export function generateStaticParams() {
  const categories = getAllCategories();
  if (categories.length === 0) return [];
  return categories.map((cat) => ({ category: encodeURIComponent(cat) }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  return {
    title: `${category} — Blog`,
    alternates: { canonical: `https://raita.ai/blog/category/${encodeURIComponent(category)}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  const allPosts = getAllPostMeta().filter((p) => p.categories.includes(category));
  const { posts, totalPages } = paginatePosts(allPosts, 1);

  return (
    <div className="flex flex-col items-center py-8 px-4 gap-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">{category}</h1>
        <p className="text-sm text-muted-foreground">Posts in the {category} category</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={1} totalPages={totalPages} basePath={`/category/${encodeURIComponent(category)}`} />
    </div>
  );
}
```

- [ ] **Step 9: Create src/app/category/[category]/page/[page]/page.tsx**

```typescript
import type { Metadata } from "next";
import { getAllPostMeta, getAllCategories } from "@/lib/blog";
import { paginatePosts, POSTS_PER_PAGE } from "@/lib/pagination";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

export function generateStaticParams() {
  const categories = getAllCategories();
  const allPosts = getAllPostMeta();
  const params: { category: string; page: string }[] = [];
  for (const cat of categories) {
    const filtered = allPosts.filter((p) => p.categories.includes(cat));
    const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
    for (let i = 2; i <= totalPages; i++) {
      params.push({ category: encodeURIComponent(cat), page: String(i) });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; page: string }> }): Promise<Metadata> {
  const { category: rawCategory, page } = await params;
  const category = decodeURIComponent(rawCategory);
  return {
    title: `${category} — Page ${page} — Blog`,
    alternates: { canonical: `https://raita.ai/blog/category/${encodeURIComponent(category)}/page/${page}` },
  };
}

export default async function PaginatedCategoryPage({ params }: { params: Promise<{ category: string; page: string }> }) {
  const { category: rawCategory, page: pageStr } = await params;
  const category = decodeURIComponent(rawCategory);
  const page = parseInt(pageStr, 10);
  const allPosts = getAllPostMeta().filter((p) => p.categories.includes(category));
  const { posts, totalPages } = paginatePosts(allPosts, page);

  return (
    <div className="flex flex-col items-center py-8 px-4 gap-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">{category}</h1>
        <p className="text-sm text-muted-foreground">Posts in the {category} category — Page {page}</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath={`/category/${encodeURIComponent(category)}`} />
    </div>
  );
}
```

- [ ] **Step 10: Commit**

```bash
git add src/app/
git commit -m "feat: add blog app routes, layout, and styles with raita brand colors"
```

---

### Task 9: Wiki Components

**Files:**
- Create: `src/components/WikiSidebar.tsx`
- Create: `src/components/WikiBreadcrumb.tsx`

- [ ] **Step 1: Create src/components/WikiSidebar.tsx**

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import type { WikiSection } from "@/lib/types";

function SidebarSection({ section, currentSlug, depth = 0 }: { section: WikiSection; currentSlug: string; depth?: number }) {
  const [expanded, setExpanded] = useState(
    currentSlug.startsWith(section.slug)
  );
  const hasChildren = section.children.length > 0 || section.pages.length > 0;

  return (
    <div className={depth > 0 ? "ml-3 border-l border-border pl-3" : ""}>
      <div className="flex items-center gap-1">
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-0.5 rounded hover:bg-muted transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <svg className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        <Link
          href={`/${section.slug}`}
          className={`text-sm py-1 px-1 rounded transition-colors flex-1 ${
            currentSlug === section.slug
              ? "text-primary font-medium bg-primary/10"
              : "text-foreground hover:text-primary hover:bg-muted"
          }`}
        >
          {section.title}
        </Link>
      </div>
      {expanded && (
        <div className="mt-1 flex flex-col gap-0.5">
          {section.pages.map((page) => (
            <Link
              key={page.slug}
              href={`/${page.slug}`}
              className={`text-sm py-1 px-1 ml-4 rounded transition-colors ${
                currentSlug === page.slug
                  ? "text-primary font-medium bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {page.title}
            </Link>
          ))}
          {section.children.map((child) => (
            <SidebarSection key={child.slug} section={child} currentSlug={currentSlug} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WikiSidebar({ sections, currentSlug }: { sections: WikiSection[]; currentSlug: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed bottom-4 right-4 z-20 p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <aside className={`
        fixed lg:sticky top-0 left-0 z-10 h-screen w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto p-4 pt-20 transition-transform
        lg:translate-x-0 lg:block
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <nav className="flex flex-col gap-1">
          <Link
            href="/"
            className={`text-sm font-semibold py-1.5 px-2 rounded transition-colors ${
              currentSlug === "" ? "text-primary bg-primary/10" : "text-foreground hover:bg-muted"
            }`}
          >
            Wiki Home
          </Link>
          <div className="mt-2 flex flex-col gap-1">
            {sections.map((section) => (
              <SidebarSection key={section.slug} section={section} currentSlug={currentSlug} />
            ))}
          </div>
        </nav>
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-[9] bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}
```

- [ ] **Step 2: Create src/components/WikiBreadcrumb.tsx**

```typescript
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function WikiBreadcrumb({ slugParts, titles }: { slugParts: string[]; titles: Record<string, string> }) {
  if (slugParts.length === 0) return null;

  const items: BreadcrumbItem[] = [{ label: "Wiki", href: "/" }];

  let accumulated = "";
  for (const part of slugParts) {
    accumulated = accumulated ? `${accumulated}/${part}` : part;
    items.push({
      label: titles[accumulated] || part.replace(/-/g, " "),
      href: `/${accumulated}`,
    });
  }

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item.href} className="flex items-center gap-1">
          {i > 0 && <span>/</span>}
          {i === items.length - 1 ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-foreground transition-colors">{item.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/WikiSidebar.tsx src/components/WikiBreadcrumb.tsx
git commit -m "feat: add wiki components — WikiSidebar with collapsible tree, WikiBreadcrumb"
```

---

### Task 10: Wiki App Routes

**Files:**
- Create: `src/app-wiki/globals.css`
- Create: `src/app-wiki/wiki-content.css`
- Create: `src/app-wiki/layout.tsx`
- Create: `src/app-wiki/page.tsx`
- Create: `src/app-wiki/not-found.tsx`
- Create: `src/app-wiki/[...slug]/page.tsx`

- [ ] **Step 1: Create src/app-wiki/globals.css**

Same as `src/app/globals.css` — identical color system. Copy the file.

```bash
cp src/app/globals.css src/app-wiki/globals.css
```

- [ ] **Step 2: Create src/app-wiki/wiki-content.css**

Same styles as blog-content.css but using `.wiki-content` class:

```css
.wiki-content {
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.wiki-content h1 { font-size: 1.5rem; font-weight: 700; line-height: 1.375; color: var(--foreground); margin-bottom: 0.75rem; margin-top: 1.5rem; font-family: var(--font-sans); }
.wiki-content h2 { font-size: 1.5rem; font-weight: 700; line-height: 1.375; color: var(--foreground); margin-bottom: 0.75rem; margin-top: 2rem; font-family: var(--font-sans); }
.wiki-content h3 { font-size: 1.25rem; font-weight: 600; line-height: 1.375; color: var(--foreground); margin-bottom: 0.5rem; margin-top: 1.5rem; font-family: var(--font-sans); }
.wiki-content h4 { font-size: 1rem; font-weight: 500; line-height: 1.375; color: var(--foreground); margin-bottom: 0.25rem; margin-top: 0.75rem; font-family: var(--font-sans); }
.wiki-content p { font-size: 1.125rem; line-height: 1.8; margin-bottom: 1.25rem; color: var(--foreground); }
.wiki-content a { color: var(--primary); text-decoration: none; transition: color 0.2s; }
.wiki-content a:hover { text-decoration: underline; }
.wiki-content ul, .wiki-content ol { font-size: 1.125rem; line-height: 1.8; margin-bottom: 1.25rem; margin-left: 1.5rem; color: var(--foreground); }
.wiki-content ul { list-style-type: disc; }
.wiki-content ol { list-style-type: decimal; }
.wiki-content li { margin-bottom: 0.5rem; }
.wiki-content strong, .wiki-content b { font-weight: 600; color: var(--foreground); }
.wiki-content blockquote { font-size: 1rem; font-style: italic; line-height: 1.625; color: var(--muted-foreground); background: var(--muted); margin: 1rem 0; padding: 0.75rem 1.25rem; border-left: 4px solid var(--primary); }
.wiki-content code { font-size: 0.875rem; font-family: monospace; background: var(--muted); color: var(--destructive); padding: 0.125rem 0.25rem; border-radius: 0.25rem; }
.wiki-content pre { font-size: 0.875rem; font-family: monospace; line-height: 1.625; background: var(--muted); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1.5rem 0; }
.wiki-content img { border-radius: 0.5rem; max-width: 100%; height: auto; margin: 2rem 0; }
.wiki-content .table-container { margin: 1.5rem -4rem; width: calc(100% + 8rem); overflow-x: auto; }
.wiki-content table { font-size: 0.875rem; border-collapse: collapse; width: 100%; border: 1px solid var(--border); border-radius: 0.5rem; display: table; margin: 0; }
@media (max-width: 768px) {
  .wiki-content .table-container { margin: 1.5rem -1rem; width: calc(100% + 2rem); }
}
.wiki-content th, .wiki-content td { text-align: left; border: 1px solid var(--border); padding: 0.75rem 1.25rem; white-space: nowrap; vertical-align: top; }
.wiki-content th { font-weight: 600; background: var(--muted); vertical-align: middle; }
.wiki-content td:last-child, .wiki-content th:last-child { white-space: normal; min-width: 180px; }
.wiki-content hr { margin: 1rem 0; border: none; background: var(--border); height: 1px; }
@media (max-width: 768px) {
  .wiki-content h1 { font-size: 1.25rem; }
  .wiki-content h2 { font-size: 1.125rem; }
  .wiki-content h3 { font-size: 1rem; }
  .wiki-content p, .wiki-content ul, .wiki-content ol { font-size: 0.875rem; }
  .wiki-content blockquote { font-size: 0.875rem; }
}
```

- [ ] **Step 3: Create src/app-wiki/layout.tsx**

```typescript
import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WikiSidebar from "@/components/WikiSidebar";
import { getWikiTree } from "@/lib/wiki";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Raita Wiki",
    template: "%s | Raita Wiki",
  },
  description: "Documentation and knowledge base for Raita.",
  metadataBase: new URL("https://raita.ai"),
  icons: {
    icon: "/wiki/favicon.webp",
    apple: "/wiki/favicon.webp",
  },
};

export default function WikiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sections = getWikiTree();

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <Header />
        <div className="flex min-h-screen">
          <WikiSidebar sections={sections} currentSlug="" />
          <main className="flex-1 lg:ml-0">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Create src/app-wiki/page.tsx**

```typescript
import type { Metadata } from "next";
import Link from "next/link";
import { getWikiTree } from "@/lib/wiki";

export const metadata: Metadata = {
  title: "Raita Wiki",
  description: "Documentation and knowledge base for Raita.",
  alternates: { canonical: "https://raita.ai/wiki" },
};

export default function WikiHomePage() {
  const sections = getWikiTree();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">Wiki</h1>
      <p className="text-muted-foreground mb-8">Browse documentation by topic</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.slug}
            href={`/${section.slug}`}
            className="group block rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-md transition-all no-underline"
          >
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
              {section.title}
            </h2>
            {section.description && (
              <p className="text-sm text-muted-foreground">{section.description}</p>
            )}
            <span className="text-xs text-muted-foreground mt-3 block">
              {section.pages.length + section.children.length} items
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create src/app-wiki/not-found.tsx**

```typescript
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-6">This wiki page doesn't exist.</p>
      <Link href="/" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Back to Wiki</Link>
    </div>
  );
}
```

- [ ] **Step 6: Create src/app-wiki/[...slug]/page.tsx**

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWikiPage, getAllWikiSlugs, getAllWikiPageMeta } from "@/lib/wiki";
import WikiBreadcrumb from "@/components/WikiBreadcrumb";
import TableExpander from "@/components/TableExpander";
import "@/app-wiki/wiki-content.css";

export function generateStaticParams() {
  return getAllWikiSlugs().map((slug) => ({
    slug: slug.split("/"),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getWikiPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `https://raita.ai/wiki/${page.slug}` },
    openGraph: { title: page.title, description: page.description, type: "article", url: `https://raita.ai/wiki/${page.slug}` },
  };
}

export default async function WikiPageRoute({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = await getWikiPage(slug);
  if (!page) notFound();

  // Build titles map for breadcrumb
  const allPages = getAllWikiPageMeta();
  const titles: Record<string, string> = {};
  for (const p of allPages) {
    titles[p.slug] = p.title;
  }

  return (
    <div className="max-w-[680px] mx-auto px-6 py-8">
      <WikiBreadcrumb slugParts={slug} titles={titles} />
      <h1 className="text-2xl md:text-3xl font-bold leading-snug text-foreground mb-6" style={{ fontFamily: "var(--font-sans)" }}>
        {page.title}
      </h1>
      <div className="wiki-content" dangerouslySetInnerHTML={{ __html: page.content }} />
      <TableExpander />
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/app-wiki/
git commit -m "feat: add wiki app routes — layout with sidebar, homepage, catch-all page route"
```

---

### Task 11: Build Scripts

**Files:**
- Create: `scripts/swap-app.mjs`
- Create: `scripts/upload-images.mjs`
- Create: `scripts/generate-search-index.mjs`
- Create: `scripts/generate-rss.mjs`
- Create: `scripts/generate-sitemap.mjs`

- [ ] **Step 1: Create scripts/swap-app.mjs**

This script swaps `src/app` and `src/app-wiki` for the wiki build.

```javascript
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP_DIR = path.join(ROOT, "src/app");
const APP_WIKI_DIR = path.join(ROOT, "src/app-wiki");
const APP_BLOG_BACKUP = path.join(ROOT, "src/app-blog-backup");

const target = process.argv[2]; // "wiki" or "blog"

if (target === "wiki") {
  // Swap: app -> app-blog-backup, app-wiki -> app
  if (fs.existsSync(APP_BLOG_BACKUP)) {
    console.log("Already swapped to wiki mode.");
    process.exit(0);
  }
  fs.renameSync(APP_DIR, APP_BLOG_BACKUP);
  fs.renameSync(APP_WIKI_DIR, APP_DIR);
  console.log("Swapped to wiki mode: app-wiki -> app");
} else if (target === "blog") {
  // Restore: app -> app-wiki, app-blog-backup -> app
  if (!fs.existsSync(APP_BLOG_BACKUP)) {
    console.log("Already in blog mode.");
    process.exit(0);
  }
  fs.renameSync(APP_DIR, APP_WIKI_DIR);
  fs.renameSync(APP_BLOG_BACKUP, APP_DIR);
  console.log("Restored to blog mode: app-blog-backup -> app");
} else {
  console.error("Usage: node scripts/swap-app.mjs <wiki|blog>");
  process.exit(1);
}
```

- [ ] **Step 2: Create scripts/upload-images.mjs**

Adapted from meita-blog — scans both `content/blog/images/` and `content/wiki/**/images/`:

```javascript
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fileURLToPath } from "url";

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../.env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const MANIFEST_PATH = path.join(CONTENT_DIR, ".image-manifest.json");

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

function getS3Client() {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.warn("R2 credentials not set. Skipping image upload.");
    return null;
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  });
}

function computeHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 12);
}

function getAllImages() {
  const images = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(fullPath); }
      else if (/\.(webp|png|jpg|jpeg|gif|svg)$/i.test(entry.name)) {
        const relativePath = path.relative(CONTENT_DIR, fullPath).replace(/\\/g, "/");
        images.push({ fullPath, relativePath });
      }
    }
  }
  walk(path.join(CONTENT_DIR, "blog", "images"));
  walk(path.join(CONTENT_DIR, "wiki"));
  return images;
}

function loadManifest() {
  try { return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8")); } catch { return {}; }
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = { ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".svg": "image/svg+xml" };
  return mimeTypes[ext] || "application/octet-stream";
}

async function main() {
  const client = getS3Client();
  const manifest = loadManifest();
  const images = getAllImages();

  if (images.length === 0) {
    console.log("No images found to upload.");
    return;
  }

  let uploaded = 0, skipped = 0, removed = 0;
  const validKeys = new Set();

  for (const { fullPath, relativePath } of images) {
    const fileBuffer = fs.readFileSync(fullPath);
    const contentHash = computeHash(fileBuffer);
    const existing = manifest[relativePath];
    validKeys.add(relativePath);

    if (existing && existing.contentHash === contentHash) { skipped++; continue; }

    if (!client) {
      // Determine basePath from relativePath
      const basePath = relativePath.startsWith("blog/") ? "/blog" : "/wiki";
      manifest[relativePath] = { r2Url: `${basePath}/content-images/${relativePath}`, contentHash };
      skipped++;
      continue;
    }

    const fileName = path.basename(fullPath);
    const r2Key = `raita/${relativePath.replace(/\/[^/]+$/, "")}/${contentHash}-${fileName}`;

    try {
      await client.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: r2Key,
        Body: fileBuffer,
        ContentType: getMimeType(fullPath),
        CacheControl: "public, max-age=31536000, immutable",
      }));
      manifest[relativePath] = { r2Url: `${R2_PUBLIC_URL}/${r2Key}`, contentHash };
      uploaded++;
      console.log(`Uploaded: ${relativePath}`);
    } catch (err) {
      console.error(`Failed to upload ${relativePath}:`, err.message);
    }
  }

  for (const key of Object.keys(manifest)) {
    if (!validKeys.has(key)) { delete manifest[key]; removed++; }
  }

  saveManifest(manifest);
  console.log(`Done: ${uploaded} uploaded, ${skipped} skipped, ${removed} removed`);
}

main().catch(console.error);
```

- [ ] **Step 3: Create scripts/generate-search-index.mjs**

Accepts `blog` or `wiki` argument to generate the right index:

```javascript
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const mode = process.argv[2] || "blog"; // "blog" or "wiki"
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
```

- [ ] **Step 4: Create scripts/generate-rss.mjs**

```javascript
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/blog");
const OUTPUT_PATH = path.join(process.cwd(), "public/rss.xml");

function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.log("No posts found. Skipping RSS generation.");
    return;
  }
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const posts = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data } = matter(raw);
    if (data.draft) continue;
    posts.push({ slug: file.replace(/\.md$/, ""), title: data.title, description: data.description, date: data.date, categories: data.categories || [] });
  }
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const items = posts.map((post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>https://raita.ai/blog/${post.slug}</link>
      <guid>https://raita.ai/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.categories.map((c) => `<category>${c}</category>`).join("\n      ")}
    </item>`).join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Raita Blog</title>
    <description>Articles and insights from the Raita team.</description>
    <link>https://raita.ai/blog</link>
    <atom:link href="https://raita.ai/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, rss);
  console.log(`RSS feed generated: ${posts.length} posts`);
}

main();
```

- [ ] **Step 5: Create scripts/generate-sitemap.mjs**

```javascript
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const WIKI_DIR = path.join(process.cwd(), "content/wiki");
const OUTPUT_PATH = path.join(process.cwd(), "public/sitemap.xml");

function main() {
  const urls = [];

  // Blog URLs
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

  // Wiki URLs
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
```

- [ ] **Step 6: Commit**

```bash
git add scripts/
git commit -m "feat: add build scripts — swap-app, upload-images, search-index, rss, sitemap"
```

---

### Task 12: Sample Content

**Files:**
- Create: `content/blog/hello-world.md`
- Create: `content/blog/images/.gitkeep`
- Create: `content/wiki/index.md`
- Create: `content/wiki/getting-started/index.md`
- Create: `content/wiki/getting-started/installation.md`
- Create: `content/.image-manifest.json`

- [ ] **Step 1: Create content/blog/hello-world.md**

```markdown
---
title: "Hello World"
description: "Welcome to the Raita blog."
date: "2026-03-27T10:00:00+07:00"
draft: false
categories:
  - "announcements"
image: ""
---

Welcome to the Raita blog! This is our first post.

Stay tuned for more updates and insights from our team.
```

- [ ] **Step 2: Create content/blog/images/.gitkeep**

```bash
mkdir -p content/blog/images
touch content/blog/images/.gitkeep
```

- [ ] **Step 3: Create content/wiki/index.md**

```markdown
---
title: "Raita Wiki"
description: "Documentation and knowledge base for Raita."
order: 0
draft: false
---

Welcome to the Raita wiki. Browse topics using the sidebar navigation.
```

- [ ] **Step 4: Create content/wiki/getting-started/index.md**

```markdown
---
title: "Getting Started"
description: "Get up and running with Raita."
order: 1
draft: false
---

This section covers the basics of getting started with Raita.
```

- [ ] **Step 5: Create content/wiki/getting-started/installation.md**

```markdown
---
title: "Installation"
description: "How to install Raita."
order: 1
draft: false
---

## Installation

Follow these steps to install Raita on your machine.

### Prerequisites

- Node.js 18 or later
- A modern web browser

### Steps

1. Download the installer from [raita.ai](https://raita.ai)
2. Run the installer
3. Follow the on-screen instructions
```

- [ ] **Step 6: Create content/.image-manifest.json**

```json
{}
```

- [ ] **Step 7: Create wiki images directory**

```bash
mkdir -p content/wiki/getting-started/images
touch content/wiki/getting-started/images/.gitkeep
```

- [ ] **Step 8: Commit**

```bash
git add content/
git commit -m "feat: add sample blog post and wiki content"
```

---

### Task 13: Verify Blog Build

- [ ] **Step 1: Run the blog build**

Run: `npm run build:blog`
Expected: Build completes with static export in `out/` directory.

- [ ] **Step 2: Verify output structure**

Run: `ls out/`
Expected: `index.html`, `hello-world/`, `category/`, `page/`, plus static assets.

- [ ] **Step 3: Fix any build errors**

If errors occur, read the error output, fix the issue, and re-run.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve blog build issues"
```

---

### Task 14: Verify Wiki Build

- [ ] **Step 1: Run the wiki build**

Run: `npm run build:wiki`
Expected: Build completes — swaps app dirs, builds static export in `out-wiki/`, restores app dirs.

- [ ] **Step 2: Verify output structure**

Run: `ls out-wiki/`
Expected: `index.html`, `getting-started/`, plus static assets.

- [ ] **Step 3: Verify app dirs restored**

Run: `ls src/app/ && ls src/app-wiki/`
Expected: Both directories exist with their original contents.

- [ ] **Step 4: Fix any build errors**

If errors occur, read the error output, fix the issue, and re-run.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve wiki build issues"
```
