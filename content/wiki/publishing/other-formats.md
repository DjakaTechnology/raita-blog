---
title: "Other Formats"
description: "Export articles as HTML, plain text, CSV, and more."
order: 2
draft: false
---


In addition to WordPress, Raita can export articles to several other formats.

---

## How to Export

1. Select articles in the project table (use checkboxes for multiple)
2. Click **Export**
3. Choose your format

![Export dialog with format options](../images/export-dialog.png)

---

## Blogger XML

Exports articles in Blogger's Atom import format.

**To import into Blogger:**
1. In Blogger, go to **Settings → Manage Blog**
2. Click **Import content**
3. Upload the `.xml` file

---

## Hugo / Markdown

Exports each article as a `.md` file with front matter for Hugo static sites.

**Front matter fields included:**
- `title`
- `date`
- `draft: false`

**Body:** article HTML content (Hugo renders HTML in markdown files).

---

## CSV

Exports all selected articles as a single `.csv` file.

**Columns:**
- `slug`
- `publish_status`
- `date`
- `content` (HTML)
- `title`
- `category`
- `description` (meta description)
- `keyword`
- `tags`

Useful for importing into custom CMSs or spreadsheet review.

---

## HTML

Exports each article as a standalone `.html` file with basic document structure.

Useful for static hosting or local review.
