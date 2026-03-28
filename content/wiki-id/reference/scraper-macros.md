---
title: "Referensi Scraper Macros"
description: "Referensi lengkap untuk semua macros scraper dan research."
order: 2
draft: false
---


Referensi lengkap untuk semua scraper dan search macros yang didukung di prompt Raita.

Macros diperluas setelah injeksi variabel, jadi variabel dapat digunakan dalam argumen macro.

---

## Alias Singkat

Shortcut kenyamanan yang otomatis-ekspansi ke macros eksplisit menggunakan `{topicQueryParam}` sebagai query.

| Alias | Ekspansi |
|---|---|
| `{bingSearch}` | `{summarizeNonStructured=https://www.bing.com/search?q={topicQueryParam}}` |
| `{googleSearch}` | `{summarizeNonStructured=https://www.google.com/search?q={topicQueryParam}}` |
| `{duckduckgoSearch}` | `{summarizeNonStructured=https://duckduckgo.com/?q={topicQueryParam}}` |
| `{yahooSearch}` | `{summarizeNonStructured=https://search.yahoo.com/search?p={topicQueryParam}}` |
| `{topThreeBingSummarized}` | `{topThreeBingSummarized={topicQueryParam}}` |
| `{topThreeGoogleSummarized}` | `{topThreeGoogleSummarized={topicQueryParam}}` |

---

## Macros Eksplisit

| Macro | Sintaks | Apa yang dilakukan | Mengembalikan |
|---|---|---|---|
| `scrap=` | `{scrap=URL}` | Mengambil URL, AI mengekstrak konten paling relevan | Konten yang diekstrak sebagai teks |
| `summarize=` | `{summarize=URL}` | Mengambil URL, mengembalikan ringkasan terstruktur | Judul, poin kunci, argumen utama |
| `summarizeNonStructured=` | `{summarizeNonStructured=URL}` | Mengambil URL, mengembalikan laporan jurnalistik | Ringkasan prosa mengalir |
| `sitemap=` | `{sitemap=URL}` | Mengambil sitemap XML, AI memilih halaman paling relevan untuk topik saat ini | URL halaman paling relevan |
| `sitemapSummarize=` | `{sitemapSummarize=URL}` | Mengambil sitemap, memilih halaman relevan, merangkumnya | Ringkasan halaman yang dipilih |
| `topThreeBingSummarized=` | `{topThreeBingSummarized=QUERY}` | Cari Bing, ambil 3 hasil teratas, ringkas masing-masing | 3 ringkasan individual |
| `topThreeGoogleSummarized=` | `{topThreeGoogleSummarized=QUERY}` | Cari Google, ambil 3 hasil teratas, ringkas masing-masing | 3 ringkasan individual |

---

## `{webSearch}` — Bukan Scraper Macro

`{webSearch}` ditangani di lapisan penyedia, bukan lapisan scraper:

| Penyedia | Perilaku |
|---|---|
| OpenAI | Beralih ke API `/v1/responses` dengan alat `web_search` yang terlampir |
| Gemini | Menghapus flag dan mengaktifkan mode pencarian web melalui jalur penyedia Gemini |
| OpenRouter / Custom | Flag dihapus; tidak ada pencarian web yang terjadi |

---

## Performa

Setiap invokasi macro membuat satu atau lebih permintaan HTTP dan mungkin memicu panggilan AI tambahan:

| Jenis macro | Panggilan AI tambahan |
|---|---|
| `scrap=`, `summarize=`, `summarizeNonStructured=` | 1 per macro |
| `sitemap=` | 1 per macro |
| `sitemapSummarize=` | 2 per macro (sitemap pick + summarize) |
| `topThree*Summarized=` | 3 per macro (satu per hasil) |
