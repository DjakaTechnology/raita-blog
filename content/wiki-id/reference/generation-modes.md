---
title: "Referensi Mode Pembuatan"
description: "Perbandingan mode pembuatan Simple, Blaze, dan Compose."
order: 4
draft: false
---


---

## Urutan Dispatch Mode

Ketika worker berjalan, mode diperiksa dalam urutan ini: **Compose → Blaze → Simple**. Hanya mode pertama yang terisi yang dieksekusi.

---

## Mode Simple

Satu panggilan AI mengembalikan artikel lengkap.

**Bidang konfigurasi:**

| Bidang | Tipe | Diperlukan | Deskripsi |
|---|---|---|---|
| `prompt` | InputPrompt | Ya | Konfigurasi prompt (lihat InputPrompt Fields di bawah) |
| `auto_internal_link` | boolean | Tidak | Otomatis-injeksi link internal |
| `image_gen` | object | Tidak | Konfigurasi pembuatan gambar |

**Eksekusi:**
1. Injeksi placeholder umum (`{topic}`, `{niche}`, `{language}`, `{keyword}`)
2. Perluas scraper macros
3. Jika prompt dimulai dengan `{debug}`, kembalikan prompt yang diinjeksi tanpa memanggil AI
4. Kirim prompt tunggal ke model
5. Ekstrak tag meta dari HTML yang dibuat

**Terbaik untuk:** Prompt sekali jalan yang ringkas, otomasi feed/SILO, pembuatan cepat.

---

## Mode Blaze

Beberapa panggilan AI berurutan merakit artikel terstruktur.

**Bidang konfigurasi:**

| Bidang | Tipe | Diperlukan | Deskripsi |
|---|---|---|---|
| `title_prompt` | InputPrompt | Ya | Membuat judul artikel |
| `lsi_prompt` | InputPrompt | Ya | Membuat garis besar bagian (daftar LSI) |
| `detail_prompt` | InputPrompt | Ya | Membuat badan setiap bagian |
| `meta_prompt` | InputPrompt | Tidak | Membuat meta description |
| `opening_prompt` | InputPrompt | Tidak | Membuat paragraf pengantar |
| `closing_prompt` | InputPrompt | Tidak | Membuat paragraf kesimpulan |
| `internal_link_prompt` | InputPrompt | Tidak | Membuat kandidat link internal |
| `internal_link_target` | string | Tidak | URL untuk sumber link internal |
| `auto_internal_link` | boolean | Tidak | Otomatis-injeksi link internal |
| `image_gen` | object | Tidak | Konfigurasi pembuatan gambar |

**Urutan eksekusi:**
1. Hasilkan judul
2. Hasilkan garis besar (daftar bagian LSI)
3. Hasilkan link internal (jika dikonfigurasi)
4. Hasilkan meta / pembukaan / penutupan (secara paralel, jika dikonfigurasi)
5. Hasilkan badan setiap bagian (satu panggilan per bagian)
6. Injeksi link internal ke bagian yang dipilih
7. Gabungkan: pembukaan + bagian + penutupan (meta disimpan terpisah)

**Terbaik untuk:** Artikel long-form terstruktur, konten multi-bagian, karya penelitian detail.

---

## Mode Compose

Komposisi berbasis bagian — setiap bagian memiliki promptnya sendiri, digabungkan oleh string glue.

**Bidang konfigurasi:**

| Bidang | Tipe | Diperlukan | Deskripsi |
|---|---|---|---|
| `title_prompt` | InputPrompt | Tidak | Membuat judul artikel |
| `meta_prompt` | InputPrompt | Ya | Membuat meta description |
| `contents_prompt` | InputPrompt[] | Ya | Array prompt bagian |
| `glue_string` | string | Ya | String yang disisipkan antara bagian |
| `internal_link_target` | string[] | Tidak | URL untuk injeksi link internal |
| `auto_internal_link` | boolean | Tidak | Otomatis-injeksi link internal |
| `image_gen` | object | Tidak | Konfigurasi pembuatan gambar |

**Eksekusi:**
- Jika ada `contents_prompt` berisi `{chain}`: mode **berurutan (berantai)** — bagian berjalan satu per satu sesuai urutan, masing-masing menerima output sebelumnya sebagai `{chain}`
- Sebaliknya: mode **paralel** — semua bagian berjalan secara bersamaan
- Artikel akhir = judul + bagian digabungkan oleh `glue_string`

**Terbaik untuk:** Komposisi berbasis bagian yang fleksibel, konteks berantai (setiap bagian membangun dari yang sebelumnya), menggunakan kembali prompt bagian modular.

---

## Bidang InputPrompt

Setiap objek `InputPrompt` memiliki:

| Bidang | Tipe | Deskripsi |
|---|---|---|
| `prompt` | string | Teks prompt (mendukung variabel dan macros) |
| `temperature` | float | Kreativitas/keacakan (0.0–2.0) |
| `model` | string (opsional) | Override model (menggunakan default Settings jika kosong) |
| `webSearch` | boolean (opsional) | Aktifkan pencarian web untuk prompt ini |
| `imagegen` | boolean (opsional) | Hasilkan gambar untuk output prompt ini |

---

## Variabel Placeholder

Placeholder umum yang diinjeksi sebelum panggilan model:

| Variabel | Deskripsi |
|---|---|
| `{topic}` | Topik artikel / kata kunci |
| `{keyword}` | Sama dengan `{topic}` |
| `{niche}` | Niche/vertikal proyek |
| `{language}` | Bahasa konten |
| `{topicQueryParam}` | Topik berkode URL (untuk search macros) |

**Spesifik Blaze:**
- `{title}` — judul artikel yang dibuat
- `{lsi}`, `{section}`, `{outline}` — garis besar/daftar bagian LSI
- `{index}`, `{item}` — indeks bagian/nama
- `{internal_links}` — kandidat link internal
- `{subtopic}` — topik sub-bagian

**Spesifik Compose:**
- `{title}` — judul artikel yang dibuat
- `{index}` — indeks bagian
- `{chain}` — output dari bagian sebelumnya (hanya mode berantai)
- `{internalLink}` — kandidat link internal
- `{random5InternalLink}` — 5 kandidat link internal

Lihat [Referensi Prompt Variables](prompt-variables.md) untuk detail lengkap.
