// Data situs yang menunggu keputusan pemilik proyek. Selama bernilai null, halaman menampilkan
// <Pending>, dan `npm run check:launch` gagal — cutover produksi tidak boleh dilakukan.

/** Q-09: alamat email penerima pesan kontak. */
export const CONTACT_EMAIL: string | null = null;

/** Profil founder/kurator untuk /tentang dan homepage. */
export const FOUNDER: { name: string; role: string; bio: string } | null = null;
