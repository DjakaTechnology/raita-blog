---
title: "Auto-Pilot"
description: "Otomatisasi pembuatan dan penerbitan konten pada jadwal."
order: 2
draft: false
---


Auto-Pilot secara otomatis menemukan topik trending dan membuat artikel pada jadwal. Ini mendukung dua jenis sumber: feed **RSS / Sitemap** dan **Google Trends**.

---

## Penyiapan

Auto-Pilot dikonfigurasi per proyek. Buka proyek Anda dan klik tab **Auto-Pilot**.

### 1. Pilih Jenis Sumber

- **RSS / Sitemap** — pantau feed berita dan sitemap, kemudian buat artikel dari URL yang baru diterbitkan
- **Google Trends** — pantau pencarian trending harian dan tulis artikel tentang topik yang sedang naik

### 2. Konfigurasikan Sumber

Untuk **Google Trends**:

- **Trend Region** — pilih negara untuk dipantau (contoh: United States, Indonesia)
- **Check every** — seberapa sering memeriksa tren baru (contoh: setiap 1 jam)
- **Articles per trend** — berapa banyak ide artikel unik untuk dibuat per topik trending (default: 2)

Untuk **RSS / Sitemap**:

- **Feed URL** — URL feed RSS/Atom atau sitemap untuk dipantau
- **Check every** — interval polling

### 3. Atur Perilaku

- **When new content is found** — pilih untuk otomatis membuat artikel sebagai draft atau publikasikan otomatis
- **Title & Keyword** — cara mengekstrak judul artikel (contoh: tulis ulang trend menjadi headline asli)
- **Daily limit** — maksimal artikel yang dibuat per hari

### 4. Atur Filter AI (Opsional)

Tambahkan prompt filter untuk hanya membuat artikel yang cocok dengan niche Anda:

> contoh: "Only generate articles about coffee. Skip news roundups and opinion pieces."

AI mengevaluasi setiap entri baru terhadap prompt ini untuk memutuskan apakah akan membuat. Kosongkan untuk menerima semua.

### 5. Pilih Template Prompt

Pilih prompt pembuatan — pilih template starter (Simple V4, Blaze V4, Compose V4) atau konfigurasikan secara manual.

### 6. Mulai

Klik **Generate** untuk mengaktifkan Auto-Pilot. Ini akan mulai memantau dan membuat artikel secara otomatis.

![Formulir konfigurasi Auto-Pilot](../images/auto-pilot-form.png)

---

## Feed Aktif & Inbox

Setelah dikonfigurasi, feed Anda muncul di bagian **Active Feeds** dari tab Auto-Pilot. Setiap feed menampilkan tipenya (RSS, Google Trends), interval polling, waktu poll terakhir, dan status saat ini.

Di bawah feed aktif adalah **Inbox** — di sini item baru mendarat ketika kebijakan sumber diatur ke tinjauan manual, atau ketika AI tidak yakin tentang relevansi trend.

![Dashboard Auto-Pilot dengan feed aktif dan inbox](../images/auto-pilot-dashboard.png)

### Bekerja dengan Inbox

Setiap item inbox menampilkan judul trend atau artikel, tanggal deteksi, dan dua aksi:

- **Research** — AI meneliti trend dan membuat beberapa ide artikel unik berdasarkannya. Ini kemudian antri sebagai Article Workers.
- **Skip** — abaikan trend jika tidak cocok dengan niche Anda

Untuk sumber auto-draft atau auto-publish, artikel dibuat secara otomatis tanpa muncul di inbox.

---

## Activity Log

Artikel yang dibuat muncul di tabel **Article Worker** biasa dan log **Activity** di tab Auto-Pilot. Log aktivitas menampilkan setiap artikel yang dibuat dengan topik, sumber (Trends/RSS), waktu, dan status.

![Log aktivitas Auto-Pilot](../images/auto-pilot-activity.png)

---

## AI Filtered

Di bawah log aktivitas adalah bagian **AI Filtered**. Ini menampilkan trends dan artikel yang ditolak oleh filter AI Anda, bersama dengan **Reason** mengapa mereka disaring (contoh: "sports news, not investment").

Setiap item yang disaring memiliki dua aksi:
- **Research** — timpa filter dan buat artikel dari trend ini saja
- **Dismiss** — hapus secara permanen dari daftar

Anda juga dapat **Generate All** atau **Dismiss All** secara massal.

Di bawah AI Filtered adalah bagian **Skipped Duplicates**, menampilkan item yang dilewati karena sudah dibuat.

![Bagian AI Filtered menampilkan trends yang ditolak dengan alasan](../images/auto-pilot-ai-filtered.png)
