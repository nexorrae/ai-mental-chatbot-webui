import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentApi, type WellnessArticle } from '../lib/contentApi';

const formatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});

export function ArticlesPage() {
  const [articles, setArticles] = useState<WellnessArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.title = 'Articles | Curhatin';
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch(contentApi('/api/articles?limit=200'));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = (await response.json()) as { articles?: WellnessArticle[] };
        if (cancelled) return;
        setArticles((payload.articles ?? []).filter((article) => article.status === 'published'));
      } catch {
        if (!cancelled) setArticles([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return articles;
    return articles.filter((article) =>
      [article.title, article.excerpt, article.body, article.tags.join(' '), article.author]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    );
  }, [articles, search]);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="border-b border-border bg-paper">
        <div className="page-shell flex flex-wrap items-center justify-between gap-3 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-h5 font-semibold tracking-tight text-ink">
            <span className="brand-mark brand-mark--lg">
              <img src="/CurhatinAI.png" alt="CurhatIn AI" className="brand-mark__img" />
            </span>
            Curhatin Articles
          </Link>
          <Link to="/app/chat" className="inline-flex h-9 items-center rounded-md bg-brand-green px-4 text-sm font-semibold text-white hover:bg-[#3e540d]">
            Konsultasi AI
          </Link>
        </div>
      </header>

      <main className="page-shell py-8">
        <div className="mb-6 space-y-3">
          <h1 className="text-h3 font-semibold tracking-tight text-ink">See All Articles</h1>
          <p className="text-body text-ink-soft">
            Artikel wellness, refleksi emosi, dan panduan penggunaan AI assistant secara aman.
          </p>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari artikel (contoh: anxiety, journaling, burnout...)"
            className="h-10 w-full rounded-md border border-border bg-paper px-3 text-[15px] focus-visible:border-brand-green sm:max-w-[540px]"
          />
        </div>

        {loading ? <p className="text-caption text-muted">Memuat artikel...</p> : null}
        {!loading && filtered.length === 0 ? (
          <p className="text-body text-muted">Belum ada artikel yang cocok.</p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <article key={article.id} className="group relative flex flex-col justify-between rounded-xl border border-border bg-paper p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-md">
              <Link to={`/articles/${article.slug}`} className="absolute inset-0 z-10">
                <span className="sr-only">Baca artikel {article.title}</span>
              </Link>
              <div>
                <div className="mb-3 inline-flex items-center rounded-full border border-brand-green/20 bg-brand-green-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-green">
                  Artikel
                </div>
                <h2 className="text-h5 font-semibold tracking-tight text-ink transition-colors group-hover:text-brand-green">{article.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft line-clamp-3">{article.excerpt}</p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <p className="text-[11px] font-medium text-muted">
                  {article.author} • {article.publishedAt ? formatter.format(new Date(article.publishedAt)) : 'Draft'}
                </p>
                <p className="text-[11px] font-medium text-brand-green">{article.readTimeMinutes} min read</p>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
