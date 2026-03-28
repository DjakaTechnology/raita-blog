---
title: "Settings Reference"
description: "Complete reference for all Raita application settings."
order: 6
draft: false
---


All settings are accessed via the **Settings** link in the sidebar. Changes are saved by clicking **Save** in the sticky action bar at the bottom of the page.

---

## AI Provider

Controls which service generates your articles.

| Setting | Description | Values |
|---|---|---|
| **AI Source** | Choose between Raita-managed tokens or your own API keys | `Raita Tokens` (recommended), `My API Keys` |
| **Raita Token Fallback** | When using BYOK, fall back to Raita tokens if your key fails or has no quota | On / Off |

### BYOK — API Keys (visible when AI Source is "My API Keys")

| Setting | Description | Format |
|---|---|---|
| **Gemini API Key** | Google Gemini key from Google AI Studio | One key per line |
| **OpenAI API Key** | OpenAI key for GPT models | One key per line |
| **OpenRouter API Key** | OpenRouter key for 300+ models | `sk-or-...` |
| **Azure API Key** | Azure OpenAI endpoint + key | `https://RESOURCE.openai.azure.com/...;KEY` |

Multiple keys in the same field are rotated automatically during batch generation.

### OpenRouter Models

Add specific model IDs to make them selectable in the model picker.

| Setting | Description | Format |
|---|---|---|
| **OpenRouter Models** | List of OpenRouter model IDs to expose in Raita | `provider/model-name` (e.g. `mistralai/mistral-7b-instruct`) |

### Custom Models

Add any OpenAI-compatible endpoint as a selectable model.

| Setting | Description | Example |
|---|---|---|
| **Model ID** | Identifier shown in the model picker | `llama-3.1-70b` |
| **Base URL** | OpenAI-compatible API base URL | `https://api.groq.com/openai/v1` |

---

## Token Usage

Visible only when AI Source is set to **Raita Tokens**. Displays your current token balance broken down by type:

| Balance type | Description |
|---|---|
| Subscription | Tokens from an active monthly plan; reset on renewal date |
| Purchased | Tokens bought as top-ups; do not expire |
| Trial | Tokens granted at sign-up |

Click **Buy Tokens** to open the token purchase page in your browser.

---

## Generation

Controls default behavior for article generation tasks.

| Setting | Description | Notes |
|---|---|---|
| **Default Niche** | Pre-filled niche/topic for new workers | Free text |
| **Default Language** | Pre-filled language for new workers | Free text (e.g. `English`, `Indonesian`) |
| **Scraping Engine** | AI model used for web research / scraping | Dropdown — lists available AI models |
| **Bing Cookies** | Cookie string for authenticated Bing searches | Paste from browser DevTools |
| **Concurrent Workers** | Number of articles generated in parallel per run | Integer; lower values reduce API rate-limit errors |
| **Max Retries** | How many times a failed generation is retried before marking as error | Integer |
| **Timeout** | Maximum seconds to wait for a single generation request | Integer (seconds) |

---

## Export

Settings that apply to file exports and image generation.

### WordPress Export

| Setting | Description | Notes |
|---|---|---|
| **WP Meta Description Template** | Custom HTML or postmeta XML injected as the meta description in WordPress XML exports | Supports `{value}` placeholder for the description text |
| **WP Meta Keywords Template** | Custom HTML or postmeta XML injected as meta keywords / keyphrase in WordPress XML exports | Supports `{value}` placeholder for the keyword text |

### Image Generation

| Setting | Description | Values |
|---|---|---|
| **Provider** | Which AI service generates images | `Auto`, `OpenAI (DALL-E)`, `Google Gemini`, `Custom` |
| **Style** | Visual style applied to image prompts | `Photorealistic`, `Illustration`, `Flat Design`, `Watercolor`, `3D Render`, `Digital Art` |
| **Aspect Ratio** | Image dimensions | `Landscape (16:9)`, `Square (1:1)`, `Portrait (9:16)` |
| **Min Images** | Minimum number of images generated per article | Integer 1–10 |
| **Max Images** | Maximum number of images generated per article | Integer 1–10 |
| **Watermark** | Add a watermark overlay to generated images | On / Off |

### Database

| Setting | Description |
|---|---|
| **Database Export/Import** | SQLite database backup. Copy the database file from the app data directory. Location varies by OS (see your OS app data folder). |

---

## License

| Setting | Description |
|---|---|
| **Active License Keys** | Lists all non-expired license keys attached to your account |
| **Add License Key** | Enter a license key and click **Activate** to attach it to your account |

License keys unlock features or extend capabilities beyond the base plan.

---

## Account

| Setting | Description | Values |
|---|---|---|
| **Username** | Your Raita account username | Read-only |
| **Email** | Email address on your Cognito account | Read-only |
| **Language** | UI display language | `English`, `Indonesian` |
| **Sign Out** | End your current session and return to the sign-in page | — |
