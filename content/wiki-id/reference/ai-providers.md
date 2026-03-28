---
title: "Referensi Penyedia AI"
description: "Penyedia AI yang didukung, model, dan kemampuan mereka."
order: 3
draft: false
---


---

## Mode Eksekusi

| Mode | Deskripsi |
|---|---|
| **Raita Managed** | Pembuatan berjalan di pipeline cloud Raita. Ditagih dalam token Raita. Tidak ada kunci API eksternal yang diperlukan. |
| **BYOK** | Pembuatan berjalan secara lokal, memanggil API penyedia AI secara langsung menggunakan kunci Anda. Biaya API ditagih ke akun penyedia Anda. |

---

## Penyedia yang Didukung

| Penyedia | Kunci diperlukan | Dukungan pencarian web | Catatan |
|---|---|---|---|
| Raita Managed | Dompet token Raita | Melalui pipeline terkelola | Tidak ada kunci eksternal yang diperlukan |
| OpenAI | Kunci API OpenAI | Ya — alat pencarian web (`/v1/responses`) | GPT-4o, GPT-4.1, GPT-4.1 Mini, GPT-4o Mini, GPT-4.1 Nano, GPT-5.4 |
| Google Gemini | Kunci API Gemini | Ya — melalui jalur penyedia Gemini | Gemini 2.5 Flash, Gemini 2.5 Pro, Gemini 3.1 Pro Preview, Gemini 3.1 Flash Lite Preview, Gemini 3 Flash Preview |
| Azure OpenAI | Endpoint Azure + kunci + nama deployment | Bergantung pada model yang di-deploy | Model apa pun yang di-deploy di sumber daya Azure Anda |
| OpenRouter | Kunci API OpenRouter | Tidak | Akses ke banyak penyedia melalui kunci tunggal (contoh: Kimi K2.5, Mercury 2) |
| Custom endpoint | Kunci API opsional | Tidak | API kompatibel OpenAI apa pun (Ollama, LM Studio, dll.) |

---

## Konfigurasi Penyedia

Semua kunci penyedia dikonfigurasi di **Settings → AI Provider**.

| Penyedia | Bidang yang diperlukan |
|---|---|
| Raita Managed | (tidak ada — menggunakan dompet token) |
| OpenAI | Kunci API |
| Google Gemini | Kunci API |
| Azure OpenAI | URL Endpoint, Kunci API, nama deployment |
| OpenRouter | Kunci API |
| Custom endpoint | Base URL, Kunci API (opsional) |

---

## Harga Model (Raita Managed)

Raita menagih dalam **token Raita** (berdasarkan biaya API model aktual dengan margin ~3x). Terakhir diverifikasi Maret 2026. Tarif dalam token per 1M token (input / output):

### OpenAI
- **GPT-4.1 Nano**: 1.25 / 5.0
- **GPT-4o Mini**: 3.75 / 15.0
- **GPT-4.1 Mini**: 10.0 / 40.0
- **GPT-4.1**: 50.0 / 200.0
- **GPT-4o**: 62.5 / 250.0
- **GPT-5.4**: 62.5 / 375.0

### Google Gemini
- **Gemini 3.1 Flash Lite Preview**: 2.5 / 10.0
- **Gemini 2.5 Flash**: 7.5 / 62.5
- **Gemini 3 Flash Preview**: 12.5 / 75.0
- **Gemini 2.5 Pro**: 31.25 / 250.0
- **Gemini 3.1 Pro Preview**: 50.0 / 300.0

### OpenRouter (contoh)
- **Kimi K2.5**: 11.25 / 55.0
- **Mercury 2**: 6.25 / 18.75

---

## Catatan

- Perilaku `{webSearch}` bervariasi menurut penyedia. Lihat [Referensi Scraper Macros](scraper-macros.md) untuk rincian per-penyedia.
- Untuk penyedia BYOK, pemilihan model dapat ditimpa per-prompt di bidang Model editor prompt.
- Azure OpenAI model tersedia bergantung pada model mana yang Anda deploy di sumber daya Azure Anda.
- Untuk mode Raita Managed, katalog model diperbarui secara teratur saat model baru dan harga tersedia.
