---
title: "Export Formats Reference"
description: "All supported export formats and their options."
order: 5
draft: false
---


---

## How to Export

1. Select articles in the project table using checkboxes.
2. Click **Export** in the bulk action bar.
3. Choose a format, configure options, and click **Download**.

For direct WordPress publishing via REST API (no file download), see [Publishing to WordPress](../publishing/wordpress.md).

---

## WordPress XML (WXR)

**File type:** `.xml`
**Use case:** Import into WordPress via Tools → Import → WordPress

**Field mapping:**

| WordPress field | Source |
|---|---|
| `dc:creator` | Raita account username |
| `title` | Article title |
| `content:encoded` | Article HTML body |
| `wp:post_name` | URL slug (generated from title or keyword) |
| `wp:post_type` | `post` (always) |
| `wp:status` | `draft`, `publish`, or `future` (future if publish date is in the future) |
| `wp:post_date` / `wp:post_date_gmt` | Export or scheduled date |
| `category` (domain: category) | Configured category or niche |
| `category` (domain: post_tag) | Meta keywords (when "Use meta keywords as tags" is enabled) |
| Meta description | Injected via custom meta template (configured in Export settings) |
| SEO keyphrase | Article topic (when "Use keyword as keyphrase" is enabled) |

**Format:** WXR 1.2 (RSS 2.0 envelope with WordPress namespaces).

---

## Blogger XML

**File type:** `.xml`
**Use case:** Import into Blogger via Settings → Manage Blog → Import content

**Field mapping:**

| Blogger field | Source |
|---|---|
| `ns0:title` | Article title |
| `ns0:content` | Article HTML body |
| `ns0:published` / `ns0:updated` | Export or scheduled date (RFC 3339) |
| `ns0:category` (kind) | `http://schemas.google.com/blogger/2008/kind#post` |
| `ns0:category` (ns) | Configured category or niche |
| `app:draft` | Set to `yes` when publish status is `draft` |

**Format:** Atom feed with Blogger namespace.

---

## Hugo / Markdown

**File type:** `.md` (one file per article, zipped)
**Use case:** Hugo static sites

**Front matter fields:**

| Field | Value |
|---|---|
| `title` | Article title |
| `description` | Meta description |
| `date` | Export or scheduled date (RFC 3339, local timezone) |
| `draft` | `false` when publish status is `publish`; `true` otherwise |
| `categories` | Single-item list with configured category or niche (omitted if empty) |
| `tags` | List of meta keywords (when "Use meta keywords as tags" is enabled) |

**Body:** Article content converted from HTML to Markdown (GFM). Tables, images, and headings are separated by blank lines for correct rendering.

**Filename:** `<slug>.md` — slug is derived from the article title or keyword depending on export options.

---

## CSV

**File type:** `.csv`
**Use case:** Spreadsheet review, custom CMS import, bulk data processing

**Columns (in order):**

| Column | Content |
|---|---|
| `slug` | URL slug derived from title or keyword |
| `publish_status` | Publication status (e.g. `draft`, `publish`) |
| `date` | Generation or scheduled date (RFC 3339, local timezone) |
| `content` | Article HTML body |
| `title` | Article title |
| `category` | Configured category or niche |
| `description` | Meta description (empty string if none) |
| `keyword` | Target keywords as a JSON array (e.g. `["seo","content"]`) |
| `tags` | Meta keywords as a JSON array when "Use meta keywords as tags" is enabled; empty array otherwise |

**Notes:**
- The file has no header row — columns are identified by position.
- Special characters in `content` are normalized: curly quotes → straight quotes, en-dash → hyphen.

---

## HTML

**File type:** `.html` (one file per article, zipped)
**Use case:** Standalone web pages, local review, static hosting

**Default document structure (no custom template):**

| Element | Content |
|---|---|
| `<title>` | Article title |
| `<meta type="description">` | Meta description (when present) |
| `<meta type="keywords">` | Meta keywords joined by `, ` (when present) |
| `<h1>` inside `<header>` | Article title |
| `<body>` | Article HTML body |

**Custom template:** If an HTML template is configured in the export dialog, Raita replaces the following placeholders:

| Placeholder | Replaced with |
|---|---|
| `{{title}}` | Article title |
| `{{content}}` | Article HTML body |
| `{{meta.description}}` | Meta description |
| `{{meta.keywords}}` | Meta keywords joined by `, ` |
| `{{meta}}` | Full `<meta>` tags for description and keywords |

**Filename:** `<slug>.html` — slug is derived from the article title or keyword.
