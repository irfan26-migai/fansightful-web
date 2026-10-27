// Data situs dari pemilik proyek (docs/fansightful/05_DATA_INPUT.md). Bila suatu nilai null, halaman
// menampilkan <Pending>, dan `npm run check:launch` gagal — cutover produksi tidak boleh dilakukan.

/** Q-09: alamat email penerima pesan kontak (tampil publik). */
export const CONTACT_EMAIL: string | null = 'irfan@mierakigai.com';

/** Profil founder/kurator untuk homepage dan /tentang. */
export const FOUNDER: {
  name: string;
  role: string;
  /** Pekerjaan di luar Fansightful — ditampilkan demi transparansi (SF-03). */
  affiliation: string;
  shortBio: string;
  longBio: string;
} | null = {
  name: 'Irfan Taufik Risda',
  role: 'Founder & kurator',
  affiliation: 'Human Capital Manager di Mierakigai',
  shortBio:
    'Sehari-hari merancang peran, batas kewenangan, dan sistem KPI yang terhubung ke strategi bisnis — hal-hal yang menentukan apakah tim bisa bergerak tanpa menunggu satu orang.',
  longBio:
    'Irfan Taufik Risda adalah Human Capital Manager di Mierakigai. Pekerjaannya berpusat pada sistem yang membuat tim berjalan: merumuskan role charter dan batas kewenangan, memastikan KPI terhubung ke strategi dan dapat diukur secara andal, serta menyusun kebutuhan sistem HR. Ia juga membangun cara kerja Human Capital berbantuan AI yang terdokumentasi dan dievaluasi. Fansightful berangkat dari pengamatan bahwa banyak masalah bisnis sebenarnya adalah masalah sistem — dan founder serta manajer perlu alat untuk melihat masalah itu dengan jelas sebelum mengambil keputusan.',
};
