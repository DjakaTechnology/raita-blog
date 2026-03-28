---
title: "Apa itu Raita?"
description: "Gambaran umum tentang apa itu Raita, untuk siapa, dan cara kerjanya."
order: 2
draft: false
---

Raita adalah aplikasi desktop operasi konten bertenaga AI untuk Windows dan macOS.

Ini memungkinkan Anda membuat, mengelola, dan menerbitkan artikel dalam skala besar menggunakan model bahasa besar — dengan kunci API Anda sendiri (BYOK) atau sistem token terkelola Raita.

![Dasbor utama Raita](../images/raita-main-dashboard.png)

---

## Apa yang Bisa Anda Lakukan Dengan Raita

**Buat artikel** — buat artikel yang dioptimalkan SEO menggunakan salah satu dari tiga mode generasi:
- **Simple** — generasi satu kali dari prompt tunggal
- **Blaze** — perakitan multi-tahap (judul → garis besar → bagian → meta)
- **Compose** — penulisan bagian demi bagian dengan kontrol penuh atas struktur

**Otomatiskan pembuatan konten** menggunakan:
- **Feed Monitor** — pantau umpan RSS dan buat artikel otomatis dari item baru
- **SILO Planner** — rencanakan dan buat silo konten lengkap dari satu topik
- **Clone Bot** — buat artikel dalam batch dari daftar topik menggunakan template bersama
- **Auto Pilot** — penerbitan otomatis dengan integrasi Google Trends untuk penemuan topik

**Terbitkan langsung** ke WordPress melalui REST API, atau ekspor ke WordPress XML, Blogger XML, Hugo/Markdown, CSV, atau HTML.

**Gunakan penyedia AI apa pun** — OpenAI (GPT-4o, GPT-4.1), Google Gemini, Azure OpenAI, OpenRouter, atau titik akhir kompatibel OpenAI kustom apa pun.

---

## Untuk Siapa?

- **Pemasar konten** membangun otoritas topik dengan perpustakaan artikel besar
- **Profesional SEO** membuat konten programatis dalam skala besar
- **Blogger dan penerbit** yang ingin mempercepat alur kerja menulis mereka
- **Agensi** mengelola produksi konten di berbagai situs klien

---

## Cara Kerjanya

Raita adalah aplikasi desktop [Tauri](https://tauri.app/) — jendela asli yang menjalankan frontend React berkomunikasi dengan backend Rust. Generasi artikel berjalan secara lokal (kunci API Anda tetap di mesin Anda) atau melalui pipeline cloud terkelola Raita.

Artikel, proyek, dan pengaturan Anda disimpan dalam database SQLite lokal di komputer Anda.
