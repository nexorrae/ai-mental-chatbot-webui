import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
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

const heroMoods = [
  { label: 'Tenang', icon: '🌿' },
  { label: 'Lega', icon: '🫶' },
  { label: 'Fokus', icon: '🧠' },
  { label: 'Butuh jeda', icon: '💬' }
];

const reassuranceCards = [
  {
    icon: '✦',
    title: 'Anonymous by default',
    description: 'Bisa langsung pakai tanpa akun.'
  },
  {
    icon: '✓',
    title: 'AI by consent',
    description: 'Data dikirim hanya saat kamu klik Reflect with AI.'
  },
  {
    icon: '↗',
    title: 'Login optional',
    description: 'Simpan konteks chat untuk sesi berikutnya kalau perlu.'
  }
];

const miniInsights = [
  { label: 'Napas', value: '1 menit', detail: 'jeda singkat' },
  { label: 'Mood', value: '5 pilihan', detail: 'check-in cepat' },
  { label: 'Privasi', value: 'OFF', detail: 'AI sebelum izin' }
];

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
      <header className="sticky top-0 z-30 border-b border-border bg-paper/95 backdrop-blur">
        <div className="landing-shell flex items-center justify-between gap-3 py-4">
          <Link to="/" className="flex items-center gap-2 text-[1.08rem] font-semibold tracking-normal text-ink">
            <span className="brand-mark brand-mark--lg">
              <img src="/CurhatinAI.png" alt="CurhatIn AI" className="brand-mark__img" />
            </span>
            <span>CurhatIn AI</span>
          </Link>

          <nav className="hidden items-center gap-5 text-caption font-medium text-ink-soft md:flex">
            <a href="#fitur">Fitur</a>
            <a href="#workflow">Cara Kerja</a>
            <a href="#articles">Articles</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/articles"
              className="hidden h-9 items-center rounded-md border border-border px-3 text-sm font-semibold text-ink-soft transition-colors hover:bg-accent hover:text-ink md:inline-flex"
            >
              See All Articles
            </Link>
            <Link to="/app/chat" className="inline-flex h-9 items-center rounded-md bg-brand-green px-4 text-sm font-semibold text-white hover:bg-[#3e540d]">
              Mulai Konsultasi
            </Link>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-paper text-ink md:hidden"
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
            <div className="landing-shell flex flex-col gap-1 py-3">
              <a className="rounded-md px-3 py-2 text-body text-ink-soft hover:bg-accent hover:text-ink" href="#fitur" onClick={() => setMobileNavOpen(false)}>
                Fitur
              </a>
              <a className="rounded-md px-3 py-2 text-body text-ink-soft hover:bg-accent hover:text-ink" href="#workflow" onClick={() => setMobileNavOpen(false)}>
                Cara Kerja
              </a>
              <a className="rounded-md px-3 py-2 text-body text-ink-soft hover:bg-accent hover:text-ink" href="#articles" onClick={() => setMobileNavOpen(false)}>
                Articles
              </a>
              <Link className="rounded-md px-3 py-2 text-body text-ink-soft hover:bg-accent hover:text-ink" to="/articles" onClick={() => setMobileNavOpen(false)}>
                See All Articles
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <section className="border-b border-border bg-paper">
          <div className="landing-shell relative overflow-hidden py-14 sm:py-20 md:py-24">
            <div className="pointer-events-none absolute left-6 top-16 hidden h-24 w-24 rounded-full bg-brand-green-soft/70 blur-2xl md:block" />
            <div className="pointer-events-none absolute bottom-20 right-10 hidden h-32 w-32 rounded-full bg-accent/80 blur-2xl lg:block" />

            <div className="grid items-center gap-10 xl:grid-cols-[minmax(0,0.92fr)_minmax(580px,1.08fr)] 2xl:grid-cols-[minmax(0,0.95fr)_minmax(720px,1.05fr)]">
              <div className="space-y-6 text-center xl:text-left">
                <div className="flex items-center justify-center -space-x-2 xl:justify-start">
                  {heroMoods.map((mood, index) => (
                    <span
                      key={mood.label}
                      className="hero-float-chip inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-brand-green-soft text-lg shadow-soft"
                      style={{ animationDelay: `${index * 140}ms` }}
                      title={mood.label}
                    >
                      {mood.icon}
                    </span>
                  ))}
                  <span className="hero-float-chip inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-border bg-paper p-0.5 shadow-soft" title="CurhatIn AI">
                    <img src="/CurhatinAI.png" alt="CurhatIn AI" className="brand-mark__img" />
                  </span>
                </div>

                <div className="space-y-5">
                  <p className="inline-flex rounded-md border border-brand-green/30 bg-brand-green-soft px-3 py-1 text-xs font-semibold text-brand-green">
                    Chatbot AI assistant for mental wellness
                  </p>
                  <h1 className="mx-auto max-w-[1100px] font-serif text-[clamp(3.2rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-normal text-ink xl:mx-0">
                    Tempat aman untuk curhat, refleksi, dan menenangkan pikiran.
                  </h1>
                  <p className="mx-auto max-w-[760px] text-[1.03rem] leading-relaxed text-ink-soft sm:text-[1.08rem] xl:mx-0">
                    Dibuat untuk pengguna non-IT. Kamu tinggal cerita pakai bahasa sehari-hari, lalu AI bantu merangkum perasaanmu secara lembut,
                    tanpa menghakimi, dan hanya aktif saat kamu memberi izin.
                  </p>

                  <div className="flex flex-col justify-center gap-3 pt-1 sm:flex-row xl:justify-start">
                    <Link to="/app/chat" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-green px-6 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-[#3e540d]">
                      Coba Sekarang
                      <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true"><path d="M4 10H16M11 5L16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </Link>
                    <a href="#workflow" className="inline-flex h-11 items-center justify-center rounded-md border border-brand-green/30 bg-brand-green-soft px-6 text-base font-semibold text-brand-green transition-transform hover:-translate-y-0.5 hover:brightness-95">
                      Lihat Cara Pakai
                    </a>
                  </div>

                  <div className="grid gap-3 pt-2 text-left sm:grid-cols-3">
                    {reassuranceCards.map((card) => (
                      <div key={card.title} className="rounded-md border border-border bg-paper p-3.5 transition-transform hover:-translate-y-1 hover:bg-brand-green-soft/40">
                        <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-green text-caption font-semibold text-white">
                          {card.icon}
                        </span>
                        <p className="text-h6 font-semibold tracking-tight text-ink">{card.title}</p>
                        <p className="mt-1 text-caption text-muted">{card.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="hero-orbit hero-orbit--one" aria-hidden="true">✦</div>
                <div className="hero-orbit hero-orbit--two" aria-hidden="true">✓</div>
                <div className="hero-orbit hero-orbit--three" aria-hidden="true">↗</div>

                <div className="relative rounded-[2rem] bg-[#8f9d79] p-4 shadow-soft sm:p-6">
                  <div className="rounded-[1.5rem] border-[10px] border-ink bg-paper p-4 shadow-[0_24px_60px_rgba(5,5,5,0.18)] sm:p-5">
                    <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                      <div className="flex items-center gap-3">
                        <span className="brand-mark brand-mark--md">
                          <img src="/CurhatinAI.png" alt="CurhatIn AI" className="brand-mark__img" />
                        </span>
                        <div>
                          <p className="text-caption font-semibold text-ink">CurhatIn Room</p>
                          <p className="text-[11px] text-muted">AI OFF sampai kamu setuju</p>
                        </div>
                      </div>
                      <span className="rounded-md bg-brand-green-soft px-3 py-1 text-xs font-semibold text-brand-green">
                        Safe mode
                      </span>
                    </div>

                    <div className="grid gap-4 py-4 sm:grid-cols-[1fr_0.78fr]">
                      <div className="space-y-3">
                        <div className="max-w-[92%] rounded-lg border border-border bg-brand-green-soft px-4 py-3 text-body text-ink">
                          Aku lagi penuh banget, tapi belum tahu mulai cerita dari mana.
                        </div>
                        <div className="ml-auto max-w-[92%] rounded-lg bg-brand-green px-4 py-3 text-body text-white">
                          Kita mulai pelan-pelan. Pilih satu rasa yang paling kuat sekarang.
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {heroMoods.map((mood) => (
                            <button
                              key={`hero-mood-${mood.label}`}
                              type="button"
                              className="rounded-md border border-border bg-paper px-3 py-2 text-left text-caption font-semibold text-ink-soft transition-colors hover:bg-brand-green-soft hover:text-ink"
                            >
                              <span aria-hidden="true" className="mr-2">{mood.icon}</span>
                              {mood.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 rounded-lg border border-border bg-bg p-3">
                        <p className="text-caption font-semibold text-ink">Mood map</p>
                        {[64, 42, 78, 56, 88].map((value, index) => (
                          <div key={value} className="flex items-center gap-2">
                            <span className="w-12 text-[11px] font-semibold text-muted">Day {index + 1}</span>
                            <span className="h-2 flex-1 overflow-hidden rounded-full bg-paper">
                              <span className="hero-meter block h-full rounded-full bg-brand-green" style={{ width: `${value}%` }} />
                            </span>
                          </div>
                        ))}
                        <div className="rounded-md border border-border bg-paper p-3">
                          <p className="text-[11px] font-semibold text-brand-green">Insight lembut</p>
                          <p className="mt-1 text-caption text-ink-soft">Kamu lebih tenang setelah memberi nama pada perasaanmu.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2 border-t border-border pt-4 sm:grid-cols-3">
                      {miniInsights.map((item) => (
                        <div key={item.label} className="rounded-md border border-border bg-paper p-3">
                          <p className="text-[11px] font-semibold text-muted">{item.label}</p>
                          <p className="mt-1 text-h6 font-semibold text-ink">{item.value}</p>
                          <p className="text-[11px] text-muted">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-bg">
          <div className="landing-shell py-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-caption text-muted">Dipakai komunitas dari</span>
              {partnerMarks.map((name) => (
                <span key={name} className="inline-flex h-8 items-center rounded-md border border-border bg-paper px-3 text-xs font-semibold text-ink-soft">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="fitur" className="landing-shell py-16 sm:py-20">
          <div className="grid gap-4 lg:grid-cols-[1fr_1.25fr]">
            <div className="flex flex-col justify-center space-y-4 rounded-xl border border-transparent p-2 sm:p-4">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-green">
                <span className="h-px w-6 bg-brand-green/50" /> Kenapa CurhatIn AI?
              </p>
              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-normal text-ink">Lebih jelas, lebih tenang, lebih gampang dipakai.</h2>
              <p className="text-base leading-relaxed text-ink-soft">
                UI didesain untuk orang awam: tombol jelas, alur sederhana, dan setiap langkah diberi penjelasan agar kamu merasa aman.
              </p>
              <div className="pt-2">
                <Link to="/app/chat" className="inline-flex h-10 items-center rounded-md bg-ink px-5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 hover:shadow-md">
                  Coba dashboard pengguna →
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-paper shadow-sm">
              <div className="divide-y divide-border">
                {[
                  { title: 'Satu layar fokus', desc: 'Chat, check-in mood, dan status privasi ada dalam satu alur.', icon: '🎯' },
                  { title: 'Bahasa non-teknis', desc: 'Semua label dan instruksi pakai wording yang mudah dipahami.', icon: '💬' },
                  { title: 'Kontrol data transparan', desc: 'Kamu bisa lihat kapan data diproses AI dan kapan tetap lokal.', icon: '🛡️' },
                  { title: 'Akses fleksibel', desc: 'Bisa anonymous atau login untuk menyimpan konteks personal.', icon: '✨' }
                ].map(({title, desc, icon}) => (
                  <div key={title} className="group flex gap-4 p-5 transition-colors hover:bg-bg sm:p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-xl shadow-inner transition-transform group-hover:scale-110 group-hover:bg-brand-green/20">
                      {icon}
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-base font-semibold tracking-tight text-ink transition-colors group-hover:text-brand-green">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="landing-shell pb-16 sm:pb-20">
          <div className="rounded-2xl border border-border bg-paper p-6 shadow-sm sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[340px_1fr] xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-green">
                  Cara konsultasi cepat
                </p>
                <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-normal text-ink">3 langkah untuk mulai refleksi dengan AI.</h2>
                <p className="text-base leading-relaxed text-ink-soft">
                  Dibuat supaya pengguna baru bisa langsung merasakan manfaatnya dari sesi pertama.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { step: 'Langkah 1', title: 'Tulis kondisi saat ini', desc: 'Contoh: "Aku lagi cemas karena kerjaan numpuk."', active: true },
                  { step: 'Langkah 2', title: 'Klik Reflect with AI', desc: 'Akan muncul konfirmasi privasi sebelum data diproses.', active: true },
                  { step: 'Langkah 3', title: 'Baca insight & lanjutkan', desc: 'AI bantu merangkum, bertanya balik, dan mengarahkan.', active: true },
                  { step: 'Opsional', title: 'Login untuk simpan konteks', desc: 'Agar sesi berikutnya lebih personal dan nyambung.', active: false }
                ].map(({step, title, desc, active}, i) => (
                  <article key={title} className={clsx(
                    "relative flex flex-col justify-between overflow-hidden rounded-xl border p-5 transition-all hover:-translate-y-1 hover:shadow-md",
                    active ? "border-brand-green/30 bg-brand-green/5 hover:border-brand-green/50" : "border-border bg-paper hover:border-brand-green/30"
                  )}>
                    <div>
                      <div className="mb-4 flex items-center gap-2">
                        <span className={clsx("flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold shadow-sm", active ? "bg-brand-green text-white" : "bg-bg border border-border text-ink-soft")}>
                          {i + 1}
                        </span>
                        <p className={clsx("text-xs font-bold uppercase tracking-wider", active ? "text-brand-green" : "text-ink-soft")}>{step}</p>
                      </div>
                      <p className="text-base font-semibold tracking-tight text-ink">{title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="landing-shell pb-12">
          <h2 className="font-serif text-h3 font-semibold tracking-normal text-ink">Pilih kebutuhanmu hari ini.</h2>
          <p className="mt-2 text-body text-ink-soft">Mulai dari use case yang paling dekat dengan kondisimu.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((useCase, index) => (
              <article key={useCase} className="rounded-md border border-border bg-paper p-4">
                <p className="text-caption font-medium text-muted">Use case {index + 1}</p>
                <p className="mt-1 text-h6 font-semibold tracking-tight text-ink">{useCase}</p>
                <p className="mt-2 text-caption text-ink-soft">Buka chat dan mulai dengan satu kalimat sederhana.</p>
              </article>
            ))}
          </div>
        </section>

        <section id="articles" className="landing-shell pb-16 sm:pb-20">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-h4 font-semibold tracking-normal text-ink">Articles</h2>
              <p className="text-caption text-muted">Konten edukasi untuk SEO dan pembelajaran pengguna ({articleCountLabel}).</p>
            </div>
            <Link to="/articles" className="text-caption font-semibold text-brand-green underline decoration-dotted underline-offset-4 hover:text-[#3e540d]">
              See all articles →
            </Link>
          </div>

          {loadingArticles ? <p className="text-caption text-muted">Memuat artikel...</p> : null}

          <div className="divide-y divide-border rounded-md border border-border bg-paper">
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

      <footer className="border-t border-border bg-paper">
        <div className="landing-shell py-10">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 text-h5 font-semibold tracking-tight text-ink">
                <span className="brand-mark brand-mark--lg">
                  <img src="/CurhatinAI.png" alt="CurhatIn AI" className="brand-mark__img" />
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
