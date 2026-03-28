---
title: "AI Providers Reference"
description: "Supported AI providers, models, and their capabilities."
order: 3
draft: false
---


---

## Execution Modes

| Mode | Description |
|---|---|
| **Raita Managed** | Generation runs on Raita's cloud pipeline. Billed in Raita tokens. No external API key required. |
| **BYOK** | Generation runs locally, calling AI provider APIs directly using your keys. API costs are charged to your provider account. |

---

## Supported Providers

| Provider | Key required | Web search support | Notes |
|---|---|---|---|
| Raita Managed | Raita token wallet | Via managed pipeline | No external key needed |
| OpenAI | OpenAI API key | Yes — web search tool (`/v1/responses`) | GPT-4o, GPT-4.1, GPT-4.1 Mini, GPT-4o Mini, GPT-4.1 Nano, GPT-5.4 |
| Google Gemini | Gemini API key | Yes — via Gemini provider path | Gemini 2.5 Flash, Gemini 2.5 Pro, Gemini 3.1 Pro Preview, Gemini 3.1 Flash Lite Preview, Gemini 3 Flash Preview |
| Azure OpenAI | Azure endpoint + key + deployment name | Depends on deployed model | Any model deployed in your Azure resource |
| OpenRouter | OpenRouter API key | No | Access to many providers via single key (e.g., Kimi K2.5, Mercury 2) |
| Custom endpoint | Optional API key | No | Any OpenAI-compatible API (Ollama, LM Studio, etc.) |

---

## Provider Configuration

All provider keys are configured in **Settings → AI Provider**.

| Provider | Fields required |
|---|---|
| Raita Managed | (none — uses token wallet) |
| OpenAI | API key |
| Google Gemini | API key |
| Azure OpenAI | Endpoint URL, API key, deployment name |
| OpenRouter | API key |
| Custom endpoint | Base URL, API key (optional) |

---

## Model Pricing (Raita Managed)

Raita charges in **Raita tokens** (based on actual model API costs with ~3x margin). Last verified March 2026. Rates in tokens per 1M tokens (input / output):

### OpenAI
- **GPT-4.1 Nano**: 1.25 / 5.0
- **GPT-4o Mini**: 3.75 / 15.0
- **GPT-4.1 Mini**: 10.0 / 40.0
- **GPT-4.1**: 50.0 / 200.0
- **GPT-4o**: 62.5 / 250.0
- **GPT-5.4**: 62.5 / 375.0

### Google Gemini
- **Gemini 3.1 Flash Lite Preview**: 2.5 / 10.0
- **Gemini 2.5 Flash**: 7.5 / 62.5
- **Gemini 3 Flash Preview**: 12.5 / 75.0
- **Gemini 2.5 Pro**: 31.25 / 250.0
- **Gemini 3.1 Pro Preview**: 50.0 / 300.0

### OpenRouter (sample)
- **Kimi K2.5**: 11.25 / 55.0
- **Mercury 2**: 6.25 / 18.75

---

## Notes

- `{webSearch}` behavior varies by provider. See [Scraper Macros Reference](scraper-macros.md) for the per-provider breakdown.
- For BYOK providers, model selection can be overridden per-prompt in the prompt editor's Model field.
- Azure OpenAI available models depend on which models you have deployed in your Azure resource.
- For Raita Managed mode, the model catalog is updated regularly as new models and pricing become available.
