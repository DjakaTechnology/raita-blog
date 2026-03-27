# Raita Blog & Wiki — Design Spec

## Overview

A static blog and wiki site for raita.ai, built on the same architecture as meita-blog. Two independent sub-sites — blog at `/blog` and wiki at `/wiki` — sharing one codebase, deployed as two Vercel projects with rewrites from `raita.ai`.

## Tech Stack

- **Framework**: Next.js 16, React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui, class-variance-authority, clsx, tailwind-merge
- **Content**: gray-matter (frontmatter), remark-parse, remark-gfm, remark-rehype, rehype-raw, rehype-stringify, unified
- **Search**: Fuse.js (client-side fuzzy search)
- **Icons**: Lucide React
- **Images**: AWS SDK S3 (Cloudflare R2), served from `cdn.raita.ai`
- **Reading time**: reading-time (blog only)

## Project Structure

```
raita-blog/
├── src/
│   ├── app/                            # Blog routes
│   │   ├── page.tsx                    # Blog homepage (paginated posts)
│   │   ├── [slug]/page.tsx             # Individual blog post
│   │   ├── category/
│   │   │   ├── [category]/page.tsx
│   │   │   └── [category]/page/[page]/page.tsx
│   │   ├── page/[page]/page.tsx        # Blog pagination
│   │   ├── layout.tsx                  # Blog layout
│   │   ├── globals.css
│   │   ├── blog-content.css
│   │   └── not-found.tsx
│   ├── app-wiki/                       # Wiki routes
│   │   ├── page.tsx                    # Wiki homepage (section listing)
│   │   ├── [...slug]/page.tsx          # Wiki page (catch-all for nested paths)
│   │   ├── layout.tsx                  # Wiki layout (with sidebar)
│   │   ├── wiki-content.css
│   │   └── not-found.tsx
│   ├── components/                     # Shared components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PostCard.tsx
│   │   ├── PostList.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Pagination.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── RelatedPosts.tsx
│   │   ├── TableExpander.tsx
│   │   ├── WikiSidebar.tsx             # Hierarchical sidebar nav
│   │   ├── WikiBreadcrumb.tsx          # Breadcrumb from folder path
│   │   └── ui/                         # shadcn/ui components
│   └── lib/
│       ├── markdown.ts                 # Shared markdown processing
│       ├── blog.ts                     # Blog-specific content loading
│       ├── wiki.ts                     # Wiki-specific content loading
│       ├── pagination.ts
│       ├── types.ts
│       └── utils.ts
├── content/
│   ├── blog/
│   │   ├── *.md                        # Blog posts (flat, date-ordered)
│   │   └── images/
│   │       └── [slug]/                 # Images per post
│   ├── wiki/
│   │   ├── getting-started/
│   │   │   ├── index.md                # Section landing page
│   │   │   ├── installation.md
│   │   │   └── images/
│   │   ├── guides/
│   │   │   ├── index.md
│   │   │   ├── deployment.md
│   │   │   └── images/
│   │   └── images/                     # Shared wiki images
│   └── .image-manifest.json            # Shared image manifest
├── scripts/
│   ├── upload-images.mjs               # R2 upload (handles both blog/ and wiki/)
│   ├── generate-search-index.mjs       # Separate indexes for blog and wiki
│   ├── generate-rss.mjs                # Blog only
│   └── generate-sitemap.mjs            # Both blog and wiki
├── next.config.blog.js                 # basePath: '/blog', output: 'export'
├── next.config.wiki.js                 # basePath: '/wiki', output: 'export', distDir: 'out-wiki'
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Deployment

### Two Vercel Projects, One Repo

**Vercel Project 1 — raita-blog:**
- Build command: `npm run build:blog`
- Output directory: `out/`
- Serves `raita.ai/blog/*` via Vercel rewrite

**Vercel Project 2 — raita-wiki:**
- Build command: `npm run build:wiki`
- Output directory: `out-wiki/`
- Serves `raita.ai/wiki/*` via Vercel rewrite

### Next.js Configs

**next.config.blog.js:**
```js
const nextConfig = {
  output: 'export',
  basePath: '/blog',
  images: { unoptimized: true },
}
```

**next.config.wiki.js:**
```js
const nextConfig = {
  output: 'export',
  basePath: '/wiki',
  distDir: 'out-wiki',
  // Remaps app directory to src/app-wiki/
}
```

The wiki config uses a pre-build script that copies `src/app-wiki/` to a temporary `src/app/` (backing up the original), runs the build, then restores. Alternatively, Next.js 16's `--turbopack` or custom webpack resolve aliases can remap the app directory. The simplest reliable approach is the copy-swap script.

### Build Scripts

```json
{
  "build:images": "node scripts/upload-images.mjs",
  "build:search": "node scripts/generate-search-index.mjs",
  "build:rss": "node scripts/generate-rss.mjs",
  "build:sitemap": "node scripts/generate-sitemap.mjs",
  "build:blog": "npm run build:images && npm run build:search && npm run build:rss && npm run build:sitemap && next build -c next.config.blog.js",
  "build:wiki": "npm run build:images && npm run build:search && npm run build:sitemap && next build -c next.config.wiki.js",
  "dev:blog": "next dev",
  "dev:wiki": "next dev -c next.config.wiki.js"
}
```

## Content Schema

### Blog Frontmatter

```yaml
title: "Post Title"
description: "Short description for SEO and cards"
date: "2026-03-27T10:00:00+07:00"
draft: false
categories:
  - "category-name"
image: ""  # optional hero image path
```

Single author — no author field or author pages.

### Wiki Frontmatter

```yaml
title: "Page Title"
description: "Short description"
order: 1          # Sort order among siblings in sidebar
draft: false
```

- Hierarchy derived from folder structure
- `order` controls sibling sort order in the sidebar
- Folder names become section labels, overridden by that folder's `index.md` title
- No date, no categories, no author

### Markdown Processing Pipeline

Identical to meita-blog:

1. `gray-matter` extracts YAML frontmatter
2. `remark-parse` → AST
3. `remark-gfm` → GitHub-flavored markdown
4. `remark-rehype` → HTML AST
5. `rehype-raw` → allow inline HTML
6. `rehype-stringify` → HTML output
7. Image URLs rewritten from local paths to `cdn.raita.ai` URLs via manifest

### Image Pipeline

Identical structure to meita-blog:

- Blog images: `content/blog/images/[slug]/`
- Wiki images: `content/wiki/[section]/images/` or `content/wiki/images/`
- Upload script discovers all images under `content/`, hashes them, uploads to R2
- R2 path: `raita/{blog|wiki}/images/{context}/{hash}-{filename}`
- Cache-Control: `public, max-age=31536000`
- Manifest: `content/.image-manifest.json` maps local paths to CDN URLs
- CDN base URL: `cdn.raita.ai`
- Environment variables: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

## Color System

Raita-desktop's palette, implemented as Tailwind CSS 4 variables:

### Brand Blue
| Token | Value |
|-------|-------|
| brand-50 | #E7F5FE |
| brand-100 | #BBE3FC |
| brand-200 | #8FD0FA |
| brand-300 | #63BEF8 |
| brand-400 | #37ACF6 |
| brand-500 | #0B99F4 |
| brand-600 | #097BC3 |
| brand-700 | #075C92 |
| brand-800 | #043D62 |
| brand-900 | #021F31 |
| brand-950 | #011019 |

### Gray (Slate)
| Token | Value |
|-------|-------|
| gray-50 | #f8fafc |
| gray-100 | #f1f5f9 |
| gray-200 | #e2e8f0 |
| gray-300 | #cbd5e1 |
| gray-400 | #94a3b8 |
| gray-500 | #64748b |
| gray-600 | #475569 |
| gray-700 | #334155 |
| gray-800 | #1e293b |
| gray-900 | #0f172a |
| gray-950 | #020617 |

### Semantic Tokens (CSS Variables)

| Token | Light | Dark |
|-------|-------|------|
| --background | gray-50 | gray-900 |
| --foreground | gray-900 | gray-50 |
| --surface | white | gray-800 |
| --surface-raised | white | gray-700 |
| --border | gray-200 | gray-700 |
| --border-subtle | gray-100 | gray-800 |
| --muted | gray-500 | gray-400 |
| --primary | brand-500 | brand-500 |
| --primary-foreground | white | white |

### Typography
- Font: Geist (sans-serif)
- Dark mode: `.dark` class via next-themes

## Blog Features

Mirrors meita-blog (minus multi-author):

- **Homepage**: Paginated post list with search and category filter
- **Post page**: Full article with hero image, reading time, related posts
- **Category pages**: Filtered post list by category, paginated
- **Pagination**: 10 posts per page
- **Search**: Client-side Fuse.js, lazy-loaded search index
- **RSS feed**: Blog posts only
- **Sitemap**: All blog pages
- **SEO**: Open Graph, Twitter cards, JSON-LD (Article schema), canonical URLs

### Blog Routes
- `/blog` — homepage
- `/blog/[slug]` — individual post
- `/blog/page/[page]` — paginated homepage
- `/blog/category/[category]` — category archive
- `/blog/category/[category]/page/[page]` — paginated category

## Wiki Features

- **Homepage (`/wiki`)**: Grid/list of top-level sections with descriptions from each folder's `index.md`
- **Sidebar navigation**: Auto-generated hierarchical tree from folder structure, collapsible sections, current page highlighted. Fixed on desktop, hamburger menu on mobile.
- **Breadcrumb**: Auto-generated from URL path (e.g., `Wiki > Guides > Deployment`)
- **Page rendering**: Same markdown pipeline as blog
- **Search**: Separate Fuse.js index for wiki content
- **Sitemap**: Wiki pages included in sitemap generation

### Wiki Does NOT Have
- Date-based sorting (uses `order` field)
- RSS feed
- Author pages
- Reading time
- Pagination (sidebar navigation instead)
- Categories (folder hierarchy instead)

### Wiki Routes
- `/wiki` — homepage (section listing)
- `/wiki/[...slug]` — any wiki page (catch-all, maps to folder structure)

## Shared Infrastructure

- Components: Header, Footer, SearchBar, shadcn/ui
- Markdown processing: remark/rehype pipeline
- Image pipeline: R2 upload script, manifest, CDN URL rewriting
- Tailwind config and color system
- TypeScript config
