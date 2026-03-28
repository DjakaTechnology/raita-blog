---
title: "Randomisasi"
description: "Tambahkan variasi ke output Anda dengan randomisasi prompt menggunakan sintaks pipe."
order: 4
draft: false
---


Anda dapat menentukan beberapa alternatif prompt di satu bidang menggunakan karakter `|` (pipe). Raita memilih satu cabang secara acak saat pengiriman.

---

## Sintaks

Pisahkan alternatif dengan ` | ` (space-pipe-space):

```
Write a formal, authoritative article about {topic} | Write a friendly, conversational article about {topic}
```

Saat Anda submit worker, Raita secara acak memilih salah satu dari alternatif ini dan menyimpannya sebagai prompt aktual worker. Randomisasi terjadi **sekali saat pengiriman** — cabang yang dipilih ditetapkan untuk worker itu.

![Editor prompt](../images/prompt-editor-variables.png)

---

## Bidang Mana yang Mendukung Randomisasi

Semua bidang teks prompt mendukung randomisasi `|`:

| Mode | Bidang yang di-randomisasi |
|---|---|
| Simple | Prompt utama |
| Blaze | Judul, LSI/outline, Detail, Meta, Opening, Closing |
| Compose | Judul, Meta, setiap bagian konten |

---

## Catatan Perilaku

- Randomisasi adalah **sekali saat pengiriman** — mencoba ulang worker yang gagal tidak re-randomisasi
- Tidak ada escaping untuk `|` — karakter pipe literal dalam prompt Anda akan diperlakukan sebagai pemisah
- Nesting tidak didukung — `A | B | C` memberi tiga alternatif: A, B, atau C
- Spasi leading/trailing di sekitar setiap alternatif dipangkas

---

## Use Cases

**A/B testing prompts:**
```
Write this article in a listicle format | Write this article as a long-form essay
```

**Tone variation:**
```
Use a professional, formal tone | Use a casual, conversational tone | Use a humorous tone
```

**Length variation:**
```
Write a 500-word overview of {topic} | Write a 1500-word deep-dive on {topic}
```
