---
title: "Scraper Macros Reference"
description: "Complete reference for all scraper and research macros."
order: 2
draft: false
---


Complete reference for all scraper and search macros supported in Raita prompts.

Macros are expanded after variable injection, so variables can be used inside macro arguments.

---

## Short Aliases

Convenience shortcuts that auto-expand to explicit macros using `{topicQueryParam}` as the query.

| Alias | Expands to |
|---|---|
| `{bingSearch}` | `{summarizeNonStructured=https://www.bing.com/search?q={topicQueryParam}}` |
| `{googleSearch}` | `{summarizeNonStructured=https://www.google.com/search?q={topicQueryParam}}` |
| `{duckduckgoSearch}` | `{summarizeNonStructured=https://duckduckgo.com/?q={topicQueryParam}}` |
| `{yahooSearch}` | `{summarizeNonStructured=https://search.yahoo.com/search?p={topicQueryParam}}` |
| `{topThreeBingSummarized}` | `{topThreeBingSummarized={topicQueryParam}}` |
| `{topThreeGoogleSummarized}` | `{topThreeGoogleSummarized={topicQueryParam}}` |

---

## Explicit Macros

| Macro | Syntax | What it does | Returns |
|---|---|---|---|
| `scrap=` | `{scrap=URL}` | Fetches URL, AI extracts most relevant content | Extracted content as text |
| `summarize=` | `{summarize=URL}` | Fetches URL, returns structured summary | Title, key points, main arguments |
| `summarizeNonStructured=` | `{summarizeNonStructured=URL}` | Fetches URL, returns journalistic report | Flowing prose summary |
| `sitemap=` | `{sitemap=URL}` | Fetches sitemap XML, AI picks most relevant page for current topic | URL of most relevant page |
| `sitemapSummarize=` | `{sitemapSummarize=URL}` | Fetches sitemap, picks relevant page, summarizes it | Summary of the selected page |
| `topThreeBingSummarized=` | `{topThreeBingSummarized=QUERY}` | Searches Bing, fetches top 3 results, summarizes each | 3 individual summaries |
| `topThreeGoogleSummarized=` | `{topThreeGoogleSummarized=QUERY}` | Searches Google, fetches top 3 results, summarizes each | 3 individual summaries |

---

## `{webSearch}` — Not a Scraper Macro

`{webSearch}` is handled at the provider layer, not the scraper layer:

| Provider | Behavior |
|---|---|
| OpenAI | Switches to `/v1/responses` API with `web_search` tool attached |
| Gemini | Strips the flag and enables web search mode via the Gemini provider path |
| OpenRouter / Custom | Flag stripped; no web search occurs |

---

## Performance

Each macro invocation makes one or more HTTP requests and may trigger additional AI calls:

| Macro type | Additional AI calls |
|---|---|
| `scrap=`, `summarize=`, `summarizeNonStructured=` | 1 per macro |
| `sitemap=` | 1 per macro |
| `sitemapSummarize=` | 2 per macro (sitemap pick + summarize) |
| `topThree*Summarized=` | 3 per macro (one per result) |
