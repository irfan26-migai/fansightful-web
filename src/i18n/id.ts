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
  notFound: {
    title: 'Halaman tidak ditemukan',
    body: 'Halaman yang Anda cari tidak ada atau sudah dipindahkan.',
    toHome: 'Kembali ke beranda',
    toTools: 'Lihat Tools Lab',
  },
} as const;

export type Strings = typeof id;
