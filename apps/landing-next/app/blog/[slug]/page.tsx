import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge, GroundingCard, OutlinedCard } from '@/components/ui';
import { getArticleBySlug } from '@/lib/articles';

export const dynamic = 'force-dynamic';

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, true);

  if (!article) {
    return {
      title: 'Artikel tidak ditemukan'
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article'
    }
  };
}

export default async function BlogArticlePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const paragraphs = article.body
    .split(/\n\n+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  return (
    <article className="section-wrap py-14 md:py-20">
      <OutlinedCard className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Artikel refleksi</Badge>
          <Badge>{article.readTimeMinutes} menit baca</Badge>
          <p className="text-caption text-muted">
            {dateFormatter.format(new Date(article.publishedAt ?? article.updatedAt))}
          </p>
        </div>

        <header className="space-y-3">
          <h1 className="text-h2 font-extrabold tracking-tight">{article.title}</h1>
          <p className="text-body text-ink-soft">{article.excerpt}</p>
          <p className="text-caption text-muted">Ditulis oleh {article.author}</p>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={`${article.slug}-${tag}`}>{tag}</Badge>
            ))}
          </div>
        </header>

        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={`${article.slug}-${index}`} className="text-body text-ink-soft">
              {paragraph}
            </p>
          ))}
        </div>

        <GroundingCard />
      </OutlinedCard>
    </article>
  );
}
