# 05 — Formulir Data Tertunda

> **Status 27 Okt 2026:** sudah diterapkan. Nama, peran, dan email dari pengguna; bio, entitas, privasi, review instrumen, dan 3 artikel ditentukan Claude atas delegasi pengguna — lihat `03_DECISION_LOG.md` D-IMP-17 s.d. D-IMP-21. Tabel di bawah dipertahankan sebagai acuan bila ingin mengubah sesuatu.

Isi bagian yang relevan langsung di file ini (atau tempel jawabannya di chat). Bagian yang dibiarkan kosong tetap menjadi kotak "Menunggu data" dan menahan cutover produksi (`npm run check:launch`).

> File ini ada di `docs/` dan tidak ikut ter-deploy. Hapus data pribadi yang tidak ingin disimpan di repository setelah diterapkan.

---

## 1. Profil founder / kurator
Ditampilkan di homepage ("Dikurasi oleh") dan `/tentang`.

| Field | Isian |
|---|---|
| Nama yang ditampilkan | |
| Peran di Fansightful (mis. "Founder & kurator") | |
| Bio singkat untuk homepage (1–2 kalimat, fokus keahlian yang relevan) | |
| Bio untuk `/tentang` (1 paragraf: latar belakang, pengalaman, mengapa membangun Fansightful) | |
| Foto (opsional — letakkan file di `public/` dan tulis nama filenya) | |
| Tautan profil profesional (opsional, mis. LinkedIn) | |

## 2. Kontak (Q-09)
| Field | Isian |
|---|---|
| Alamat email penerima pesan — **akan tampil publik** di `/kontak` | |

## 3. Entitas dan layanan (Q-02, Q-07)

| Pertanyaan | Isian |
|---|---|
| Siapa pengelola Fansightful? (perorangan / nama badan usaha) | |
| Apa hubungan Fansightful dengan Mierakigai (atau entitas lain)? Bagaimana menuliskannya untuk publik? | |
| Apakah akun Cloudflare dan Git sebaiknya dipindah ke akun milik brand Fansightful? (ya / nanti / tidak) | |

**Layanan yang benar-benar bisa diberikan saat ini** (kosongkan bila `/solusi` cukup berisi "Hubungi kami" dulu):

| Layanan | Diberikan oleh (entitas) | Untuk siapa | Hasil yang diterima klien | Cara memulai | Harga (opsional) |
|---|---|---|---|---|---|
| | | | | | |

## 4. Kebijakan privasi
| Pertanyaan | Isian |
|---|---|
| Pengendali data (entitas yang bertanggung jawab) | |
| Berapa lama email/pesan kontak disimpan? | |
| Tanggal berlaku kebijakan | |
| Siapa yang meninjau draf terhadap UU No. 27/2022 (PDP)? Saya tidak dapat memberikan nasihat hukum. | |

## 5. Review instrumen Health Check (P0-05)

Tandai **OK**, atau tulis versi pengganti di kolom "Ubah menjadi". Sumber: `src/tools/health-check/instrument.ts`.

### 5a. Pernyataan

| ID | Pernyataan saat ini | OK / Ubah menjadi |
|---|---|---|
| A1 | Setiap posisi kunci memiliki uraian tanggung jawab yang ditulis dan dipahami pemegangnya. | |
| A2 | Jelas siapa yang mengambil keputusan untuk hal-hal rutin. | |
| A3 | Ketika ada pekerjaan baru, cepat diketahui siapa yang bertanggung jawab. | |
| A4 | Tanggung jawab antar-posisi jarang tumpang tindih atau saling lempar. | |
| B1 | Jumlah orang yang melapor ke satu atasan masih memungkinkan pembinaan rutin. | |
| B2 | Tidak ada pekerjaan penting yang hanya bergantung pada satu orang. | |
| B3 | Struktur tim ditinjau ketika bisnis bertumbuh atau berubah arah. | |
| B4 | Koordinasi antar-tim berjalan tanpa harus selalu melalui pimpinan puncak. | |
| C1 | Tujuan bisnis 6–12 bulan ke depan tertulis dan diketahui para pimpinan tim. | |
| C2 | Setiap tim tahu bagaimana pekerjaannya berkontribusi pada tujuan tersebut. | |
| C3 | Prioritas dibahas ulang secara berkala dan perubahan dikomunikasikan. | |
| C4 | Ketika prioritas bertabrakan, ada cara yang disepakati untuk memutuskannya. | |
| D1 | Proses inti (mis. penjualan, layanan, operasional) terdokumentasi. | |
| D2 | Masalah yang berulang dibahas dan diperbaiki penyebabnya. | |
| D3 | Karyawan baru dapat mempelajari cara kerja tanpa sepenuhnya bergantung pada satu orang. | |
| D4 | Serah terima pekerjaan antar-tim jarang menimbulkan kesalahan atau keterlambatan. | |
| E1 | Setiap orang tahu ukuran keberhasilan pekerjaannya. | |
| E2 | Ada percakapan umpan balik kinerja secara rutin, bukan hanya akhir tahun. | |
| E3 | Penilaian kinerja didasarkan pada hasil dan perilaku yang disepakati sebelumnya. | |
| E4 | Kinerja yang kurang ditindaklanjuti dengan rencana perbaikan yang jelas. | |

