---
title: "Scraper Macros"
description: "Injeksikan konten web real-time ke dalam prompt Anda dengan scraper macros."
order: 2
draft: false
---


Scraper macros mengambil dan merangkum konten eksternal saat pembuatan. Mereka diperluas **setelah** injeksi variabel, jadi Anda dapat menggunakan variabel dalam argumen macro.

![Editor prompt dengan summarize macro](../images/scraper-macro-prompt.png)

---

## Alias Singkat

Ini adalah shortcut kenyamanan yang otomatis-ekspansi ke macros eksplisit yang lebih panjang:

| Alias | Ekspansi |
|---|---|
| `{bingSearch}` | Cari Bing untuk `{topicQueryParam}`, diringkas |
| `{googleSearch}` | Cari Google untuk `{topicQueryParam}`, diringkas |
| `{duckduckgoSearch}` | Cari DuckDuckGo untuk `{topicQueryParam}`, diringkas |
| `{yahooSearch}` | Cari Yahoo untuk `{topicQueryParam}`, diringkas |
| `{topThreeBingSummarized}` | 3 hasil Bing teratas untuk `{topicQueryParam}`, masing-masing diringkas |
| `{topThreeGoogleSummarized}` | 3 hasil Google teratas untuk `{topicQueryParam}`, masing-masing diringkas |

Contoh penggunaan:
```
Research: {bingSearch}

Using the research above, write an article about {topic}.
```

---

## Macros Eksplisit

Untuk kontrol lebih lanjut, gunakan sintaks macro eksplisit dengan argumen URL:

### `{scrap=URL}`

Mengambil URL dan menggunakan AI untuk mengekstrak konten paling relevan dari halaman.

```
Reference material: {scrap=https://example.com/source-article}

Write a unique article about {topic} inspired by the above.
```

### `{summarize=URL}`

Mengambil URL dan mengembalikan ringkasan terstruktur (judul, poin kunci, argumen utama).

```
Summary of competitor content: {summarize=https://competitor.com/article}
```

### `{summarizeNonStructured=URL}`

Mengambil URL dan mengembalikan laporan gaya jurnalistik (prosa mengalir, bukan bullet points).

### `{sitemap=URL}`

Mengambil sitemap XML dan meminta AI untuk memilih halaman paling relevan untuk `{topic}` saat ini.

### `{sitemapSummarize=URL}`

Mengambil sitemap, memilih halaman paling relevan, kemudian merangkumnya. Menggabungkan `{sitemap=}` dan `{summarize=}`.

```
Context from my site: {sitemapSummarize=https://mysite.com/sitemap.xml}
```

### `{topThreeBingSummarized=QUERY}`

Cari Bing untuk QUERY, ambil 3 hasil teratas, dan kembalikan ringkasan masing-masing.

```
Research: {topThreeBingSummarized={topicQueryParam}}
```

### `{topThreeGoogleSummarized=QUERY}`

Sama seperti di atas tetapi menggunakan Google.

---

## `{webSearch}` — Pencarian Web Tingkat Penyedia

`{webSearch}` **bukan** scraper macro. Ini adalah flag yang mengaktifkan pencarian web asli di tingkat penyedia AI:

- **OpenAI** — beralih ke API `/v1/responses` dan melampirkan alat `web_search`. AI mencari web sebagai bagian dari pembuatan responsnya.
- **Gemini** — mengaktifkan Google Grounding.
- **OpenRouter / Custom** — flag dihapus; tidak ada pencarian web yang terjadi.

`{webSearch}` dapat ditambahkan melalui toggle **Web Search** di editor prompt, atau diketik langsung ke dalam prompt.

---

## Catatan Performa

Scraper macros membuat permintaan HTTP dan panggilan AI selama perluasan prompt. Prompt dengan beberapa macros akan memakan waktu lebih lama untuk dibuat. Untuk macros `topThree*`, harapkan 3 panggilan AI tambahan per macro.
