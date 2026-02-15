export type ArticleStatus = 'draft' | 'published';

export interface WellnessArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  status: ArticleStatus;
  author: string;
  readTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

const now = '2026-02-15T10:00:00.000Z';

export const seededArticles: WellnessArticle[] = [
  {
    id: 'article-001',
    slug: 'napas-90-detik-saat-pikiran-ramai',
    title: 'Napas 90 detik saat pikiran terasa ramai',
    excerpt: 'Ritual singkat untuk menurunkan intensitas emosi sebelum kamu lanjut beraktivitas.',
    body:
      'Saat kepala terasa penuh, tubuh sering ikut menegang. Mulai dari 90 detik napas sadar untuk memberi sinyal aman pada sistem sarafmu.\n\nTarik napas 4 hitungan, tahan 2 hitungan, hembuskan 6 hitungan. Ulangi sampai ritme tubuhmu lebih stabil.\n\nSetelah itu, tulis satu kalimat: "Apa yang paling butuh perhatian saat ini?" Fokus pada satu hal saja.',
    tags: ['Breathing', 'Grounding', 'Overthinking'],
    status: 'published',
    author: 'Tim CurhatIn',
    readTimeMinutes: 3,
    createdAt: now,
    updatedAt: now,
    publishedAt: now
  },
  {
    id: 'article-002',
    slug: 'template-jurnal-5-menit-sebelum-tidur',
    title: 'Template jurnal 5 menit sebelum tidur',
    excerpt: 'Format sederhana agar kamu menutup hari dengan lebih tenang dan terarah.',
    body:
      'Jurnal malam tidak harus panjang. Cukup 5 menit dan tiga pertanyaan inti.\n\n1) Apa yang paling menguras energi hari ini? 2) Apa yang paling menolongku hari ini? 3) Satu hal kecil apa yang akan kulakukan besok pagi?\n\nKuncinya bukan tulisan sempurna, melainkan kebiasaan yang konsisten dan realistis.',
    tags: ['Journaling', 'Sleep Hygiene', 'Routine'],
    status: 'published',
    author: 'Tim CurhatIn',
    readTimeMinutes: 4,
    createdAt: now,
    updatedAt: now,
    publishedAt: now
  },
  {
    id: 'article-003',
    slug: 'self-talk-lebih-lembut-tanpa-memanjakan-diri',
    title: 'Self-talk lebih lembut tanpa memanjakan diri',
    excerpt: 'Cara mengubah nada bicara ke diri sendiri agar tetap jujur tapi tidak menghukum.',
    body:
      'Nada bicara internal memengaruhi cara kamu memulihkan energi. Bahasa yang terlalu keras sering membuatmu makin sulit bergerak.\n\nCoba ubah kalimat "Aku gagal terus" menjadi "Aku belum menemukan ritme yang pas." Maknanya tetap jujur, tapi memberi ruang untuk belajar.\n\nTujuannya bukan menyangkal masalah, melainkan tetap berpihak pada prosesmu sendiri.',
    tags: ['Self Compassion', 'Mindset', 'Emotional Safety'],
    status: 'published',
    author: 'Tim CurhatIn',
    readTimeMinutes: 4,
    createdAt: now,
    updatedAt: now,
    publishedAt: now
  },
  {
    id: 'article-004',
    slug: 'grounding-54321-saat-cemas-meningkat',
    title: 'Grounding 5-4-3-2-1 saat cemas meningkat',
    excerpt: 'Teknik praktis untuk kembali hadir di momen sekarang ketika cemas memuncak.',
    body:
      'Ketika cemas naik, pikiran cenderung melompat ke skenario terburuk. Grounding 5-4-3-2-1 membantu kamu kembali ke realitas saat ini.\n\nSebutkan 5 hal yang kamu lihat, 4 hal yang kamu rasakan, 3 suara yang kamu dengar, 2 aroma yang kamu cium, dan 1 hal yang kamu syukuri.\n\nLakukan perlahan. Tidak perlu sempurna, cukup hadir di momen ini.',
    tags: ['Grounding', 'Anxiety', 'Nervous System'],
    status: 'published',
    author: 'Tim CurhatIn',
    readTimeMinutes: 3,
    createdAt: now,
    updatedAt: now,
    publishedAt: now
  },
  {
    id: 'article-005',
    slug: 'cek-batas-energi-sebelum-bilang-ya',
    title: 'Cek batas energi sebelum bilang "ya"',
    excerpt: 'Kerangka singkat untuk membantu kamu menilai kapasitas sebelum mengambil komitmen baru.',
    body:
      'Tidak semua kesempatan harus diambil sekarang. Menjaga batas energi adalah bagian dari perawatan diri yang sehat.\n\nSebelum bilang "ya", tanya tiga hal: Apakah ini penting? Apakah ini mendesak? Apakah aku punya ruang energi minggu ini?\n\nKalau dua dari tiga jawabannya "tidak", pertimbangkan menunda atau menolak dengan jelas dan sopan.',
    tags: ['Boundary', 'Stress Management', 'Decision Making'],
    status: 'published',
    author: 'Tim CurhatIn',
    readTimeMinutes: 5,
    createdAt: now,
    updatedAt: now,
    publishedAt: now
  },
  {
    id: 'article-006',
    slug: 'draft-panduan-checkin-mingguan',
    title: 'Draft: panduan check-in mingguan',
    excerpt: 'Draft internal untuk format refleksi mingguan yang lebih konsisten.',
    body:
      'Ini adalah draft yang belum dipublikasikan. Konten ini bisa diedit dan dipublish dari halaman admin.\n\nGunakan struktur: sorotan minggu ini, tantangan utama, kebutuhan emosi, dan satu eksperimen minggu depan.',
    tags: ['Draft', 'Check-in'],
    status: 'draft',
    author: 'Admin CurhatIn',
    readTimeMinutes: 3,
    createdAt: now,
    updatedAt: now,
    publishedAt: null
  }
];
