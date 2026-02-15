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
      <header className="border-b border-border bg-white">
        <div className="page-shell flex flex-wrap items-center justify-between gap-3 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-h5 font-semibold tracking-tight text-ink">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white p-1">
              <img src="/CurhatinAI.png" alt="CurhatIn AI" className="h-full w-full object-contain" />
            </span>
            Curhatin Articles
          </Link>
          <Link to="/app/chat" className="inline-flex h-9 items-center rounded-md bg-[#191919] px-4 text-caption font-medium text-white hover:bg-black">
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
            className="h-10 w-full rounded-md border border-border bg-white px-3 text-[15px] sm:max-w-[540px]"
          />
        </div>

        {loading ? <p className="text-caption text-muted">Memuat artikel...</p> : null}
        {!loading && filtered.length === 0 ? (
          <p className="text-body text-muted">Belum ada artikel yang cocok.</p>
        ) : null}

        <div className="divide-y divide-border border-y border-border">
          {filtered.map((article) => (
            <article key={article.id} className="py-5">
              <Link to={`/articles/${article.slug}`} className="block">
                <h2 className="text-h5 font-semibold text-ink">{article.title}</h2>
                <p className="mt-2 text-body text-ink-soft">{article.excerpt}</p>
                <p className="mt-2 text-caption text-muted">
                  {article.author} • {article.publishedAt ? formatter.format(new Date(article.publishedAt)) : 'Draft'} •{' '}
                  {article.readTimeMinutes} menit
                </p>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
