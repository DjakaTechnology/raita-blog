---
title: "Ekspor Gambar"
description: "Ekspor dan kelola gambar yang dibuat AI dari artikel Anda."
order: 3
draft: false
---


Gambar dapat dibuat bersama artikel dan diunduh secara individual atau massal.

---

## Pembuatan Gambar

Untuk menyertakan gambar dengan artikel yang dibuat:

1. Saat membuat article worker baru, klik **Image Generation Options**
2. Alihkan **Generate Images** on
3. Konfigurasikan:
   - Jumlah gambar per artikel
   - Gaya gambar dan kata kunci (opsional)
4. Selesaikan alur kerja pembuatan artikel

Gambar yang dibuat disimpan secara lokal di direktori data app dan direferensikan dalam HTML artikel.

---

## Melihat Gambar yang Dibuat

Setelah artikel dibuat dengan gambar:

1. Klik **View** di baris artikel untuk membuka editor
2. Gambar muncul inline dengan konten artikel

![Editor artikel menampilkan gambar yang dibuat inline](../images/article-editor.png)

---

## Mengunduh Gambar

Ketika Anda mengekspor artikel (WordPress XML, HTML, dll.), gambar otomatis disertakan — Anda tidak perlu mengekspor mereka secara terpisah.

Jika Anda perlu mengunduh gambar tanpa mengekspor artikel (jarang diperlukan), Anda dapat:

- Klik tombol **Export Image** di baris artikel individual
- Gunakan **Bulk Export Image** dari menu ⋮ untuk mengunduh semua gambar sekaligus

---

## Format dan Penyimpanan Gambar

- Gambar yang dibuat dikonversi ke format **WebP** untuk ukuran file optimal
- Gambar disimpan secara lokal sebagai: `{project_id}/images/{slug}_{worker_id}/managed_{slug}_{index}.webp`
- Gambar yang diunduh mempertahankan format WebP kecuali menggunakan sumber gambar BYOK legacy (Bing), yang mungkin PNG/JPG
