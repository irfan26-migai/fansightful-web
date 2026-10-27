// DRAFT — perlu review founder sebelum cutover produksi (P0-05).
// Pernyataan, penjelasan, dan langkah berikutnya di file ini belum divalidasi; hasil tool selalu
// disajikan sebagai pemeriksaan awal berbasis persepsi responden.

export type AreaId = 'A' | 'B' | 'C' | 'D' | 'E';

/** 0 Belum ada · 1 Ada, tapi belum konsisten · 2 Sebagian besar berjalan · 3 Berjalan dan ditinjau rutin */
export type Level = 0 | 1 | 2 | 3;
export type Answer = Level | 'unknown';

export interface Statement {
  id: string;
  area: AreaId;
  text: string;
}

export interface Area {
  id: AreaId;
  title: string;
  /** Mengapa area ini penting — ditampilkan di hasil. */
  why: string;
  /** 1–3 langkah konkret untuk area berstatus "Perlu perhatian" atau "Mulai terbentuk". */
  nextActions: string[];
}
// Artikel terkait tidak ditulis di sini: diambil dari frontmatter `areas` artikel Insights (src/lib/insights.ts).

export const SCALE: { value: Answer; label: string }[] = [
  { value: 0, label: 'Belum ada' },
  { value: 1, label: 'Ada, tapi belum konsisten' },
  { value: 2, label: 'Sebagian besar berjalan' },
  { value: 3, label: 'Berjalan dan ditinjau rutin' },
  { value: 'unknown', label: 'Tidak tahu' },
];

export const AREAS: Area[] = [
  {
    id: 'A',
    title: 'Peran & tanggung jawab',
    why: 'Saat peran kabur, pekerjaan tumpang tindih atau justru tidak dikerjakan, dan keputusan kecil menumpuk di pimpinan.',
    nextActions: [
      'Daftar lima keputusan rutin yang paling sering menunggu Anda, lalu tentukan siapa pemiliknya.',
      'Minta setiap pemegang posisi kunci menulis tiga hasil utama yang menjadi tanggung jawabnya, lalu bandingkan dengan harapan Anda.',
    ],
  },
  {
    id: 'B',
    title: 'Struktur tim',
    why: 'Struktur yang tidak lagi sesuai ukuran bisnis membuat koordinasi lambat dan menciptakan ketergantungan pada orang tertentu.',
    nextActions: [
      'Petakan siapa melapor ke siapa saat ini, lalu tandai atasan dengan jumlah bawahan langsung yang terlalu banyak untuk dibina rutin.',
      'Identifikasi pekerjaan penting yang hanya dikuasai satu orang dan tunjuk cadangannya.',
    ],
  },
  {
    id: 'C',
    title: 'Tujuan & prioritas',
    why: 'Tanpa tujuan yang tertulis dan dipahami bersama, tim bisa sibuk mengerjakan hal yang tidak menggerakkan bisnis.',
    nextActions: [
      'Tulis maksimal tiga tujuan bisnis untuk 6–12 bulan ke depan dalam satu halaman.',
      'Minta setiap pimpinan tim menjelaskan bagaimana pekerjaan timnya berkontribusi pada tujuan tersebut.',
    ],
  },
  {
    id: 'D',
    title: 'Proses kerja',
    why: 'Proses yang tidak terdokumentasi membuat kualitas bergantung pada individu dan masalah yang sama terus berulang.',
    nextActions: [
      'Pilih satu proses inti yang paling sering bermasalah dan tuliskan langkah-langkahnya bersama pelaksananya.',
      'Catat tiga masalah yang paling sering berulang bulan ini dan cari penyebab utamanya, bukan hanya gejalanya.',
    ],
  },
  {
    id: 'E',
    title: 'Praktik kinerja',
    why: 'Bila ukuran keberhasilan dan umpan balik tidak jelas, penilaian kinerja terasa subjektif dan perbaikan terlambat.',
    nextActions: [
      'Pastikan setiap posisi kunci memiliki dua sampai tiga ukuran keberhasilan yang disepakati.',
      'Jadwalkan percakapan umpan balik singkat setiap bulan, terpisah dari penilaian tahunan.',
    ],
  },
];

export const STATEMENTS: Statement[] = [
  { id: 'A1', area: 'A', text: 'Setiap posisi kunci memiliki uraian tanggung jawab yang ditulis dan dipahami pemegangnya.' },
  { id: 'A2', area: 'A', text: 'Jelas siapa yang mengambil keputusan untuk hal-hal rutin.' },
  { id: 'A3', area: 'A', text: 'Ketika ada pekerjaan baru, cepat diketahui siapa yang bertanggung jawab.' },
  { id: 'A4', area: 'A', text: 'Tanggung jawab antar-posisi jarang tumpang tindih atau saling lempar.' },

  { id: 'B1', area: 'B', text: 'Jumlah orang yang melapor ke satu atasan masih memungkinkan pembinaan rutin.' },
  { id: 'B2', area: 'B', text: 'Tidak ada pekerjaan penting yang hanya bergantung pada satu orang.' },
  { id: 'B3', area: 'B', text: 'Struktur tim ditinjau ketika bisnis bertumbuh atau berubah arah.' },
  { id: 'B4', area: 'B', text: 'Koordinasi antar-tim berjalan tanpa harus selalu melalui pimpinan puncak.' },

  { id: 'C1', area: 'C', text: 'Tujuan bisnis 6–12 bulan ke depan tertulis dan diketahui para pimpinan tim.' },
  { id: 'C2', area: 'C', text: 'Setiap tim tahu bagaimana pekerjaannya berkontribusi pada tujuan tersebut.' },
  { id: 'C3', area: 'C', text: 'Prioritas dibahas ulang secara berkala dan perubahan dikomunikasikan.' },
  { id: 'C4', area: 'C', text: 'Ketika prioritas bertabrakan, ada cara yang disepakati untuk memutuskannya.' },

  { id: 'D1', area: 'D', text: 'Proses inti (mis. penjualan, layanan, operasional) terdokumentasi.' },
  { id: 'D2', area: 'D', text: 'Masalah yang berulang dibahas dan diperbaiki penyebabnya.' },
  { id: 'D3', area: 'D', text: 'Karyawan baru dapat mempelajari cara kerja tanpa sepenuhnya bergantung pada satu orang.' },
  { id: 'D4', area: 'D', text: 'Serah terima pekerjaan antar-tim jarang menimbulkan kesalahan atau keterlambatan.' },

  { id: 'E1', area: 'E', text: 'Setiap orang tahu ukuran keberhasilan pekerjaannya.' },
  { id: 'E2', area: 'E', text: 'Ada percakapan umpan balik kinerja secara rutin, bukan hanya akhir tahun.' },
  { id: 'E3', area: 'E', text: 'Penilaian kinerja didasarkan pada hasil dan perilaku yang disepakati sebelumnya.' },
  { id: 'E4', area: 'E', text: 'Kinerja yang kurang ditindaklanjuti dengan rencana perbaikan yang jelas.' },
];
