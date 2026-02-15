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
      <header className="sticky top-0 z-30 border-b border-[#e8ece9] bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link to="/" className="flex items-center gap-2 text-h5 font-extrabold text-[#1d6157]">
            <span>🌿</span>
            <span>Curhatin</span>
          </Link>

          <nav className="hidden items-center gap-6 text-caption font-semibold text-[#365f58] md:flex">
            <a href="#fitur">Fitur</a>
            <a href="#cara-konsultasi">Cara Konsultasi</a>
            <a href="#articles">Articles</a>
            <Link to="/admin">Admin</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/articles"
              className="hidden rounded-pill border border-[#c9ddd6] px-4 py-2 text-caption font-semibold text-[#2b7065] md:inline-flex"
            >
              See All Articles
            </Link>
            <Link to="/app/chat" className="rounded-pill bg-[#2a9d8f] px-5 py-2.5 text-caption font-bold text-white">
              Mulai Konsultasi
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-[1120px] gap-12 px-4 py-14 md:grid-cols-[1fr_360px] md:px-8 md:py-20">
          <div className="space-y-6">
            <span className="inline-flex rounded-pill bg-[#e7f6ee] px-4 py-1.5 text-caption font-semibold text-[#2f6e61]">
              Mental wellness companion
            </span>

            <h1 className="max-w-[640px] text-[clamp(2.3rem,6vw,4.8rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-[#1f5f56]">
              Konsultasi AI Assistant yang mudah, aman, dan manusiawi.
            </h1>

            <p className="max-w-[620px] text-[1.1rem] leading-relaxed text-[#476a64]">
              CurhatIn dibuat untuk pengguna non-IT. Kamu cukup cerita dengan bahasa sehari-hari. AI akan membantu refleksi perasaanmu secara pelan, tidak
              menghakimi, dan tetap menghormati privasi.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/app/chat" className="rounded-[14px] bg-[#2a9d8f] px-6 py-3 text-button font-bold text-white">
                Mulai Konsultasi Sekarang
              </Link>
              <a href="#cara-konsultasi" className="rounded-[14px] border-2 border-[#2a9d8f] px-6 py-3 text-button font-bold text-[#2a9d8f]">
                Pelajari Caranya
              </a>
            </div>

            <div className="flex flex-wrap gap-6 border-t border-[#e8ece9] pt-4 text-[#365f58]">
              <div>
                <p className="text-h4 font-extrabold">Anonymous</p>
                <p className="text-caption">Bisa dipakai tanpa login</p>
              </div>
              <div>
                <p className="text-h4 font-extrabold">AI by Consent</p>
                <p className="text-caption">AI aktif hanya saat kamu setuju</p>
              </div>
              <div>
                <p className="text-h4 font-extrabold">Login Optional</p>
                <p className="text-caption">Simpan konteks percakapan jika perlu</p>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-[#e2ebe7] bg-[#fbfefd] p-5 shadow-[0_20px_40px_rgba(15,50,44,0.08)]">
            <p className="text-caption font-semibold text-[#2d6b61]">Contoh konsultasi cepat</p>
            <div className="mt-3 space-y-2">
              <div className="rounded-2xl bg-white p-3 text-body text-[#375f59]">
                “Aku lagi capek banget dan susah fokus, harus mulai dari mana?”
              </div>
              <div className="rounded-2xl bg-[#edf8f4] p-3 text-body text-[#245f55]">
                “Terima kasih sudah cerita. Kita mulai dari hal paling ringan dulu. Hari ini bagian mana yang paling terasa berat?”
              </div>
            </div>
            <p className="mt-3 text-caption text-[#5b7a74]">
              AI membantu refleksi dan pertanyaan balik, bukan diagnosis medis.
            </p>
          </div>
        </section>

        <section id="fitur" className="mx-auto w-full max-w-[1120px] px-4 pb-10 md:px-8">
          <div className="grid gap-6 md:grid-cols-3">
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
              <article key={feature.title} className="space-y-2 border-l-4 border-[#d2e9df] pl-4">
                <h2 className="text-h6 font-bold text-[#1f5f56]">{feature.title}</h2>
                <p className="text-body text-[#496b66]">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="cara-konsultasi" className="mx-auto w-full max-w-[1120px] px-4 pb-10 md:px-8">
          <h2 className="text-h4 font-extrabold text-[#1f5f56]">Cara Konsultasi dengan AI Assistant</h2>
          <ol className="mt-4 grid gap-3 text-body text-[#486863] md:grid-cols-3">
            <li><strong>1.</strong> Tulis kondisi atau perasaanmu dengan bahasa sendiri.</li>
            <li><strong>2.</strong> Klik <em>Reflect with AI</em> lalu baca konfirmasi pengiriman data.</li>
            <li><strong>3.</strong> Lanjutkan dialog sampai kamu dapat insight yang lebih jernih.</li>
          </ol>
        </section>

        <section id="articles" className="mx-auto w-full max-w-[1120px] px-4 pb-20 md:px-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-h4 font-extrabold text-[#1f5f56]">Articles</h2>
              <p className="text-caption text-[#53746e]">Konten edukasi untuk SEO dan pembelajaran pengguna ({articleCountLabel}).</p>
            </div>
            <Link to="/articles" className="text-caption font-bold text-[#2a9d8f]">
              See all articles →
            </Link>
          </div>

          {loadingArticles ? <p className="text-caption text-muted">Memuat artikel...</p> : null}

          <div className="divide-y divide-[#e8ece9] border-y border-[#e8ece9]">
            {articles.slice(0, 5).map((article) => (
              <article key={article.id} className="py-4">
                <Link to={`/articles/${article.slug}`} className="block">
                  <h3 className="text-h5 font-bold text-[#215f56]">{article.title}</h3>
                  <p className="mt-1 text-body text-[#4d6c66]">{article.excerpt}</p>
                  <p className="mt-2 text-caption text-[#63827c]">
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
