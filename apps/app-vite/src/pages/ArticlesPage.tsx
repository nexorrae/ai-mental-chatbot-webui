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
      <header className="border-b border-[#e8ece9] bg-white">
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link to="/" className="text-h5 font-extrabold text-[#1f5f56]">
            Curhatin Articles
          </Link>
          <Link to="/app/chat" className="rounded-pill bg-[#2a9d8f] px-5 py-2 text-caption font-bold text-white">
            Konsultasi AI
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1120px] px-4 py-8 md:px-8">
        <div className="mb-6 space-y-3">
          <h1 className="text-h3 font-extrabold text-[#1f5f56]">See All Articles</h1>
          <p className="text-body text-[#4a6a65]">
            Artikel wellness, refleksi emosi, dan panduan penggunaan AI assistant secara aman.
          </p>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari artikel (contoh: anxiety, journaling, burnout...)"
            className="w-full max-w-[520px] rounded-[12px] border border-[#d8e6df] px-4 py-3 text-body"
          />
        </div>

        {loading ? <p className="text-caption text-muted">Memuat artikel...</p> : null}
        {!loading && filtered.length === 0 ? (
          <p className="text-body text-muted">Belum ada artikel yang cocok.</p>
        ) : null}

        <div className="divide-y divide-[#e8ece9] border-y border-[#e8ece9]">
          {filtered.map((article) => (
            <article key={article.id} className="py-5">
              <Link to={`/articles/${article.slug}`} className="block">
                <h2 className="text-h5 font-bold text-[#1f5f56]">{article.title}</h2>
                <p className="mt-2 text-body text-[#4e6d68]">{article.excerpt}</p>
                <p className="mt-2 text-caption text-[#68847f]">
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
