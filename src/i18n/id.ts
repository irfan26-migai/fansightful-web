// String UI locale Indonesia. Locale lain dapat ditambahkan sebagai file sejajar dengan bentuk yang sama.
export const id = {
  site: {
    name: 'Fansightful',
    description:
      'Tools interaktif, wawasan praktis, dan solusi yang relevan untuk membantu founder, business builder, dan manajer di Indonesia memahami masalah bisnis dan menentukan langkah berikutnya.',
    tagline: 'Every insight should help you move forward.',
  },
  a11y: {
    skipToContent: 'Langsung ke konten utama',
    mainNav: 'Navigasi utama',
    footerNav: 'Navigasi footer',
    home: 'Fansightful — beranda',
  },
  nav: {
    toolsLab: 'Tools Lab',
    insights: 'Insights',
    solusi: 'Solusi',
    tentang: 'Tentang',
    kontak: 'Hubungi',
    privasi: 'Privasi',
  },
  footer: {
    note: 'Fansightful adalah platform independen. Hasil tools bersifat pemeriksaan awal dan bukan pengganti nasihat profesional.',
  },
  toolsLab: {
    title: 'Tools Lab',
    description:
      'Tools interaktif untuk memeriksa kondisi bisnis dan tim Anda, lalu menentukan langkah berikutnya.',
    intro: 'Tools interaktif untuk memahami kondisi bisnis dan tim Anda — lalu menentukan langkah berikutnya.',
    open: 'Buka tool',
  },
  healthCheck: {
    title: 'Business & People Health Check',
    description:
      'Pemeriksaan awal gratis untuk melihat area mana dalam peran, struktur tim, tujuan, proses, dan praktik kinerja yang perlu diperhatikan lebih dulu.',
    summary: 'Pemeriksaan awal 5 area sistem bisnis dan tim — sekitar 10 menit, tanpa daftar akun.',
    facts: ['Sekitar 10 menit', '20 pernyataan di 5 area', 'Tanpa akun, jawaban tidak dikirim ke server'],
    whatTitle: 'Apa yang diperiksa',
    whoTitle: 'Untuk siapa',
    who: 'Founder, pemilik bisnis, dan pimpinan unit yang ingin tahu bagian mana dari sistem tim yang perlu dibenahi lebih dulu.',
    limitsTitle: 'Yang perlu Anda ketahui',
    limits: [
      'Hasilnya adalah pemeriksaan awal berdasarkan persepsi Anda, bukan penilaian definitif.',
      'Pernyataan disusun dari praktik umum dan belum divalidasi secara statistik.',
      'Jawaban Anda diproses di browser ini saja dan tidak disimpan. Bila halaman dimuat ulang, pemeriksaan dimulai dari awal.',
    ],
    start: 'Mulai pemeriksaan',
    noscript: 'JavaScript diperlukan untuk melihat hasil pemeriksaan. Anda tetap dapat membaca seluruh pernyataan di bawah ini.',
    instruction: 'Pilih jawaban yang paling menggambarkan kondisi saat ini, bukan kondisi yang diharapkan.',
    stepLabel: (n: number, total: number) => `Area ${n} dari ${total}`,
    back: 'Kembali',
    next: 'Lanjut',
    seeResults: 'Lihat hasil',
    errorStep: (n: number) =>
      n === 1 ? 'Masih ada 1 pernyataan yang belum dijawab.' : `Masih ada ${n} pernyataan yang belum dijawab.`,
    errorField: 'Pilih salah satu jawaban, termasuk "Tidak tahu" bila Anda tidak yakin.',
    resultsTitle: 'Hasil pemeriksaan awal',
    summaryFlagged: (n: number, names: string) => `Dari 5 area, ${n} perlu perhatian: ${names}.`,
    summaryNone: 'Tidak ada area yang ditandai perlu perhatian. Fokuskan energi untuk menjaga praktik yang sudah berjalan.',
    summaryInsufficient: (names: string) => `Informasi belum cukup untuk menilai: ${names}.`,
    status: {
      needs_attention: 'Perlu perhatian',
      forming: 'Mulai terbentuk',
      insufficient_info: 'Belum cukup informasi',
      established: 'Relatif terbentuk',
    },
    whyTitle: 'Mengapa ini penting',
    triggersTitle: 'Yang memicu status ini',
    nextTitle: 'Langkah berikutnya',
    insufficientNext:
      'Banyak hal di area ini belum terlihat jelas oleh Anda. Tanyakan kepada pimpinan tim terkait, lalu ulangi pemeriksaan untuk area ini.',
    establishedNext: 'Pertahankan praktik ini dan tinjau kembali saat bisnis bertumbuh atau berubah arah.',
    howToReadTitle: 'Cara membaca hasil ini',
    howToRead: [
      'Status ditentukan per area dengan aturan sederhana: "Perlu perhatian" bila 2 atau lebih pernyataan dijawab "Belum ada" atau "Ada, tapi belum konsisten"; "Mulai terbentuk" bila hanya 1; "Belum cukup informasi" bila 2 atau lebih dijawab "Tidak tahu".',
      'Tidak ada skor total atau peringkat. Ambang di atas adalah aturan kerja, bukan standar yang tervalidasi.',
      'Hasil mencerminkan pandangan satu orang. Anggota tim lain mungkin melihat kondisi yang berbeda.',
      'Ini bukan pengganti asesmen organisasi menyeluruh atau nasihat profesional.',
    ],
    print: 'Cetak atau simpan sebagai PDF',
    restart: 'Ulangi pemeriksaan',
    helpTitle: 'Butuh bantuan menerapkan langkah ini?',
    helpBody: 'Jika Anda ingin dibantu memetakan langkah perbaikan, lihat opsi bantuan yang tersedia.',
    helpCta: 'Lihat opsi bantuan',
    helpQuiet: 'Butuh pendapat kedua? Lihat opsi bantuan.',
  },
  notFound: {
    title: 'Halaman tidak ditemukan',
    body: 'Halaman yang Anda cari tidak ada atau sudah dipindahkan.',
    toHome: 'Kembali ke beranda',
    toTools: 'Lihat Tools Lab',
  },
} as const;

export type Strings = typeof id;
