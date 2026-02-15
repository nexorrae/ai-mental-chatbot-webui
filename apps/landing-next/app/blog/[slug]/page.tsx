import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/content';
import { Badge, GroundingCard, OutlinedCard } from '@/components/ui';

const postBodies: Record<string, string[]> = {
  'ketika-overthinking-muncul': [
    'Saat overthinking datang, tubuh biasanya ikut tegang. Mulai dari satu napas panjang untuk memberi sinyal aman ke sistem sarafmu.',
    'Kamu tidak harus menuntaskan semua pikiran dalam satu waktu. Cukup tulis satu hal yang paling mengganggu saat ini, lalu beri label sederhana: bisa dikendalikan atau tidak.',
    'Kalau intensitas emosi naik, gunakan grounding 5-4-3-2-1 sebelum melanjutkan percakapan atau pekerjaan.'
  ],
  'ritual-jurnal-5-menit': [
    'Gunakan struktur tiga baris: apa yang terjadi, apa yang kamu rasakan, apa satu langkah kecil berikutnya.',
    'Kuncinya bukan panjang tulisan, tapi konsistensi yang realistis.'
  ],
  'cara-bicara-ke-diri-sendiri': [
    'Perhatikan kalimat otomatis di kepala. Ganti kata-kata yang menghukum dengan kalimat yang tetap jujur namun lebih lembut.',
    'Contoh: dari "aku gagal" menjadi "aku sedang belajar ritme yang lebih cocok".'
  ]
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) notFound();

  const paragraphs = postBodies[slug] ?? postBodies['ketika-overthinking-muncul'];

  return (
    <article className="section-wrap py-14 md:py-20">
      <OutlinedCard className="mx-auto max-w-3xl space-y-6">
        <Badge tone="accent">Artikel refleksi</Badge>
        <header className="space-y-2">
          <h1 className="text-h2 font-extrabold tracking-tight">{post.title}</h1>
          <p className="text-caption text-muted">{post.date}</p>
        </header>

        <div className="space-y-4">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-body text-ink-soft">
              {paragraph}
            </p>
          ))}
        </div>

        <GroundingCard />
      </OutlinedCard>
    </article>
  );
}
