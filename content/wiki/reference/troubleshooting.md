---
title: "Troubleshooting"
description: "Solutions to common issues and error messages."
order: 8
draft: false
---


---

## Article Generation

| Problem | Likely cause | Fix |
|---|---|---|
| Worker stuck in "Running" for >5 minutes | API timeout or hanging request | Retry the worker; check API key is valid |
| Worker failed with status 429 | Rate limit hit | Reduce **Batch per Run** in Settings → Generation; add delay between requests |
| Worker failed with "401 Unauthorized" | Invalid or expired API key | Re-enter API key in Settings → AI Provider |
| Worker failed with "403 Forbidden" | API key lacks permissions | Check your API key has the required scopes |
| Article has `{topic}` in the generated text | Variable not injected | Make sure the **Topic** field is filled in on the worker |
| `{internalLinks}` appears literally in output | No internal links generated | Check site is crawled (Sites tab); verify Internal Link Target URL is set |
| Article generation completes but content is empty | Model returned empty response | Check prompt is valid; try a different model |
| Token reservation fails at generation start | Insufficient token balance | Top up tokens via the sidebar wallet badge |

---

## Prompts & Templates

| Problem | Likely cause | Fix |
|---|---|---|
| Template import not loading fields | Incorrect file format | Ensure file uses correct `\|======` section markers; check for extra blank lines |
| Scraper macro not expanding | Network error or blocked URL | Check internet connection; the target URL may be blocking scrapers |
| `{summarize=URL}` returns empty | Page is JavaScript-rendered or blocked | Try `{scrap=URL}` instead; not all pages are scrapable |
| `{debug}` shows raw prompt, not result | Working as intended | Remove `{debug}` from the start of your prompt to run normally |
| Variable substitution produces unexpected output | Wrong variable syntax | Variable names are case-sensitive; check spelling matches the field name exactly |

---

## Export & Publishing

| Problem | Likely cause | Fix |
|---|---|---|
| WordPress XML import fails | Malformed export or WordPress importer issue | Check the WordPress importer plugin is active; try importing a smaller batch |
| Direct WordPress upload fails with 401 | Application password incorrect | Regenerate the application password in WordPress Users → Profile |
| Direct WordPress upload fails with 403 | REST API disabled or blocked | Check WordPress REST API is enabled; disable security plugins temporarily to test |
| CSV opens with garbled characters | Encoding issue | Open with UTF-8 encoding in your spreadsheet app |
| Hugo export missing front matter fields | Article metadata incomplete | Ensure title and date fields are populated before exporting |

---

## Images

| Problem | Likely cause | Fix |
|---|---|---|
| Images not generating | Image Gen not enabled | Enable **Image Gen** toggle in the prompt editor |
| Image generation fails | Provider API error or quota exceeded | Check image generation provider settings in Settings → Export |
| Images not appearing in WordPress export | Images stored locally, not uploaded | Use Direct Upload (not XML export) to include images |

---

## App & Account

| Problem | Likely cause | Fix |
|---|---|---|
| App won't open on macOS | Gatekeeper security block | Go to **System Settings → Privacy & Security** → click **Open Anyway** |
| Login fails with "Invalid credentials" | Wrong email/password | Use **Forgot password** to reset |
| Login fails with "Email not confirmed" | Email not verified | Check your inbox for the verification email |
| Token balance not updating after purchase | Payment processing delay | Wait 1–2 minutes and refresh; contact support if not resolved after 10 minutes |
| Subscription tokens showing as 0 after renewal | Cycle not yet refreshed | Balance refreshes lazily on next generation request; trigger a generation or wait a moment |
