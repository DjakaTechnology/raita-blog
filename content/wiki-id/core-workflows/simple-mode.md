---
title: "Mode Simple"
description: "Buat artikel dengan satu prompt di mode Simple."
order: 2
draft: false
---


Mode Simple mengirimkan **satu prompt** ke AI dan mengembalikan hasilnya sebagai artikel Anda. Ini adalah mode paling cepat dan paling fleksibel.

**Terbaik untuk:**
- Artikel panjang pendek hingga menengah
- Ketika Anda ingin kontrol penuh atas struktur output dalam satu prompt
- Pembuatan satu kali yang cepat

---

## Template Starter

Raita dilengkapi dengan template Simple siap pakai sehingga Anda dapat mulai membuat segera:

![Pemilih template starter](../images/starting-prompt.png)

| Template | Deskripsi |
|---|---|
| **Simple V4** *(Direkomendasikan)* | ~2.000+ kata. Pembuatan sekali jalan dengan pencarian web & gambar Google. |
| **Simple V4 + AI Image** | ~2.000+ kata. Pembuatan sekali jalan dengan pencarian web & pembuatan gambar AI. |
| **Simple Kimi K2.5** *(Termurah)* | ~2.000+ kata. Pembuatan sekali jalan via Kimi K2.5 dengan pencarian web. |
| **Simple Mercury 2** *(Termurah)* | ~1.500 kata. Pembuatan sekali jalan cepat via Mercury 2. |

Untuk menggunakan template starter, klik **+ New Task**, kemudian pilih template dari pemilih template. Prompt, model, dan pengaturan sudah dikonfigurasi — cukup masukkan kata kunci dan buat.

---

## Konfigurasi

Dalam formulir New Task, pilih tab **Simple**.

![Formulir konfigurasi mode Simple](../images/simple-mode-form.png)

### Prompt

Prompt utama yang dikirim ke AI. Mendukung semua [prompt variables](../advanced-prompting/prompt-variables.md) dan [scraper macros](../advanced-prompting/scraper-macros.md).

Template awal yang bagus:

```
Write a comprehensive, SEO-optimized article about {topic}.
The target audience is interested in {niche}.
Write in {language}.
Use HTML formatting with proper headings (h2, h3), paragraphs, and lists.
Include a compelling introduction and a conclusion.
```

### Temperature

Mengontrol seberapa kreatif/acak output AI. Rentang: 0.0–2.0.

| Nilai | Efek |
|---|---|
| 0.3–0.5 | Lebih fokus, konsisten, faktual |
| 0.7 | Seimbang (default) |
| 1.0–1.5 | Lebih kreatif, beragam, kadang mengejutkan |

### Model

Ganti model default untuk prompt spesifik ini. Jika dibiarkan kosong, menggunakan model yang dikonfigurasi di Settings.

### Web Search

Alihkan **Web Search** untuk mengaktifkan AI mencari web sebelum membuat. Perilaku bergantung pada penyedia AI Anda:
- **OpenAI** — menggunakan alat pencarian web built-in OpenAI
- **Gemini** — menggunakan Gemini Grounding
- **Penyedia lain** — flag `{webSearch}` dihapus; tidak ada pencarian web yang terjadi

### Image Gen

Alihkan **Image Gen** untuk membuat dan melampirkan gambar ke artikel.

---

## Debug Mode

Tambahkan `{debug}` ke awal prompt Anda untuk melihat preview prompt yang disuntikkan sepenuhnya tanpa mengirimnya ke AI. Tampilan hasil akan menampilkan teks prompt yang diperluas alih-alih artikel yang dibuat. Berguna untuk memeriksa bahwa variabel dan makro terselesaikan dengan benar.

---

## Randomisasi Multi-Prompt

Gunakan `|` di prompt Anda untuk menentukan alternatif. Raita memilih satu cabang secara acak saat pengiriman:

```
Write a formal article about {topic} | Write a conversational article about {topic}
```

Lihat [Randomization](../advanced-prompting/randomization.md) untuk detail.
