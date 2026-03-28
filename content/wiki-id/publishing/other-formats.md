---
title: "Format Lain"
description: "Ekspor artikel sebagai HTML, teks biasa, CSV, dan banyak lagi."
order: 2
draft: false
---


Selain WordPress, Raita dapat mengekspor artikel ke beberapa format lainnya.

---

## Cara Mengekspor

1. Pilih artikel di tabel proyek (gunakan checkbox untuk beberapa)
2. Klik **Export**
3. Pilih format Anda

![Dialog ekspor dengan opsi format](../images/export-dialog.png)

---

## Blogger XML

Mengekspor artikel dalam format import Atom Blogger.

**Untuk mengimpor ke Blogger:**
1. Di Blogger, buka **Settings → Manage Blog**
2. Klik **Import content**
3. Unggah file `.xml`

---

## Hugo / Markdown

Mengekspor setiap artikel sebagai file `.md` dengan front matter untuk situs statis Hugo.

**Bidang front matter yang disertakan:**
- `title`
- `date`
- `draft: false`

**Body:** konten HTML artikel (Hugo merender HTML dalam file markdown).

---

## CSV

Mengekspor semua artikel yang dipilih sebagai file `.csv` tunggal.

**Kolom:**
- `slug`
- `publish_status`
- `date`
- `content` (HTML)
- `title`
- `category`
- `description` (meta description)
- `keyword`
- `tags`

Berguna untuk mengimpor ke CMS kustom atau tinjauan spreadsheet.

---

## HTML

Mengekspor setiap artikel sebagai file `.html` mandiri dengan struktur dokumen dasar.

Berguna untuk hosting statis atau tinjauan lokal.
