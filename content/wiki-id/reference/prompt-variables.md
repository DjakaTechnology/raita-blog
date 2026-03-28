---
title: "Referensi Prompt Variables"
description: "Referensi lengkap untuk semua prompt variables yang tersedia."
order: 1
draft: false
---


Referensi lengkap untuk semua variabel yang didukung di bidang prompt Raita.

---

## Variabel Umum

Tersedia di semua mode dan semua tahap.

| Variabel | Diganti dengan | Catatan |
|---|---|---|
| `{topic}` | Bidang topik Article Worker | |
| `{keyword}` | Sama dengan `{topic}` | Alias |
| `{niche}` | Bidang niche Worker | |
| `{language}` | Bidang language Worker | |
| `{topicQueryParam}` | URL-encoded `{topic}` | Digunakan secara internal oleh search macros |

---

## Variabel Mode Blaze

Hanya tersedia di mode Blaze, pada tahap yang ditunjukkan.

| Variabel | Tahap | Diganti dengan |
|---|---|---|
| `{title}` | Detail, Meta, Opening, Closing | Judul artikel yang dibuat |
| `{lsi}` | Detail | Daftar bagian yang dibuat (heading dipisahkan baris baru) |
| `{outline}` | Detail | Sama dengan `{lsi}` |
| `{section}` | Detail | Heading bagian saat ini yang dibuat |
| `{subtopic}` | Detail | Subtopik saat ini dalam bagian |
| `{index}` | Detail | Indeks bagian (integer berbasis 0) |
| `{item}` | Detail | Item saat ini dari daftar outline |
| `{internal_links}` | Detail | HTML link internal yang dibuat |
| `{internalLinks}` | Detail | Sama dengan `{internal_links}` (alias) |

---

## Variabel Mode Compose

| Variabel | Diganti dengan | Catatan |
|---|---|---|
| `{title}` | Judul artikel yang dibuat | Hanya jika prompt judul dikonfigurasi |
| `{index}` | Indeks bagian (integer berbasis 0) | |
| `{internalLink}` | Satu tag anchor link internal | Dari daftar internal link target |
| `{random5InternalLink}` | 5 tag anchor link internal yang dipilih secara acak | Dari daftar internal link target |
| `{chain}` | Semua bagian yang dibuat sebelumnya digabungkan | Hanya mode berantai (chained) |

---

## Flag Khusus

| Flag | Mode | Efek |
|---|---|---|
| `{debug}` | Simple | Harus muncul di **awal** prompt. Mengembalikan teks prompt yang sepenuhnya diinjeksi tanpa memanggil model AI |
| `{webSearch}` | All | Aktifkan pencarian web tingkat penyedia (lihat AI Provider Setup) |
| `{imagegen}` | All | Trigger pembuatan gambar untuk artikel ini |

---

## Catatan

- Variabel case-sensitive. `{topic}` bekerja; `{Topic}` tidak.
- Variabel yang tidak terselesaikan dibiarkan sebagai teks literal dalam prompt.
- `{internalLinks}` / `{internal_links}` yang mencapai lapisan perluasan scraper tanpa terselesaikan dihapus.
