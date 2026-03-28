---
title: "Import & Export Template"
description: "Bagikan dan gunakan kembali template prompt di seluruh proyek dan instalasi."
order: 3
draft: false
---


Raita dapat menyimpan konfigurasi prompt Anda ke file teks biasa dan memmuatnya kembali nanti. Gunakan ini untuk:
- Bagikan template prompt dengan rekan tim
- Version-control prompt Anda di git
- Gunakan kembali setup prompt yang terbukti di beberapa proyek

![Pemilih template dengan Input Prompt dan Save Prompt to Template](../images/template-import-export.png)

---

## Mengekspor Template

1. Konfigurasikan prompt Anda dalam formulir New Task (tab Simple, Blaze, atau Compose)
2. Klik **Export Template**
3. Simpan file `.txt`

---

## Format File Template

Template adalah file teks biasa dengan marker bagian. Berikut adalah contoh mode Simple:

````
====== SIMPLE

|====== SIMPLE.PROMPT
Write a comprehensive article about {topic} for a {niche} audience.
Use HTML formatting. Language: {language}.

|====== SIMPLE.TEMPERATURE
0.7

|====== SIMPLE.MODEL
gpt-4o

|====== SIMPLE.WEBSEARCH
false

|====== SIMPLE.IMAGEGEN
false

|====== AUTO_INTERNAL_LINK
false
````

Template mode Blaze menggunakan `====== BLAZE` di bagian atas, dengan marker seperti `|====== TITLE.PROMPT`, `|====== SECTION.PROMPT`, `|====== DETAIL.PROMPT`, dll.

Template mode Compose menggunakan `====== COMPOSE` dengan `|====== META.PROMPT`, `|====== CONTENT_1.PROMPT`, `|====== CONTENT_2.PROMPT`, dll.

---

## Mengedit Template

Buka file yang diekspor di editor teks apa pun. Edit teks prompt antara marker. Simpan file.

Aturan:
- Jangan ubah baris marker (baris mulai dengan `|======` atau `======`)
- Temperature harus berupa angka desimal (contoh: `0.7`)
- Model harus berupa string ID model yang valid
- WEBSEARCH dan IMAGEGEN harus `true` atau `false`

---

## Mengimpor Template

1. Buka formulir New Task
2. Klik **Import Template**
3. Pilih file `.txt` Anda
4. Bidang formulir akan terisi dengan nilai template
5. Sesuaikan bidang apa pun sesuai kebutuhan, kemudian submit
