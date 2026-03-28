---
title: "Prompt Variables Reference"
description: "Complete reference for all available prompt variables."
order: 1
draft: false
---


Complete reference for all variables supported in Raita prompt fields.

---

## Common Variables

Available in all modes and all stages.

| Variable | Replaced with | Notes |
|---|---|---|
| `{topic}` | Article Worker's topic field | |
| `{keyword}` | Same as `{topic}` | Alias |
| `{niche}` | Worker's niche field | |
| `{language}` | Worker's language field | |
| `{topicQueryParam}` | URL-encoded `{topic}` | Used internally by search macros |

---

## Blaze Mode Variables

Available only in Blaze mode, at the stage indicated.

| Variable | Stage | Replaced with |
|---|---|---|
| `{title}` | Detail, Meta, Opening, Closing | Generated article title |
| `{lsi}` | Detail | Generated section list (newline-separated headings) |
| `{outline}` | Detail | Same as `{lsi}` |
| `{section}` | Detail | Current section heading being generated |
| `{subtopic}` | Detail | Current subtopic within the section |
| `{index}` | Detail | Section index (0-based integer) |
| `{item}` | Detail | Current item from the outline list |
| `{internal_links}` | Detail | Generated internal link HTML |
| `{internalLinks}` | Detail | Same as `{internal_links}` (alias) |

---

## Compose Mode Variables

| Variable | Replaced with | Notes |
|---|---|---|
| `{title}` | Generated article title | Only if title prompt is configured |
| `{index}` | Section index (0-based integer) | |
| `{internalLink}` | One internal link anchor tag | From internal link target list |
| `{random5InternalLink}` | 5 randomly selected internal link anchor tags | From internal link target list |
| `{chain}` | All previously generated sections concatenated | Sequential (chained) mode only |

---

## Special Flags

| Flag | Mode | Effect |
|---|---|---|
| `{debug}` | Simple | Must appear at the **start** of the prompt. Returns the fully injected prompt text without calling the AI model |
| `{webSearch}` | All | Enables provider-level web search (see AI Provider Setup) |
| `{imagegen}` | All | Triggers image generation for this article |

---

## Notes

- Variables are case-sensitive. `{topic}` works; `{Topic}` does not.
- Unresolved variables are left as literal text in the prompt.
- `{internalLinks}` / `{internal_links}` that reach the scraper expansion layer unresolved are stripped.
