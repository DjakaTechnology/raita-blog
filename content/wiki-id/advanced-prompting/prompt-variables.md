---
title: "Prompt Variables"
description: "Gunakan variabel dinamis dalam prompt Anda untuk pembuatan yang lebih kaya dan kontekstual."
order: 1
draft: false
---


Variabel adalah placeholder dalam teks prompt Anda yang Raita ganti saat pembuatan.

Tuliskan sebagai `{variableName}` di mana pun dalam bidang prompt.

![Editor prompt dengan variabel](../images/prompt-editor-variables.png)

---

## Variabel Umum (semua mode)

| Variabel | Diganti dengan |
|---|---|
| `{topic}` | Bidang topik Article Worker |
| `{keyword}` | Sama dengan `{topic}` (alias) |
| `{niche}` | Bidang niche worker |
| `{language}` | Bidang language worker |
| `{topicQueryParam}` | Versi URL-encoded dari `{topic}` (digunakan dalam search macros) |

---

## Variabel Mode Blaze

Ini hanya tersedia dalam prompt mode Blaze, dan hanya pada tahap di mana mereka dibuat:

| Variabel | Tersedia di | Diganti dengan |
|---|---|---|
| `{title}` | Detail, Meta, Opening, Closing | Judul yang dibuat |
| `{lsi}` | Detail | Daftar bagian yang dibuat (dipisahkan baris baru) |
| `{outline}` | Detail | Sama dengan `{lsi}` — teks outline lengkap |
| `{section}` | Detail | Heading bagian saat ini yang dibuat |
| `{subtopic}` | Detail | Subtopik saat ini |
| `{index}` | Detail | Nomor indeks bagian (berbasis 0) |
| `{item}` | Detail | Item saat ini dari outline |
| `{internal_links}` / `{internalLinks}` | Detail | HTML link internal yang dibuat |

---

## Variabel Mode Compose

| Variabel | Diganti dengan |
|---|---|
| `{title}` | Judul yang dibuat (jika prompt judul diatur) |
| `{index}` | Nomor indeks bagian (berbasis 0) |
| `{internalLink}` | Satu link internal dari daftar target |
| `{random5InternalLink}` | 5 link internal yang dipilih secara acak |
| `{chain}` | Semua bagian yang dibuat sebelumnya (mode berurutan saja) |

---

## Flag Khusus

| Flag | Efek |
|---|---|
| `{debug}` | (Hanya mode Simple) Kembalikan teks prompt yang diinjeksi tanpa memanggil AI |
| `{webSearch}` | Aktifkan pencarian web untuk prompt ini (tergantung penyedia — lihat [AI Provider Setup](../getting-started/ai-provider-setup.md)) |
| `{imagegen}` | Trigger pembuatan gambar untuk artikel ini |

---

## Tips

- Variabel case-sensitive: `{topic}` bekerja, `{Topic}` tidak
- Variabel yang tidak dapat diselesaikan dibiarkan apa adanya dalam prompt (contoh: jika `{title}` digunakan sebelum pembuatan judul berjalan)
- `{internalLinks}` yang mencapai lapisan scraper tanpa terselesaikan dihapus secara otomatis
