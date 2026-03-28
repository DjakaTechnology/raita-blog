---
title: "Referensi Format Ekspor"
description: "Semua format ekspor yang didukung dan opsinya."
order: 5
draft: false
---


---

## Cara Mengekspor

1. Pilih artikel di tabel proyek menggunakan checkbox.
2. Klik **Export** di bilah aksi massal.
3. Pilih format, konfigurasikan opsi, dan klik **Download**.

Untuk penerbitan WordPress langsung melalui REST API (tanpa unduhan file), lihat [Publishing to WordPress](../publishing/wordpress.md).

---

## WordPress XML (WXR)

**Jenis file:** `.xml`
**Use case:** Impor ke WordPress melalui Tools → Import → WordPress

**Pemetaan bidang:**

| Bidang WordPress | Sumber |
|---|---|
| `dc:creator` | Nama pengguna akun Raita |
| `title` | Judul artikel |
| `content:encoded` | Badan HTML artikel |
| `wp:post_name` | Slug URL (dibuat dari judul atau kata kunci) |
| `wp:post_type` | `post` (selalu) |
| `wp:status` | `draft`, `publish`, atau `future` (future jika tanggal publikasi di masa depan) |
| `wp:post_date` / `wp:post_date_gmt` | Tanggal ekspor atau terjadwal |
| `category` (domain: category) | Kategori yang dikonfigurasi atau niche |
| `category` (domain: post_tag) | Meta keywords (saat "Use meta keywords as tags" diaktifkan) |
| Meta description | Diinjeksi melalui template meta kustom (dikonfigurasi di pengaturan Ekspor) |
| SEO keyphrase | Topik artikel (saat "Use keyword as keyphrase" diaktifkan) |

**Format:** WXR 1.2 (RSS 2.0 envelope dengan namespace WordPress).

---

## Blogger XML

**Jenis file:** `.xml`
**Use case:** Impor ke Blogger melalui Settings → Manage Blog → Import content

**Pemetaan bidang Blogger:**

| Bidang Blogger | Sumber |
|---|---|
| `ns0:title` | Judul artikel |
| `ns0:content` | Badan HTML artikel |
| `ns0:published` / `ns0:updated` | Tanggal ekspor atau terjadwal (RFC 3339) |
| `ns0:category` (kind) | `http://schemas.google.com/blogger/2008/kind#post` |
| `ns0:category` (ns) | Kategori yang dikonfigurasi atau niche |
| `app:draft` | Atur ke `yes` ketika status publikasi adalah `draft` |

**Format:** Feed Atom dengan namespace Blogger.

---

## Hugo / Markdown

**Jenis file:** `.md` (satu file per artikel, di-zip)
**Use case:** Situs statis Hugo

**Bidang front matter:**

| Bidang | Nilai |
|---|---|
| `title` | Judul artikel |
| `description` | Meta description |
| `date` | Tanggal ekspor atau terjadwal (RFC 3339, zona waktu lokal) |
| `draft` | `false` ketika status publikasi adalah `publish`; `true` sebaliknya |
| `categories` | Daftar item tunggal dengan kategori atau niche yang dikonfigurasi (dihilangkan jika kosong) |
| `tags` | Daftar meta keywords (saat "Use meta keywords as tags" diaktifkan) |

**Body:** Konten artikel dikonversi dari HTML ke Markdown (GFM). Tabel, gambar, dan heading dipisahkan oleh baris kosong untuk rendering yang benar.

**Nama file:** `<slug>.md` — slug diturunkan dari judul artikel atau kata kunci tergantung opsi ekspor.

---

## CSV

**Jenis file:** `.csv`
**Use case:** Tinjauan spreadsheet, impor CMS kustom, pemrosesan data massal

**Kolom (sesuai urutan):**

| Kolom | Konten |
|---|---|
| `slug` | Slug URL yang diturunkan dari judul atau kata kunci |
| `publish_status` | Status publikasi (contoh: `draft`, `publish`) |
| `date` | Tanggal pembuatan atau terjadwal (RFC 3339, zona waktu lokal) |
| `content` | Badan HTML artikel |
| `title` | Judul artikel |
| `category` | Kategori yang dikonfigurasi atau niche |
| `description` | Meta description (string kosong jika tidak ada) |
| `keyword` | Kata kunci target sebagai array JSON (contoh: `["seo","content"]`) |
| `tags` | Meta keywords sebagai array JSON saat "Use meta keywords as tags" diaktifkan; array kosong sebaliknya |

**Catatan:**
- File tidak memiliki baris header — kolom diidentifikasi berdasarkan posisi.
- Karakter khusus dalam `content` dinormalisasi: kutip bergelombang → kutip lurus, en-dash → hyphen.

---

## HTML

**Jenis file:** `.html` (satu file per artikel, di-zip)
**Use case:** Halaman web mandiri, tinjauan lokal, hosting statis

**Struktur dokumen default (tidak ada template kustom):**

| Elemen | Konten |
|---|---|
| `<title>` | Judul artikel |
| `<meta type="description">` | Meta description (saat ada) |
| `<meta type="keywords">` | Meta keywords digabungkan dengan `, ` (saat ada) |
| `<h1>` di dalam `<header>` | Judul artikel |
| `<body>` | Badan HTML artikel |

**Template kustom:** Jika template HTML dikonfigurasi di dialog ekspor, Raita mengganti placeholder berikut:

| Placeholder | Diganti dengan |
|---|---|
| `{{title}}` | Judul artikel |
| `{{content}}` | Badan HTML artikel |
| `{{meta.description}}` | Meta description |
| `{{meta.keywords}}` | Meta keywords digabungkan dengan `, ` |
| `{{meta}}` | Tag `<meta>` lengkap untuk description dan keywords |

**Nama file:** `<slug>.html` — slug diturunkan dari judul artikel atau kata kunci.
