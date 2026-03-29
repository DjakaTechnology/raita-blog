---
title: "Google Indexing API"
description: "Submit URLs directly to Google for faster indexing using the Indexing API."
order: 3
draft: false
---

Submit your site URLs directly to Google for faster indexing. Instead of waiting for Google to discover new or updated pages via crawling, the Indexing API lets you notify Google immediately.

---

## Prerequisites

1. A **Google Cloud project** with the Indexing API enabled.
2. A **service account** with a downloaded JSON key file.
3. The service account email added as an **owner** in Google Search Console.

---

## Step 1 — Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Click **Select a project** at the top, then **New Project**.
3. Enter a project name (e.g. "Raita Indexing") and click **Create**.

---

## Step 2 — Enable the Indexing API

1. In the Cloud Console, go to **APIs & Services > Library**.
2. Search for **"Web Search Indexing API"**.
3. Click **Enable**.

Direct link: [Enable Indexing API](https://console.cloud.google.com/apis/library/indexing.googleapis.com)

---

## Step 3 — Create a Service Account

1. Go to **APIs & Services > Credentials** ([direct link](https://console.cloud.google.com/apis/credentials)).
2. Click **Create Credentials > Service account**.
3. Enter a name (e.g. "raita-indexing") and click **Create and Continue**.
4. Skip the role step (click **Continue**) — the Indexing API does not require a project-level role.
5. Click **Done**.

---

## Step 4 — Download the JSON Key

1. In the **Credentials** page, click on the service account you just created.
2. Go to the **Keys** tab.
3. Click **Add Key > Create new key**.
4. Select **JSON** and click **Create**.
5. A `.json` file will be downloaded — keep it safe.

---

## Step 5 — Add Service Account to Search Console

This is the step most people miss. Google will reject all indexing requests unless the service account is verified as a property owner.

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Select your property.
3. Go to **Settings > Users and permissions**.
4. Click **Add user**.
5. Enter the `client_email` from the JSON key (e.g. `raita-indexing@your-project.iam.gserviceaccount.com`).
6. Set permission to **Owner**.
7. Click **Add**.

---

## Step 6 — Configure in Raita

1. Open **Sites** in the sidebar.
2. Click **Indexing** on the site you want to configure.
3. Upload the JSON key file or paste its contents.
4. Click **Save Config**.

---

## Step 7 — Submit URLs

1. In the Indexing panel, all crawled pages are listed with checkboxes.
2. **New pages** (never submitted) are checked by default.
3. **Previously submitted pages** are unchecked — re-check them if the content has been updated.
4. Click **Submit** to send selected URLs to Google.
5. A green **Submitted** badge appears next to each successfully submitted URL.

The next time you open the Indexing panel, Raita remembers which URLs were already submitted and leaves them unchecked automatically.

---

## Quotas and Limits

| Limit | Value |
|---|---|
| URL notifications per day | **200 per property** |
| Notification type | `URL_UPDATED` (new or changed pages) |
| Supported content | Publicly accessible URLs only |

---

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| **403 Forbidden** | Service account not an owner in Search Console | Complete Step 5 |
| **429 Too Many Requests** | Daily quota exceeded | Wait 24 hours or reduce batch size |
| **Invalid private key** | Corrupted or wrong JSON file | Re-download the key from Cloud Console |
| **Token exchange failed** | Indexing API not enabled | Complete Step 2 |

---

## Further Reading

- [Google Indexing API documentation](https://developers.google.com/search/apis/indexing-api/v3/quickstart)
- [Google Search Console](https://search.google.com/search-console)
- [Service account overview](https://cloud.google.com/iam/docs/service-accounts)
