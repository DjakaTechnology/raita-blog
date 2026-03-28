---
title: "Meninjau Artikel"
description: "Tinjau, edit, kelola, dan ekspor artikel yang dibuat Anda."
order: 5
draft: false
---


## Melihat & Mengedit Hasil

Klik tombol **View** di baris mana pun dalam tabel artikel untuk membuka artikel. Ini membuka editor HTML yang dirender di mana Anda dapat membaca dan mengedit konten yang dibuat secara langsung.

Editor mendukung teks kaya — gunakan toolbar untuk menyesuaikan heading, format, daftar, dan link. Anda juga dapat mengedit deskripsi **Meta**. Klik **Save** untuk menyimpan perubahan Anda.

![Editor artikel dengan toolbar teks kaya dan gambar yang dibuat](../images/article-editor.png)

---

## Aksi Baris

Setiap baris worker memiliki tombol aksi inline di sisi kanan:

![Tabel artikel dengan aksi baris](../images/row-actions.png)

| Tombol | Aksi |
|---|---|
| **View** | Buka artikel dalam editor |
| **Retry** | Jalankan ulang worker untuk membuat ulang artikel |
| **Copy** | Salin HTML artikel ke papan klip Anda |
| **Export** | Ekspor artikel individual |
| **Delete** | Hapus worker dan hasilnya secara permanen |

---

## Aksi Massal

Klik tombol menu **⋮** (kanan atas tabel artikel) untuk mengakses aksi massal:

![Menu aksi massal](../images/bulk-actions.png)

- **Bulk Export** — ekspor semua artikel (WordPress XML, HTML, CSV, dll.)
- **Bulk Upload** — unggah semua artikel ke situs WordPress yang terhubung
- **Bulk Export Image** — ekspor semua gambar yang dibuat
- **Generate Images** — buat gambar untuk artikel yang tidak memilikinya
- **Bulk Restart** — jalankan ulang semua worker
- **Bulk Restart Error** — jalankan ulang hanya worker yang gagal
- **Bulk Import** — impor topik dari file CSV/XLSX
- **Bulk Delete** — hapus semua worker

---

## Filter & Pencarian

Gunakan **search bar** untuk mencari artikel berdasarkan kata kunci. Klik **ikon filter** di samping search bar untuk membuka panel filter:

![Panel filter](../images/filter-panel.png)

- **Status** — filter berdasarkan status (All, Success, Failed, Running, Pending)
- **Minimum / Maximum Words** — filter berdasarkan rentang jumlah kata
- **Date Range** — filter berdasarkan tanggal pembuatan

Klik **Apply** untuk menerapkan filter, atau **Reset** untuk menghapusnya.
