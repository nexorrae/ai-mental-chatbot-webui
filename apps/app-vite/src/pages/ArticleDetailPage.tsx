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
      <header className="border-b border-[#e8ece9] bg-white">
        <div className="mx-auto flex w-full max-w-[880px] items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link to="/articles" className="text-caption font-semibold text-[#2a9d8f]">
            ← Kembali ke semua artikel
          </Link>
          <Link to="/app/chat" className="rounded-pill bg-[#2a9d8f] px-4 py-2 text-caption font-bold text-white">
            Konsultasi AI
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[880px] px-4 py-10 md:px-8">
        {loading ? <p className="text-caption text-muted">Memuat artikel...</p> : null}
        {!loading && !article ? (
          <div className="space-y-3">
            <h1 className="text-h4 font-extrabold text-[#1f5f56]">Artikel tidak ditemukan</h1>
            <p className="text-body text-[#4a6a65]">Coba kembali ke halaman articles untuk memilih artikel lain.</p>
            <Link to="/articles" className="text-caption font-bold text-[#2a9d8f]">
              Lihat semua artikel
            </Link>
          </div>
        ) : null}

        {article ? (
          <article className="space-y-5">
            <header className="space-y-3">
              <h1 className="text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#1f5f56]">
                {article.title}
              </h1>
              <p className="text-body text-[#4b6c67]">{article.excerpt}</p>
              <p className="text-caption text-[#67837e]">
                {article.author} • {article.publishedAt ? formatter.format(new Date(article.publishedAt)) : 'Draft'} • {article.readTimeMinutes} menit baca
              </p>
            </header>

            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={`${article.slug}-${tag}`} className="rounded-full bg-[#e8f6ef] px-3 py-1 text-[11px] font-semibold text-[#2b7065]">
                  {tag}
                </span>
              ))}
            </div>

            <section className="space-y-4 text-body leading-relaxed text-[#3f625d]">
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
