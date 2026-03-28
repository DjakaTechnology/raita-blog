---
title: "Mode Blaze"
description: "Pembuatan artikel multi-tahap dengan perakitan terstruktur di mode Blaze."
order: 3
draft: false
---


Mode Blaze merakit artikel melalui **beberapa panggilan AI berurutan**: hasilkan judul → hasilkan garis besar → hasilkan badan bagian → secara opsional tambahkan meta/pembukaan/penutupan → injeksikan link internal → gabungkan.

**Terbaik untuk:**
- Artikel long-form, terstruktur (2.000+ kata)
- Ketika Anda ingin kontrol granular atas setiap tahap pembuatan
- Membangun konten dengan struktur heading yang konsisten

---

## Template Starter

Raita dilengkapi dengan template Blaze siap pakai sehingga Anda dapat mulai membuat segera:

![Pemilih template starter](../images/starting-prompt.png)

| Template | Deskripsi |
|---|---|
| **Blaze V4** | ~3.000+ kata. Garis besar → perluas bagian untuk artikel yang lebih dalam. |
| **Blaze V4 + AI Image** | ~3.000+ kata. Garis besar → perluas bagian dengan pembuatan gambar AI. |

Untuk menggunakan template starter, klik **+ New Task**, kemudian pilih template dari pemilih template. Semua tahap prompt (judul, garis besar, detail, dll.) sudah dikonfigurasi — cukup masukkan kata kunci dan buat.

---

## Konfigurasi

Dalam formulir New Task, pilih tab **Blaze**.

![Formulir konfigurasi mode Blaze](../images/blaze-mode-form.png)

---

## Bidang yang Diperlukan

### Prompt Judul

Membuat judul artikel. Menerima `{topic}`, `{niche}`, `{language}`.

Contoh:
```
Write one compelling, SEO-friendly article title for a post about {topic}.
Target audience: {niche}. Language: {language}.
Return only the title, no quotes or explanation.
```

### Prompt LSI / Bagian

Membuat garis besar — daftar heading bagian. Output prompt ini menjadi `{lsi}` dan `{outline}` untuk tahap-tahap selanjutnya.

Contoh:
```
Generate a list of 5-7 section headings for an article titled "{title}" about {topic}.
Return one heading per line. No numbering, no explanation.
```

### Prompt Detail

Membuat badan setiap bagian. Dipanggil sekali per bagian. Menerima `{title}`, `{section}`, `{lsi}`, `{outline}`, `{topic}`, `{index}`.

Contoh:
```
Write the full content for the section "{section}" in an article about {topic}.
Article title: {title}
Full outline: {outline}
Write in HTML with h3 subheadings and paragraphs. 300-500 words.
```

---

## Bidang Opsional

### Prompt Meta

Membuat deskripsi HTML `<meta>`. Menerima `{title}`, `{topic}`.

### Prompt Pembukaan

Membuat paragraf pengantar yang disisipkan sebelum bagian pertama.

### Prompt Penutupan

Membuat paragraf kesimpulan yang ditambahkan setelah bagian terakhir.

### Prompt Link Internal

Membuat link internal untuk disuntikkan ke artikel. Bekerja bersama dengan **Internal Link Target** (URL dari sitemap situs Anda atau daftar halaman).

Lihat [Using Internal Links](../site-intelligence/internal-links.md) untuk detail penyiapan.

---

## Urutan Eksekusi

Blaze menjalankan tahap dalam urutan ini:
1. Hasilkan judul
2. Hasilkan garis besar (daftar bagian LSI)
3. Hasilkan link internal (jika dikonfigurasi)
4. Hasilkan meta / pembukaan / penutupan (secara paralel)
5. Hasilkan badan setiap bagian (menggunakan `{section}` dari garis besar)
6. Injeksikan link internal ke bagian yang dipilih
7. Gabungkan: pembukaan + bagian + penutupan (deskripsi meta disimpan sebagai bidang terpisah, bukan bagian dari badan)

Artikel akhir dirakit dari semua bagian ini.

---

## Variabel Tersedia berdasarkan Tahap

| Tahap | Variabel tersedia |
|---|---|
| Judul | `{topic}`, `{keyword}`, `{niche}`, `{language}` |
| LSI/Garis Besar | `{title}`, `{topic}`, `{keyword}`, `{niche}`, `{language}` |
| Detail | `{title}`, `{section}`, `{lsi}`, `{outline}`, `{topic}`, `{keyword}`, `{niche}`, `{language}`, `{index}`, `{subtopic}`, `{item}` |
| Meta/Pembukaan/Penutupan | `{title}`, `{topic}`, `{keyword}`, `{niche}`, `{language}` |
| Link Internal | `{topic}`, `{keyword}`, `{title}`, `{niche}`, `{language}`, `{internal_links}` |

Lihat [Referensi Prompt Variables](../reference/prompt-variables.md) untuk daftar lengkap.
