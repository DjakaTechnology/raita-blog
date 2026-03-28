---
title: "Feed Monitor"
description: "Pantau feed RSS/Atom dan buat Article Workers secara otomatis dari konten baru."
order: 1
draft: false
---


Feed Monitor secara otomatis memantau feed RSS dan Atom untuk artikel baru, menyaringnya berdasarkan relevansi, dan mengonversi item yang disetujui menjadi Article Workers untuk pembuatan. Ini memungkinkan penemuan konten tanpa tangan dan pemrosesan massal dari beberapa sumber.

## Menyiapkan Sumber Feed

Sumber feed dibuat dan dikelola di tingkat proyek. Untuk menambahkan sumber feed baru:

1. Navigasikan ke dashboard proyek Anda dan temukan antarmuka manajemen sumber feed
2. Masukkan URL feed RSS atau Atom dan pilih jenis feed
3. Atur interval polling (seberapa sering Raita memeriksa item baru)
4. Secara opsional aktifkan filter AI dengan kriteria (contoh: "Only articles about real estate")
5. **Policy** (opsional): atur ke **Auto Draft** untuk secara otomatis membuat worker tanpa tinjauan inbox, atau **Auto Publish** untuk membuat worker dan publikasikan segera. Biarkan kosong untuk memerlukan persetujuan manual dari inbox.
6. Simpan sumber

![Pengaturan sumber feed dengan RSS/Sitemap dipilih](../images/feed-monitor-form.png)

Anda juga dapat memilih sumber yang ada dan mengonfigurasinya lebih lanjut — atur filter AI agar sesuai dengan niche Anda (contoh: "only work on politics"), pilih batas harian, dan pilih template prompt pembuatan.

![Sumber feed dengan filter AI yang dikonfigurasi](../images/feed-monitor-ai-filter-setup.png)

### Melampirkan Template Prompt

Setiap sumber feed dapat memiliki template pembuatan artikel opsional yang dilampirkan. Ketika item feed disetujui dan dikonversi ke Article Worker:

1. Prompt template dimuat
2. Judul, URL, dan kutipan artikel feed secara otomatis diinjeksi ke dalam konteks prompt
3. Worker menggunakan prompt yang diperkaya ini untuk pembuatan

Ini berarti item feed Anda memberikan konteks konten langsung untuk artikel yang dibuat, menghindari hasil generik atau tidak sesuai topik.

## Feed Inbox

Feed Inbox menampilkan item feed masuk yang menunggu aksi Anda. Setiap item menampilkan:

- **Title and excerpt** dari entri feed
- **Publication date** dan sumber feed
- **Status indicators** (baru, tertunda, dll.)

### Menyetujui dan Melewatkan Item

Untuk setiap item inbox, Anda dapat:

- **Approve** → Membuat Article Worker dan segera mulai pembuatan menggunakan template prompt sumber feed
- **Skip** → Menolak item; ini pindah ke tab Skipped

### Tab AI Filtered

Tab **AI Filtered** menampilkan item feed yang tidak cocok dengan kriteria filter AI Anda. Ketika Anda mengonfigurasi filter AI pada sumber feed (contoh: "Only articles about housing market"), item yang tidak cocok secara otomatis dirute ke sini alih-alih inbox utama. Anda dapat meninjau item-item ini dan baik membuat worker secara massal dari mereka (untuk mengatasi filter) atau menghapusnya sepenuhnya.

Anda juga dapat membatalkan penolakan atau mengatasi item yang sebelumnya dilewati dengan mengklik "Generate" dari tab Skipped atau AI Filtered.

![Feed inbox dengan aksi Generate dan Skip](../images/feed-monitor-inbox.png)

![Bagian AI Filtered menampilkan artikel feed yang disaring dengan alasan](../images/feed-monitor-ai-filtered.png)

## Otomasi

Ketika sumber feed memiliki kebijakan **AUTO_DRAFT** atau **AUTO_PUBLISH** diaktifkan:

- Item yang disetujui secara otomatis membuat Article Workers tanpa memerlukan aksi manual
- Worker AUTO_DRAFT antri untuk pembuatan dan tetap sebagai draft
- Worker AUTO_PUBLISH antri untuk pembuatan dan otomatis diterbitkan ke situs target Anda (WordPress, Blogger, dll.) saat selesai

Dalam kedua kasus, worker yang dibuat menggunakan template prompt sumber feed dengan konteks artikel feed diinjeksi, memastikan output yang konsisten dan relevan secara kontekstual.

Item feed didedulikasi terhadap artikel situs yang ada dan topik worker sebelum diproses, mencegah pekerjaan duplikat.
