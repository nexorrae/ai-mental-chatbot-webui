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

const partnerMarks = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'NVIDIA', 'Vercel', 'Perplexity'];

const useCases = [
  'Saat overthinking malam hari',
  'Saat burnout karena kerja',
  'Saat konflik dengan pasangan',
  'Saat bingung ambil keputusan',
  'Saat mau journaling 5 menit',
  'Saat butuh grounding cepat',
  'Saat perlu cek pola emosi',
  'Saat mau susun rencana pulih'
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
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white p-1">
              <img src="/CurhatinAI.png" alt="CurhatIn AI" className="h-full w-full object-contain" />
            </span>
            <span>CurhatIn AI</span>
          </Link>

          <nav className="hidden items-center gap-5 text-caption font-medium text-ink-soft md:flex">
            <a href="#fitur">Fitur</a>
            <a href="#workflow">Cara Kerja</a>
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
              <a className="rounded-md px-3 py-2 text-body text-ink-soft hover:bg-accent hover:text-ink" href="#workflow" onClick={() => setMobileNavOpen(false)}>
                Cara Kerja
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
        <section className="border-b border-border bg-white">
          <div className="page-shell py-12 sm:py-16 md:py-20">
            <div className="mx-auto max-w-[980px]">
              <div className="mb-6 flex items-center justify-center -space-x-2">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-brand-green-soft text-lg">🌿</span>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-brand-blue-soft text-lg">🫶</span>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-accent text-lg">🧠</span>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white p-1.5">
                  <img src="/CurhatinAI.png" alt="CurhatIn AI" className="h-full w-full object-contain" />
                </span>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-accent text-lg">💬</span>
              </div>

              <div className="space-y-5 text-center">
                <p className="mx-auto inline-flex rounded-full border border-brand-green/30 bg-brand-green-soft px-3 py-1 text-caption font-medium text-brand-green">
                  Chatbot AI assistant for mental wellness
                </p>
                <h1 className="mx-auto max-w-[900px] text-[clamp(2.1rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-[#191919]">
                  Tempat aman untuk curhat, refleksi, dan menenangkan pikiran.
                </h1>
                <p className="mx-auto max-w-[760px] text-[1.03rem] leading-relaxed text-ink-soft sm:text-[1.08rem]">
                  Dibuat untuk pengguna non-IT. Kamu tinggal cerita pakai bahasa sehari-hari, lalu AI bantu merangkum perasaanmu secara lembut,
                  tanpa menghakimi, dan hanya aktif saat kamu memberi izin.
                </p>

                <div className="flex flex-col justify-center gap-3 pt-1 sm:flex-row">
                  <Link to="/app/chat" className="inline-flex h-11 items-center justify-center rounded-md bg-[#191919] px-6 text-button font-medium text-white hover:bg-black">
                    Mulai Chat Sekarang
                  </Link>
                  <a href="#workflow" className="inline-flex h-11 items-center justify-center rounded-md border border-brand-blue/30 bg-brand-blue-soft px-6 text-button font-medium text-brand-blue hover:brightness-95">
                    Lihat Cara Pakai
                  </a>
                </div>

                <div className="grid gap-3 pt-2 text-left sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-white p-3.5">
                    <p className="text-h6 font-semibold tracking-tight text-ink">Anonymous by default</p>
                    <p className="mt-1 text-caption text-muted">Bisa langsung pakai tanpa akun.</p>
                  </div>
                  <div className="rounded-lg border border-border bg-white p-3.5">
                    <p className="text-h6 font-semibold tracking-tight text-ink">AI by consent</p>
                    <p className="mt-1 text-caption text-muted">Data dikirim hanya saat kamu klik Reflect with AI.</p>
                  </div>
                  <div className="rounded-lg border border-border bg-white p-3.5">
                    <p className="text-h6 font-semibold tracking-tight text-ink">Login optional</p>
                    <p className="mt-1 text-caption text-muted">Simpan konteks chat untuk sesi berikutnya kalau perlu.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-accent p-3.5 sm:p-4 lg:grid-cols-[300px_1fr]">
                <div className="rounded-xl border border-border bg-white p-4">
                  <p className="text-caption font-medium text-muted">Mulai dari sini</p>
                  <h2 className="mt-2 text-h5 font-semibold tracking-tight text-ink">Checklist pengguna baru</h2>
                  <ul className="mt-3 space-y-2 text-caption text-ink-soft">
                    <li>1. Tulis apa yang kamu rasakan hari ini.</li>
                    <li>2. Pilih mood untuk check-in singkat.</li>
                    <li>3. Tekan Reflect with AI saat kamu siap.</li>
                    <li>4. Lanjutkan dialog sampai dapat insight.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-border bg-white p-4">
                  <p className="text-caption font-medium text-muted">Contoh percakapan</p>
                  <div className="mt-3 space-y-2">
                    <div className="max-w-[88%] rounded-lg border border-border bg-brand-blue-soft px-3 py-2.5 text-body text-ink">
                      Aku lagi capek, tapi susah jelasin capeknya dari mana.
                    </div>
                    <div className="ml-auto max-w-[88%] rounded-lg bg-[#191919] px-3 py-2.5 text-body text-white">
                      Wajar kok kalau rasanya campur aduk. Mungkin kita mulai dari satu momen paling berat hari ini?
                    </div>
                    <div className="max-w-[88%] rounded-lg border border-border bg-brand-green-soft px-3 py-2.5 text-body text-ink">
                      Boleh. Tadi pagi rasanya pengen nangis sebelum meeting.
                    </div>
                  </div>
                  <p className="mt-3 text-caption text-muted">
                    CurhatIn AI berperan sebagai cermin refleksi, bukan diagnosis medis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-[#fafafa]">
          <div className="page-shell py-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-caption text-muted">Dipakai komunitas dari</span>
              {partnerMarks.map((name) => (
                <span key={name} className="inline-flex h-8 items-center rounded-md border border-border bg-white px-3 text-caption font-medium text-ink-soft">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="fitur" className="page-shell py-12 sm:py-14">
          <div className="grid gap-4 lg:grid-cols-[1fr_1.25fr]">
            <div className="space-y-3 rounded-xl border border-border bg-white p-4 sm:p-5">
              <p className="text-caption font-medium text-brand-blue">Kenapa CurhatIn AI?</p>
              <h2 className="text-h2 font-semibold tracking-tight text-ink">Lebih jelas, lebih tenang, lebih gampang dipakai.</h2>
              <p className="text-body text-ink-soft">
                UI didesain untuk orang awam: tombol jelas, alur sederhana, dan setiap langkah diberi penjelasan.
              </p>
              <Link to="/app/chat" className="inline-flex h-9 items-center rounded-md border border-brand-green/30 bg-brand-green-soft px-4 text-caption font-medium text-brand-green">
                Coba dashboard pengguna →
              </Link>
            </div>

            <div className="rounded-xl border border-border bg-white p-4 sm:p-5">
              <div className="divide-y divide-border">
                {[
                  ['Satu layar fokus', 'Chat, check-in mood, dan status privasi ada dalam satu alur.'],
                  ['Bahasa non-teknis', 'Semua label dan instruksi pakai wording yang mudah dipahami.'],
                  ['Kontrol data transparan', 'Kamu bisa lihat kapan data diproses AI dan kapan tetap lokal.'],
                  ['Akses fleksibel', 'Bisa anonymous atau login untuk menyimpan konteks personal.']
                ].map(([title, text]) => (
                  <div key={title} className="py-3">
                    <p className="text-h6 font-semibold tracking-tight text-ink">{title}</p>
                    <p className="mt-1 text-caption text-ink-soft">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="page-shell pb-12 sm:pb-14">
          <div className="rounded-2xl border border-border bg-white p-4 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
              <div className="space-y-3">
                <p className="text-caption font-medium text-brand-green">Cara konsultasi cepat</p>
                <h2 className="text-h3 font-semibold tracking-tight text-ink">3 langkah untuk mulai refleksi dengan AI.</h2>
                <p className="text-body text-ink-soft">
                  Dibuat supaya user baru langsung paham dari sesi pertama.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <article className="rounded-lg border border-brand-green/30 bg-brand-green-soft p-4">
                  <p className="text-caption font-semibold text-brand-green">Langkah 1</p>
                  <p className="mt-1 text-h6 font-semibold tracking-tight text-ink">Tulis kondisi saat ini</p>
                  <p className="mt-1 text-caption text-ink-soft">Contoh: "Aku lagi cemas karena kerjaan numpuk."</p>
                </article>
                <article className="rounded-lg border border-brand-blue/30 bg-brand-blue-soft p-4">
                  <p className="text-caption font-semibold text-brand-blue">Langkah 2</p>
                  <p className="mt-1 text-h6 font-semibold tracking-tight text-ink">Klik Reflect with AI</p>
                  <p className="mt-1 text-caption text-ink-soft">Akan muncul konfirmasi sebelum data diproses AI.</p>
                </article>
                <article className="rounded-lg border border-border bg-accent p-4">
                  <p className="text-caption font-semibold text-ink-soft">Langkah 3</p>
                  <p className="mt-1 text-h6 font-semibold tracking-tight text-ink">Baca insight lalu lanjutkan</p>
                  <p className="mt-1 text-caption text-ink-soft">AI bantu merangkum, bertanya balik, dan mengarahkan refleksi.</p>
                </article>
                <article className="rounded-lg border border-border bg-white p-4">
                  <p className="text-caption font-semibold text-ink-soft">Opsional</p>
                  <p className="mt-1 text-h6 font-semibold tracking-tight text-ink">Login untuk simpan konteks</p>
                  <p className="mt-1 text-caption text-ink-soft">Agar sesi berikutnya lebih personal untuk akunmu.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell pb-12">
          <h2 className="text-h3 font-semibold tracking-tight text-ink">Pilih kebutuhanmu hari ini.</h2>
          <p className="mt-2 text-body text-ink-soft">Mulai dari use case yang paling dekat dengan kondisimu.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((useCase, index) => (
              <article key={useCase} className="rounded-lg border border-border bg-white p-4">
                <p className="text-caption font-medium text-muted">Use case {index + 1}</p>
                <p className="mt-1 text-h6 font-semibold tracking-tight text-ink">{useCase}</p>
                <p className="mt-2 text-caption text-ink-soft">Buka chat dan mulai dengan satu kalimat sederhana.</p>
              </article>
            ))}
          </div>
        </section>

        <section id="articles" className="page-shell pb-16 sm:pb-20">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-h4 font-semibold tracking-tight text-ink">Articles</h2>
              <p className="text-caption text-muted">Konten edukasi untuk SEO dan pembelajaran pengguna ({articleCountLabel}).</p>
            </div>
            <Link to="/articles" className="text-caption font-medium text-brand-blue underline decoration-dotted underline-offset-4 hover:text-[#235ccc]">
              See all articles →
            </Link>
          </div>

          {loadingArticles ? <p className="text-caption text-muted">Memuat artikel...</p> : null}

          <div className="divide-y divide-border rounded-xl border border-border bg-white">
            {articles.slice(0, 5).map((article) => (
              <article key={article.id} className="p-4 sm:p-5">
                <Link to={`/articles/${article.slug}`} className="block">
                  <h3 className="text-h5 font-semibold tracking-tight text-ink">{article.title}</h3>
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

      <footer className="border-t border-border bg-[#fafafa]">
        <div className="page-shell py-10">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 text-h5 font-semibold tracking-tight text-ink">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white p-1">
                  <img src="/CurhatinAI.png" alt="CurhatIn AI" className="h-full w-full object-contain" />
                </span>
                CurhatIn AI
              </p>
              <p className="max-w-[340px] text-caption text-ink-soft">
                AI assistant untuk refleksi mental wellness. Aman, ramah, dan mudah dipakai.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-caption font-semibold text-ink">Product</p>
              <p className="text-caption text-ink-soft">Chat Assistant</p>
              <p className="text-caption text-ink-soft">Mood Check-in</p>
              <p className="text-caption text-ink-soft">Journal</p>
            </div>

            <div className="space-y-2">
              <p className="text-caption font-semibold text-ink">Resources</p>
              <p className="text-caption text-ink-soft">Articles</p>
              <p className="text-caption text-ink-soft">Privacy</p>
              <p className="text-caption text-ink-soft">Safety Guide</p>
            </div>

            <div className="space-y-2">
              <p className="text-caption font-semibold text-ink">Company</p>
              <p className="text-caption text-ink-soft">About</p>
              <p className="text-caption text-ink-soft">Support</p>
              <p className="text-caption text-ink-soft">Contact</p>
            </div>
          </div>

          <p className="mt-8 text-caption text-muted">© {new Date().getFullYear()} CurhatIn AI. Pelan-pelan, kamu aman di sini.</p>
        </div>
      </footer>
    </div>
  );
}
