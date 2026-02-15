import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { contentApi, type WellnessArticle } from '../lib/contentApi';

const formatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});

export function ArticleDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? '';
  const [article, setArticle] = useState<WellnessArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(contentApi(`/api/articles/${slug}`));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = (await response.json()) as { article?: WellnessArticle | null };
        if (!cancelled) setArticle(payload.article ?? null);
      } catch {
        if (!cancelled) setArticle(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    document.title = article ? `${article.title} | Curhatin` : 'Article | Curhatin';
  }, [article]);

  const paragraphs = useMemo(() => {
    if (!article?.body) return [];
    return article.body
      .split(/\n{2,}/g)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }, [article?.body]);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="border-b border-border bg-white">
        <div className="page-shell-narrow flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2 text-caption font-semibold tracking-tight text-ink">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-white p-1">
                <img src="/CurhatinAI.png" alt="CurhatIn AI" className="h-full w-full object-contain" />
              </span>
              CurhatIn
            </Link>
            <Link to="/articles" className="text-caption font-medium text-ink-soft underline decoration-dotted underline-offset-4 hover:text-ink">
              ← Kembali ke semua artikel
            </Link>
          </div>
          <Link to="/app/chat" className="inline-flex h-9 items-center rounded-md bg-[#191919] px-4 text-caption font-medium text-white hover:bg-black">
            Konsultasi AI
          </Link>
        </div>
      </header>

      <main className="page-shell-narrow py-8 sm:py-10">
        {loading ? <p className="text-caption text-muted">Memuat artikel...</p> : null}
        {!loading && !article ? (
          <div className="space-y-3">
            <h1 className="text-h4 font-semibold text-ink">Artikel tidak ditemukan</h1>
            <p className="text-body text-ink-soft">Coba kembali ke halaman articles untuk memilih artikel lain.</p>
            <Link to="/articles" className="text-caption font-medium text-ink-soft underline decoration-dotted underline-offset-4 hover:text-ink">
              Lihat semua artikel
            </Link>
          </div>
        ) : null}

        {article ? (
          <article className="space-y-5 sm:space-y-6">
            <header className="space-y-3">
              <h1 className="text-[clamp(1.8rem,7vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
                {article.title}
              </h1>
              <p className="text-body text-ink-soft">{article.excerpt}</p>
              <p className="text-caption text-muted">
                {article.author} • {article.publishedAt ? formatter.format(new Date(article.publishedAt)) : 'Draft'} • {article.readTimeMinutes} menit baca
              </p>
            </header>

            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={`${article.slug}-${tag}`} className="rounded-md border border-border bg-accent px-2.5 py-1 text-[11px] font-medium text-ink-soft">
                  {tag}
                </span>
              ))}
            </div>

            <section className="space-y-4 text-body leading-relaxed text-ink-soft">
              {(paragraphs.length > 0 ? paragraphs : [article.body]).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </section>
          </article>
        ) : null}
      </main>
    </div>
  );
}
