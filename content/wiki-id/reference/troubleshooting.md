---
title: "Pemecahan Masalah"
description: "Solusi untuk masalah dan pesan kesalahan umum."
order: 8
draft: false
---


---

## Pembuatan Artikel

| Masalah | Kemungkinan penyebab | Perbaikan |
|---|---|---|
| Worker macet di "Running" selama >5 menit | Timeout API atau permintaan hanging | Coba ulang worker; periksa API key valid |
| Worker gagal dengan status 429 | Rate limit tercapai | Kurangi **Batch per Run** di Settings → Generation; tambahkan delay antara permintaan |
| Worker gagal dengan "401 Unauthorized" | API key tidak valid atau kedaluwarsa | Masukkan kembali API key di Settings → AI Provider |
| Worker gagal dengan "403 Forbidden" | API key kekurangan izin | Periksa API key Anda memiliki scope yang diperlukan |
| Artikel memiliki `{topic}` dalam teks yang dibuat | Variabel tidak diinjeksi | Pastikan bidang **Topic** diisi pada worker |
| `{internalLinks}` muncul secara harfiah dalam output | Tidak ada link internal yang dibuat | Periksa situs dikrawl (tab Sites); verifikasi Internal Link Target URL diatur |
| Pembuatan artikel selesai tetapi konten kosong | Model mengembalikan respons kosong | Periksa prompt valid; coba model berbeda |
| Reservasi token gagal saat awal pembuatan | Saldo token tidak cukup | Top up token melalui badge dompet sidebar |

---

## Prompt & Template

| Masalah | Kemungkinan penyebab | Perbaikan |
|---|---|---|
| Impor template tidak memuat bidang | Format file tidak benar | Pastikan file menggunakan marker bagian `\|======` yang benar; periksa baris kosong tambahan |
| Scraper macro tidak expand | Kesalahan jaringan atau URL diblokir | Periksa koneksi internet; URL target mungkin memblokir scraper |
| `{summarize=URL}` mengembalikan kosong | Halaman di-render JavaScript atau diblokir | Coba `{scrap=URL}` sebagai gantinya; tidak semua halaman dapat di-scrape |
| `{debug}` menampilkan prompt raw, bukan hasil | Bekerja seperti yang dimaksudkan | Hapus `{debug}` dari awal prompt Anda untuk menjalankan normally |
| Substitusi variabel menghasilkan output tak terduga | Sintaks variabel salah | Nama variabel case-sensitive; periksa ejaan cocok dengan nama bidang persis |

---

## Ekspor & Penerbitan

| Masalah | Kemungkinan penyebab | Perbaikan |
|---|---|---|
| Impor WordPress XML gagal | Ekspor malformed atau masalah importer WordPress | Periksa plugin importer WordPress aktif; coba impor batch lebih kecil |
| Upload WordPress langsung gagal dengan 401 | Application password tidak benar | Regenerasi application password di WordPress Users → Profile |
| Upload WordPress langsung gagal dengan 403 | REST API dinonaktifkan atau diblokir | Periksa WordPress REST API diaktifkan; nonaktifkan plugin keamanan sementara untuk test |
| CSV terbuka dengan karakter garbled | Masalah encoding | Buka dengan encoding UTF-8 di aplikasi spreadsheet Anda |
| Ekspor Hugo kehilangan bidang front matter | Metadata artikel tidak lengkap | Pastikan bidang judul dan tanggal diisi sebelum mengekspor |

---

## Gambar

| Masalah | Kemungkinan penyebab | Perbaikan |
|---|---|---|
| Gambar tidak membuat | Image Gen tidak diaktifkan | Aktifkan toggle **Image Gen** di editor prompt |
| Pembuatan gambar gagal | Kesalahan API penyedia atau kuota terlampaui | Periksa pengaturan penyedia pembuatan gambar di Settings → Export |
| Gambar tidak muncul dalam ekspor WordPress | Gambar disimpan secara lokal, tidak diunggah | Gunakan Direct Upload (bukan XML export) untuk sertakan gambar |

---

## Aplikasi & Akun

| Masalah | Kemungkinan penyebab | Perbaikan |
|---|---|---|
| Aplikasi tidak terbuka di macOS | Blokir keamanan Gatekeeper | Buka **System Settings → Privacy & Security** → klik **Open Anyway** |
| Login gagal dengan "Invalid credentials" | Email/password salah | Gunakan **Forgot password** untuk reset |
| Login gagal dengan "Email not confirmed" | Email tidak diverifikasi | Periksa inbox Anda untuk email verifikasi |
| Saldo token tidak update setelah pembelian | Delay pemrosesan pembayaran | Tunggu 1–2 menit dan refresh; hubungi support jika tidak terselesaikan setelah 10 menit |
| Token langganan menampilkan 0 setelah pembaruan | Siklus belum refresh | Saldo refresh secara lazy pada permintaan pembuatan berikutnya; trigger pembuatan atau tunggu sebentar |
