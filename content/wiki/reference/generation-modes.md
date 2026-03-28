---
title: "Generation Modes Reference"
description: "Comparison of Simple, Blaze, and Compose generation modes."
order: 4
draft: false
---


---

## Mode Dispatch Order

When a worker runs, modes are checked in this order: **Compose → Blaze → Simple**. Only the first populated mode executes.

---

## Simple Mode

One AI call returns the full article.

**Config fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `prompt` | InputPrompt | Yes | The prompt configuration (see InputPrompt Fields below) |
| `auto_internal_link` | boolean | No | Auto-inject internal links |
| `image_gen` | object | No | Image generation config |

**Execution:**
1. Inject common placeholders (`{topic}`, `{niche}`, `{language}`, `{keyword}`)
2. Expand scraper macros
3. If prompt starts with `{debug}`, return injected prompt without calling AI
4. Send single prompt to model
5. Extract meta tags from generated HTML

**Best for:** Compact one-shot prompts, feed/SILO automation, quick generation.

---

## Blaze Mode

Multiple sequential AI calls assemble a structured article.

**Config fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title_prompt` | InputPrompt | Yes | Generates article title |
| `lsi_prompt` | InputPrompt | Yes | Generates section outline (LSI list) |
| `detail_prompt` | InputPrompt | Yes | Generates each section body |
| `meta_prompt` | InputPrompt | No | Generates meta description |
| `opening_prompt` | InputPrompt | No | Generates introductory paragraph |
| `closing_prompt` | InputPrompt | No | Generates conclusion paragraph |
| `internal_link_prompt` | InputPrompt | No | Generates internal link candidates |
| `internal_link_target` | string | No | URL for internal link source |
| `auto_internal_link` | boolean | No | Auto-inject internal links |
| `image_gen` | object | No | Image generation config |

**Execution order:**
1. Generate title
2. Generate outline (LSI section list)
3. Generate internal links (if configured)
4. Generate meta / opening / closing (in parallel, if configured)
5. Generate each section body (one call per section)
6. Inject internal links into selected sections
7. Concatenate: opening + sections + closing (meta stored separately)

**Best for:** Structured long-form articles, multi-section content, detailed research pieces.

---

## Compose Mode

Section-based composition — each section has its own prompt, joined by a glue string.

**Config fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title_prompt` | InputPrompt | No | Generates article title |
| `meta_prompt` | InputPrompt | Yes | Generates meta description |
| `contents_prompt` | InputPrompt[] | Yes | Array of section prompts |
| `glue_string` | string | Yes | String inserted between sections |
| `internal_link_target` | string[] | No | URLs for internal link injection |
| `auto_internal_link` | boolean | No | Auto-inject internal links |
| `image_gen` | object | No | Image generation config |

**Execution:**
- If any `contents_prompt` contains `{chain}`: **sequential (chained) mode** — sections run one at a time in order, each receives prior output as `{chain}`
- Otherwise: **parallel mode** — all sections run simultaneously
- Final article = title + sections joined by `glue_string`

**Best for:** Flexible section-based composition, chained context (each section builds on previous), reusing modular section prompts.

---

## InputPrompt Fields

Each `InputPrompt` object has:

| Field | Type | Description |
|---|---|---|
| `prompt` | string | Prompt text (supports variables and macros) |
| `temperature` | float | Creativity/randomness (0.0–2.0) |
| `model` | string (optional) | Model override (uses Settings default if blank) |
| `webSearch` | boolean (optional) | Enable web search for this prompt |
| `imagegen` | boolean (optional) | Generate image for this prompt's output |

---

## Placeholder Variables

Common placeholders injected before model call:

| Variable | Description |
|---|---|
| `{topic}` | Article topic / keyword |
| `{keyword}` | Same as `{topic}` |
| `{niche}` | Project niche/vertical |
| `{language}` | Content language |
| `{topicQueryParam}` | URL-encoded topic (for search macros) |

**Blaze-specific:**
- `{title}` — generated article title
- `{lsi}`, `{section}`, `{outline}` — outline/LSI section list
- `{index}`, `{item}` — section index/name
- `{internal_links}` — internal link candidates
- `{subtopic}` — subsection topic

**Compose-specific:**
- `{title}` — generated article title
- `{index}` — section index
- `{chain}` — output from prior section (chained mode only)
- `{internalLink}` — internal link candidate
- `{random5InternalLink}` — 5 random internal link candidates

See [Prompt Variables Reference](prompt-variables.md) for full details.
