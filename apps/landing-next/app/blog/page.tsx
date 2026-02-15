import Link from 'next/link';
import { HeroBlock } from '@/components/page-primitives';
import { Badge, OutlinedCard } from '@/components/ui';
import { getPublishedArticles } from '@/lib/articles';

export const dynamic = 'force-dynamic';

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
});

export default async function BlogPage() {
  const articles = await getPublishedArticles();

  return (
    <HeroBlock
      badge="Blog"
      title="Artikel refleksi dan wellness"
      description="Konten mental wellness yang praktis, non-judgmental, dan bisa kamu jalankan pelan-pelan."
    >
      {articles.length === 0 ? (
        <OutlinedCard className="space-y-3 text-center">
          <h3 className="text-h6 font-bold">Belum ada artikel terpublikasi</h3>
          <p className="text-body text-ink-soft">
            Tambahkan artikel dari admin page untuk menampilkan konten di sini.
          </p>
        </OutlinedCard>
      ) : (
        <div className="three-col-grid">
          {articles.map((article) => (
            <OutlinedCard key={article.slug} className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="accent">{article.readTimeMinutes} menit baca</Badge>
                <p className="text-caption font-semibold text-muted">
                  {dateFormatter.format(new Date(article.publishedAt ?? article.updatedAt))}
                </p>
              </div>

              <h3 className="text-h6 font-bold">{article.title}</h3>
              <p className="text-body text-ink-soft">{article.excerpt}</p>

              <div className="flex flex-wrap gap-2">
                {article.tags.slice(0, 3).map((tag) => (
                  <Badge key={`${article.slug}-${tag}`}>{tag}</Badge>
                ))}
              </div>

              <Link href={`/blog/${article.slug}`} className="text-caption font-semibold underline">
                Baca artikel
              </Link>
            </OutlinedCard>
          ))}
        </div>
      )}
    </HeroBlock>
  );
}
