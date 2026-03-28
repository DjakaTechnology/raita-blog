---
title: "Referensi Pengaturan"
description: "Referensi lengkap untuk semua pengaturan aplikasi Raita."
order: 6
draft: false
---


Semua pengaturan diakses melalui link **Settings** di sidebar. Perubahan disimpan dengan mengklik **Save** di sticky action bar di bagian bawah halaman.

---

## AI Provider

Mengontrol layanan mana yang membuat artikel Anda.

| Pengaturan | Deskripsi | Nilai |
|---|---|---|
| **AI Source** | Pilih antara token yang dikelola Raita atau kunci API Anda sendiri | `Raita Tokens` (direkomendasikan), `My API Keys` |
| **Raita Token Fallback** | Saat menggunakan BYOK, kembali ke token Raita jika kunci Anda gagal atau tidak memiliki kuota | On / Off |

### BYOK — API Keys (terlihat ketika AI Source adalah "My API Keys")

| Pengaturan | Deskripsi | Format |
|---|---|---|
| **Gemini API Key** | Kunci Google Gemini dari Google AI Studio | Satu kunci per baris |
| **OpenAI API Key** | Kunci OpenAI untuk model GPT | Satu kunci per baris |
| **OpenRouter API Key** | Kunci OpenRouter untuk 300+ model | `sk-or-...` |
| **Azure API Key** | Endpoint Azure OpenAI + kunci | `https://RESOURCE.openai.azure.com/...;KEY` |

Beberapa kunci di bidang yang sama secara otomatis diputar selama pembuatan batch.

### OpenRouter Models

Tambahkan ID model spesifik untuk membuatnya dapat dipilih di pemilih model.

| Pengaturan | Deskripsi | Format |
|---|---|---|
| **OpenRouter Models** | Daftar ID model OpenRouter untuk expose di Raita | `provider/model-name` (contoh: `mistralai/mistral-7b-instruct`) |

### Model Kustom

Tambahkan endpoint kompatibel OpenAI apa pun sebagai model yang dapat dipilih.

| Pengaturan | Deskripsi | Contoh |
|---|---|---|
| **Model ID** | Identifier yang ditampilkan di pemilih model | `llama-3.1-70b` |
| **Base URL** | URL base API kompatibel OpenAI | `https://api.groq.com/openai/v1` |

---

## Penggunaan Token

Hanya terlihat ketika AI Source diatur ke **Raita Tokens**. Menampilkan saldo token saat ini Anda yang dipecah berdasarkan tipe:

| Jenis saldo | Deskripsi |
|---|---|
| Subscription | Token dari paket bulanan aktif; reset pada tanggal pembaruan |
| Purchased | Token yang dibeli sebagai top-up; tidak kedaluwarsa |
| Trial | Token yang diberikan saat pendaftaran |

Klik **Buy Tokens** untuk membuka halaman pembelian token di browser Anda.

---

## Pembuatan

Mengontrol perilaku default untuk tugas pembuatan artikel.

| Pengaturan | Deskripsi | Catatan |
|---|---|---|
| **Default Niche** | Pre-isi niche/topik untuk worker baru | Teks bebas |
| **Default Language** | Pre-isi bahasa untuk worker baru | Teks bebas (contoh: `English`, `Indonesian`) |
| **Scraping Engine** | Model AI yang digunakan untuk web research / scraping | Dropdown — mencantumkan model AI yang tersedia |
| **Bing Cookies** | String cookie untuk pencarian Bing yang diautentikasi | Tempel dari DevTools browser |
| **Concurrent Workers** | Jumlah artikel yang dibuat secara paralel per jalankan | Integer; nilai lebih rendah mengurangi kesalahan rate-limit API |
| **Max Retries** | Berapa kali pembuatan yang gagal dicoba ulang sebelum menandai sebagai error | Integer |
| **Timeout** | Detik maksimal untuk menunggu permintaan pembuatan tunggal | Integer (detik) |

---

## Ekspor

Pengaturan yang berlaku untuk ekspor file dan pembuatan gambar.

### Ekspor WordPress

| Pengaturan | Deskripsi | Catatan |
|---|---|---|
| **WP Meta Description Template** | HTML kustom atau postmeta XML yang diinjeksi sebagai meta description dalam ekspor WordPress XML | Mendukung placeholder `{value}` untuk teks deskripsi |
| **WP Meta Keywords Template** | HTML kustom atau postmeta XML yang diinjeksi sebagai meta keywords / keyphrase dalam ekspor WordPress XML | Mendukung placeholder `{value}` untuk teks kata kunci |

### Pembuatan Gambar

| Pengaturan | Deskripsi | Nilai |
|---|---|---|
| **Provider** | Layanan AI mana yang membuat gambar | `Auto`, `OpenAI (DALL-E)`, `Google Gemini`, `Custom` |
| **Style** | Gaya visual yang diterapkan ke prompt gambar | `Photorealistic`, `Illustration`, `Flat Design`, `Watercolor`, `3D Render`, `Digital Art` |
| **Aspect Ratio** | Dimensi gambar | `Landscape (16:9)`, `Square (1:1)`, `Portrait (9:16)` |
| **Min Images** | Jumlah minimum gambar yang dibuat per artikel | Integer 1–10 |
| **Max Images** | Jumlah maksimum gambar yang dibuat per artikel | Integer 1–10 |
| **Watermark** | Tambahkan overlay watermark ke gambar yang dibuat | On / Off |

### Database

| Pengaturan | Deskripsi |
|---|---|
| **Database Export/Import** | Backup database SQLite. Salin file database dari direktori data app. Lokasi bervariasi menurut OS (lihat folder app data OS Anda). |

---

## Lisensi

| Pengaturan | Deskripsi |
|---|---|
| **Active License Keys** | Mencantumkan semua kunci lisensi non-expired yang terlampir pada akun Anda |
| **Add License Key** | Masukkan kunci lisensi dan klik **Activate** untuk melampirkannya pada akun Anda |

Kunci lisensi membuka fitur atau memperluas kemampuan di luar paket dasar.

---

## Akun

| Pengaturan | Deskripsi | Nilai |
|---|---|---|
| **Username** | Nama pengguna akun Raita Anda | Hanya-baca |
| **Email** | Alamat email pada akun Cognito Anda | Hanya-baca |
| **Language** | Bahasa tampilan UI | `English`, `Indonesian` |
| **Sign Out** | Akhiri sesi saat ini dan kembali ke halaman sign-in | — |
