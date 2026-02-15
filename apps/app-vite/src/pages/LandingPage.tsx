import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentApi, type WellnessArticle } from '../lib/contentApi';

const fallbackArticles: WellnessArticle[] = [
  {
    id: 'seed-1',
    slug: 'cara-mulai-konsultasi-ai-secara-aman',
    title: 'Cara Mulai Konsultasi AI Secara Aman',
    excerpt: 'Panduan singkat untuk mulai curhat dengan AI assistant tanpa merasa ribet.',
    body: 'Mulai dari check-in emosi, tulis konteks, lalu gunakan Reflect with AI saat kamu siap.',
    tags: ['Konsultasi', 'Privasi'],
    status: 'published',
    author: 'CurhatIn Team',
    readTimeMinutes: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString()
  },
  {
    id: 'seed-2',
    slug: 'jurnal-harian-untuk-menenangkan-pikiran',
    title: 'Jurnal Harian untuk Menenangkan Pikiran',
    excerpt: 'Template ringan untuk pengguna yang baru mulai refleksi diri.',
    body: 'Tiga pertanyaan sederhana untuk membantu memahami emosi hari ini.',
    tags: ['Jurnal', 'Mindfulness'],
    status: 'published',
    author: 'CurhatIn Team',
    readTimeMinutes: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString()
  },
  {
    id: 'seed-3',
    slug: 'bedanya-refleksi-dan-diagnosis',
    title: 'Bedanya Refleksi dan Diagnosis Medis',
    excerpt: 'AI membantu refleksi, bukan menggantikan tenaga profesional.',
    body: 'Kenali batas penggunaan AI untuk wellness agar tetap aman dan realistis.',
    tags: ['Safety', 'AI'],
    status: 'published',
    author: 'CurhatIn Team',
    readTimeMinutes: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString()
  }
];

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});

