---
title: "Site Connector Setup"
description: "Connect your website to Raita for embedding-based content awareness."
order: 1
draft: false
---


Site Connector crawls your website and indexes it so Raita can generate content-aware internal links and understand your existing content.

---

## Setup

1. Go to **Sites** in the sidebar
2. Click **Add Site**
3. Enter your site's base URL (e.g. `https://mysite.com`)
4. Click **Save**

![Site Connector — add site](../images/site-connector-add.png)

---

## Crawling

After adding a site, click **Start Crawl** to begin indexing.

Raita will:
1. Fetch your sitemap (if available) or crawl links from the homepage
2. Visit each page and extract text content
3. Generate vector embeddings for each page
4. Store embeddings locally for similarity search

![Site crawl progress and indexed pages](../images/site-crawl-progress.png)

---

## Crawl Status

| Status | Meaning |
|---|---|
| **Idle** | Not crawled yet |
| **Crawling** | In progress |
| **Done** | Crawl complete, pages indexed |
| **Failed** | Crawl encountered an error |

Click **View Pages** to see the list of indexed URLs and their content previews.

---

## Re-Crawling

If your site content changes, click **Re-crawl** to update the index. The existing index is replaced.

---

## Use Cases

Once a site is crawled:
- Raita can generate contextually relevant internal links for new articles
- The `{sitemap=}` macro can reference your site's sitemap
- Internal link fields in Blaze and Compose modes use the crawled index

See [Using Internal Links](internal-links.md) for how to configure this in your workers.