### 5b. Penjelasan dan langkah berikutnya per area

| Area | "Mengapa ini penting" saat ini | Langkah berikutnya saat ini | OK / Ubah menjadi |
|---|---|---|---|
| A. Peran & tanggung jawab | Saat peran kabur, pekerjaan tumpang tindih atau justru tidak dikerjakan, dan keputusan kecil menumpuk di pimpinan. | (1) Daftar lima keputusan rutin yang paling sering menunggu Anda, lalu tentukan siapa pemiliknya. (2) Minta setiap pemegang posisi kunci menulis tiga hasil utama yang menjadi tanggung jawabnya, lalu bandingkan dengan harapan Anda. | |
| B. Struktur tim | Struktur yang tidak lagi sesuai ukuran bisnis membuat koordinasi lambat dan menciptakan ketergantungan pada orang tertentu. | (1) Petakan siapa melapor ke siapa saat ini, lalu tandai atasan dengan jumlah bawahan langsung yang terlalu banyak untuk dibina rutin. (2) Identifikasi pekerjaan penting yang hanya dikuasai satu orang dan tunjuk cadangannya. | |
| C. Tujuan & prioritas | Tanpa tujuan yang tertulis dan dipahami bersama, tim bisa sibuk mengerjakan hal yang tidak menggerakkan bisnis. | (1) Tulis maksimal tiga tujuan bisnis untuk 6–12 bulan ke depan dalam satu halaman. (2) Minta setiap pimpinan tim menjelaskan bagaimana pekerjaan timnya berkontribusi pada tujuan tersebut. | |
| D. Proses kerja | Proses yang tidak terdokumentasi membuat kualitas bergantung pada individu dan masalah yang sama terus berulang. | (1) Pilih satu proses inti yang paling sering bermasalah dan tuliskan langkah-langkahnya bersama pelaksananya. (2) Catat tiga masalah yang paling sering berulang bulan ini dan cari penyebab utamanya, bukan hanya gejalanya. | |
| E. Praktik kinerja | Bila ukuran keberhasilan dan umpan balik tidak jelas, penilaian kinerja terasa subjektif dan perbaikan terlambat. | (1) Pastikan setiap posisi kunci memiliki dua sampai tiga ukuran keberhasilan yang disepakati. (2) Jadwalkan percakapan umpan balik singkat setiap bulan, terpisah dari penilaian tahunan. | |

### 5c. Aturan status (per area, 4 pernyataan)

| Aturan saat ini | OK / Ubah menjadi |
|---|---|
| ≥2 jawaban "Tidak tahu" → **Belum cukup informasi** (diperiksa lebih dulu) | |
| ≥2 jawaban "Belum ada" / "Ada, tapi belum konsisten" → **Perlu perhatian** | |
| Tepat 1 jawaban rendah → **Mulai terbentuk** | |
| Selainnya → **Relatif terbentuk** — termasuk bila 1 jawaban "Tidak tahu" dan sisanya ≥ "Sebagian besar berjalan" (D-IMP-05) | |
| Area "Perlu perhatian" diurutkan: jumlah "Belum ada" terbanyak dulu, seri → A sampai E | |

## 6. Konten (opsional sekarang)
| Pertanyaan | Isian |
|---|---|
| Nama penulis untuk artikel Insights | |
| Draf `keputusan-menunggu-founder.md`: terbitkan setelah diedit / tulis ulang / hapus? | |
| Siapa yang menulis 2–3 artikel berikutnya? (Q-06) | |