export function LandingPage() {
  const [articles, setArticles] = useState<WellnessArticle[]>(fallbackArticles);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadArticles() {
      try {
        const response = await fetch(contentApi('/api/articles?limit=6'));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = (await response.json()) as { articles?: WellnessArticle[] };
        if (cancelled) return;
        const published = (payload.articles ?? []).filter((article) => article.status === 'published');
        if (published.length > 0) setArticles(published);
      } catch {
        // Use fallback content if API unavailable
      } finally {
        if (!cancelled) setLoadingArticles(false);
      }
    }

    void loadArticles();
    return () => {
      cancelled = true;
    };
  }, []);

  const articleCountLabel = useMemo(() => `${articles.length} artikel terbaru`, [articles.length]);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
        <div className="page-shell flex items-center justify-between gap-3 py-3.5">
          <Link to="/" className="flex items-center gap-2 text-[1.08rem] font-semibold tracking-[-0.02em] text-ink">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-accent text-[13px] text-ink-soft">C</span>
            <span>CurhatIn</span>
          </Link>

          <nav className="hidden items-center gap-5 text-caption font-medium text-ink-soft md:flex">
            <a href="#fitur">Fitur</a>
            <a href="#cara-konsultasi">Cara Konsultasi</a>
            <a href="#articles">Articles</a>
            <Link to="/admin">Admin</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/articles"
              className="hidden h-9 items-center rounded-md border border-border px-3 text-caption font-medium text-ink-soft transition-colors hover:bg-accent hover:text-ink md:inline-flex"
            >
              See All Articles
            </Link>
            <Link to="/app/chat" className="inline-flex h-9 items-center rounded-md bg-[#191919] px-4 text-caption font-medium text-white hover:bg-black">
              Mulai Konsultasi
            </Link>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-white text-ink md:hidden"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-expanded={mobileNavOpen}
              aria-controls="landing-mobile-nav"
              aria-label={mobileNavOpen ? 'Tutup menu' : 'Buka menu'}
            >
              {mobileNavOpen ? '×' : '☰'}
            </button>
          </div>
        </div>
        {mobileNavOpen ? (
          <div id="landing-mobile-nav" className="border-t border-border md:hidden">
            <div className="page-shell flex flex-col gap-1 py-3">
              <a className="rounded-md px-3 py-2 text-body text-ink-soft hover:bg-accent hover:text-ink" href="#fitur" onClick={() => setMobileNavOpen(false)}>
                Fitur
              </a>
              <a className="rounded-md px-3 py-2 text-body text-ink-soft hover:bg-accent hover:text-ink" href="#cara-konsultasi" onClick={() => setMobileNavOpen(false)}>
                Cara Konsultasi
              </a>
              <a className="rounded-md px-3 py-2 text-body text-ink-soft hover:bg-accent hover:text-ink" href="#articles" onClick={() => setMobileNavOpen(false)}>
                Articles
              </a>
              <Link className="rounded-md px-3 py-2 text-body text-ink-soft hover:bg-accent hover:text-ink" to="/admin" onClick={() => setMobileNavOpen(false)}>
                Admin
              </Link>
              <Link className="rounded-md px-3 py-2 text-body text-ink-soft hover:bg-accent hover:text-ink" to="/articles" onClick={() => setMobileNavOpen(false)}>
                See All Articles
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <section className="page-shell grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5 sm:space-y-6">
            <span className="inline-flex rounded-full border border-border bg-accent px-3 py-1 text-caption font-medium text-ink-soft">
              Mental wellness companion
            </span>

            <h1 className="max-w-[680px] text-[clamp(2rem,8vw,4.3rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-[#191919]">
              Konsultasi AI Assistant yang mudah, aman, dan manusiawi.
            </h1>

            <p className="max-w-[620px] text-[1rem] leading-relaxed text-ink-soft sm:text-[1.04rem]">
              CurhatIn dibuat untuk pengguna non-IT. Kamu cukup cerita dengan bahasa sehari-hari. AI akan membantu refleksi perasaanmu secara pelan, tidak
              menghakimi, dan tetap menghormati privasi.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/app/chat" className="inline-flex h-10 items-center justify-center rounded-md bg-[#191919] px-5 text-button font-medium text-white hover:bg-black">
                Mulai Konsultasi Sekarang
              </Link>
              <a href="#cara-konsultasi" className="inline-flex h-10 items-center justify-center rounded-md border border-border px-5 text-button font-medium text-ink hover:bg-accent">
                Pelajari Caranya
              </a>
            </div>

            <div className="grid gap-4 border-t border-border pt-4 text-ink-soft sm:grid-cols-3 sm:gap-6">
              <div>
                <p className="text-h5 font-semibold tracking-tight text-ink">Anonymous</p>
                <p className="text-caption">Bisa dipakai tanpa login</p>
              </div>
              <div>
                <p className="text-h5 font-semibold tracking-tight text-ink">AI by Consent</p>
                <p className="text-caption">AI aktif hanya saat kamu setuju</p>
              </div>
              <div>
                <p className="text-h5 font-semibold tracking-tight text-ink">Login Optional</p>
                <p className="text-caption">Simpan konteks percakapan jika perlu</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-4 shadow-soft sm:p-5">
            <p className="text-caption font-medium text-ink-soft">Contoh konsultasi cepat</p>
            <div className="mt-3 space-y-2">
              <div className="rounded-lg border border-border bg-accent p-3 text-body text-ink">
                “Aku lagi capek banget dan susah fokus, harus mulai dari mana?”
              </div>
              <div className="rounded-lg border border-border bg-white p-3 text-body text-ink">
                “Terima kasih sudah cerita. Kita mulai dari hal paling ringan dulu. Hari ini bagian mana yang paling terasa berat?”
              </div>
            </div>
            <p className="mt-3 text-caption text-muted">
              AI membantu refleksi dan pertanyaan balik, bukan diagnosis medis.
            </p>
          </div>
        </section>

        <section id="fitur" className="page-shell pb-10">
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {[
              {
                title: 'Untuk pengguna awam',
                text: 'UI dibuat sederhana: langsung tulis masalahmu, lalu pilih Reflect with AI.'
              },
              {
                title: 'Privasi lebih jelas',
                text: 'Kamu selalu tahu kapan data dikirim ke AI karena ada consent prompt.'
              },
              {
                title: 'Konteks personal',
                text: 'Jika login, riwayatmu bisa dipakai agar AI lebih nyambung di sesi berikutnya.'
              }
            ].map((feature) => (
              <article key={feature.title} className="space-y-2 rounded-lg border border-border bg-white p-4">
                <h2 className="text-h6 font-semibold text-ink">{feature.title}</h2>
                <p className="text-body text-ink-soft">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="cara-konsultasi" className="page-shell pb-10">
          <h2 className="text-h4 font-semibold tracking-tight text-ink">Cara Konsultasi dengan AI Assistant</h2>
          <ol className="mt-4 grid gap-3 text-body text-ink-soft sm:grid-cols-2 lg:grid-cols-3">
            <li className="rounded-lg border border-border bg-white p-4"><strong>1.</strong> Tulis kondisi atau perasaanmu dengan bahasa sendiri.</li>
            <li className="rounded-lg border border-border bg-white p-4"><strong>2.</strong> Klik <em>Reflect with AI</em> lalu baca konfirmasi pengiriman data.</li>
            <li className="rounded-lg border border-border bg-white p-4"><strong>3.</strong> Lanjutkan dialog sampai kamu dapat insight yang lebih jernih.</li>
          </ol>
        </section>

        <section id="articles" className="page-shell pb-16 sm:pb-20">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-h4 font-semibold tracking-tight text-ink">Articles</h2>
              <p className="text-caption text-muted">Konten edukasi untuk SEO dan pembelajaran pengguna ({articleCountLabel}).</p>
            </div>
            <Link to="/articles" className="text-caption font-medium text-ink-soft underline decoration-dotted underline-offset-4 hover:text-ink">
              See all articles →
            </Link>
          </div>

          {loadingArticles ? <p className="text-caption text-muted">Memuat artikel...</p> : null}

          <div className="divide-y divide-border border-y border-border">
            {articles.slice(0, 5).map((article) => (
              <article key={article.id} className="py-4">
                <Link to={`/articles/${article.slug}`} className="block">
                  <h3 className="text-h5 font-semibold text-ink">{article.title}</h3>
                  <p className="mt-1 text-body text-ink-soft">{article.excerpt}</p>
                  <p className="mt-2 text-caption text-muted">
                    {article.author} • {article.publishedAt ? dateFormatter.format(new Date(article.publishedAt)) : 'Draft'} •{' '}
                    {article.readTimeMinutes} menit
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
