---
title: "Dompet Token & Penagihan"
description: "Pahami token Raita, langganan, dan penagihan."
order: 7
draft: false
---


---

## Apa Itu Token Raita?

Token Raita adalah kredit yang digunakan untuk pembuatan artikel saat **AI Source** diatur ke **Raita Managed**.

Setiap pembuatan artikel mengkonsumsi token. Jumlahnya bergantung pada:
- Model yang dipilih
- Mode pembuatan (Simple menggunakan lebih sedikit panggilan; Blaze/Compose menggunakan lebih banyak)
- Apakah pencarian web atau pembuatan gambar diaktifkan

Token TIDAK dikonsumsi saat menggunakan BYOK (Bring Your Own Key) — dalam mode BYOK, biaya ditagih langsung ke akun penyedia Anda.

---

## Jenis Saldo Token

Dompet Anda menampung tiga jenis saldo:

| Tipe | Deskripsi | Kedaluwarsa? |
|---|---|---|
| **Subscription tokens** | Dialokasikan bulanan dengan langganan aktif | Ya — reset setiap siklus penagihan (setiap 30 hari) |
| **Purchased tokens** | Dibeli secara terpisah sebagai paket top-up | Tidak |
| **Trial tokens** | Diberikan saat registrasi | Ya |

Token dikonsumsi dalam urutan prioritas ini: **subscription → trial → purchased**.

---

## Melihat Saldo Anda

Saldo token Anda ditampilkan di **badge sidebar** (bawah-kiri). Badge menampilkan total gabungan dari ketiga jenis saldo. Klik **Buy** untuk membuka modal pembelian.

Di modal dompet Anda dapat melihat:
- Breakdown saldo saat ini (subscription / purchased / trial)
- Riwayat penggunaan token
- Riwayat transaksi

---

## Mengisi Ulang

Tiga paket top-up tersedia:

| Paket | Token | Harga (IDR) | Per Token |
|---|---|---|---|
| **Starter** | 50 | Rp 100.000 | Rp 2.000/token |
| **Growth** | 200 | Rp 340.000 | Rp 1.700/token — 15% off |
| **Agency** | 500 | Rp 800.000 | Rp 1.600/token — 20% off |

**Untuk mengisi ulang:**
1. Klik badge saldo token di sidebar
2. Klik **Buy**
3. Pilih paket token
4. Selesaikan pembayaran melalui Midtrans (IDR)

Token yang dibeli ditambahkan ke dompet Anda segera setelah konfirmasi pembayaran.

---

## Langganan

Langganan memberi Anda:
- Alokasi token bulanan (reset setiap siklus penagihan, setiap 30 hari)
- Akses ke fitur Raita

Token langganan kedaluwarsa saat periode langganan berakhir. Jika langganan Anda lapses, saldo langganan secara otomatis dinolkan.

Untuk mengelola langganan Anda, buka **Settings → License**.

---

## Program Afiliasi

Raita memiliki program afiliasi:
- **Komisi**: 12,5% dari harga pembelian yang dirujuk
- **Pembayaran**: Dibayar 1 minggu setelah pembelian berhasil oleh pengguna yang dirujuk
- Akses link afiliasi Anda melalui **Settings → Affiliate** atau halaman Affiliate

---

## Catatan

- Saldo token adalah per-akun, bukan per-perangkat
- Urutan pengurangan adalah: token langganan terlebih dahulu, kemudian token trial, kemudian token yang dibeli
- Pembuatan artikel yang gagal atau error mungkin atau mungkin tidak mengkonsumsi token tergantung di mana dalam pipeline kegagalan terjadi
- Hubungi support jika Anda percaya token ditagih secara tidak benar
