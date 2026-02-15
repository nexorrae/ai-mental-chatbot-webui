import { Link } from 'react-router-dom';
import { Badge, Footer, GroundingCard, OutlinedCard } from '../components/ui';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="border-b-base border-border bg-paper">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-8">
          <div>
            <p className="text-h5 font-extrabold">CurhatIn AI</p>
            <p className="text-caption text-muted">Ruang refleksi aman, AI opsional</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/app/chat" className="rounded-pill border-base border-border bg-ink px-5 py-2 text-caption font-semibold text-paper">
              Buka Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] space-y-4 px-4 py-6 md:px-8 md:py-8">
        <OutlinedCard className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">Guest mode first</Badge>
            <Badge>Local-first journal</Badge>
            <Badge tone="success">AI off by default</Badge>
          </div>
          <h1 className="text-h3 font-extrabold">Pelan-pelan, kamu aman di sini.</h1>
          <p className="text-body text-ink-soft">
            CurhatIn membantu kamu check-in harian dan refleksi emosi tanpa memaksa login. AI hanya aktif saat kamu menekan tombol
            <strong> Reflect with AI</strong> dan menyetujui konfirmasi kirim data.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/app/chat" className="rounded-pill border-base border-border bg-ink px-5 py-2 text-caption font-semibold text-paper">
              Mulai Check-in
            </Link>
            <a href="#workflow" className="rounded-pill border-base border-border bg-paper px-5 py-2 text-caption font-semibold text-ink">
              Lihat Workflow
            </a>
          </div>
        </OutlinedCard>

        <section id="workflow" className="grid gap-4 md:grid-cols-3">
          <OutlinedCard className="space-y-3">
            <h2 className="text-h6 font-bold">A. User Flow</h2>
            <ul className="list-disc space-y-1 pl-5 text-caption text-ink-soft">
              <li>User masuk tanpa login paksa (guest mode first).</li>
              <li>Daily check-in via teks jurnal atau mood selector.</li>
              <li>Data default disimpan lokal di device user.</li>
              <li>AI hanya aktif saat user klik “Reflect with AI”.</li>
              <li>Muncul konfirmasi kirim data sebelum request AI.</li>
            </ul>
          </OutlinedCard>

          <OutlinedCard className="space-y-3">
            <h2 className="text-h6 font-bold">B. Data Flow</h2>
            <ul className="list-disc space-y-1 pl-5 text-caption text-ink-soft">
              <li>Free flow: Input - Local storage (tanpa trigger AI).</li>
              <li>Optional sync: hanya jika user login untuk backup.</li>
              <li>Premium AI: Input - Consent - API - Response - Client.</li>
              <li>Server AI stateless dan tidak menyimpan memori jangka panjang.</li>
              <li>Data request dikirim hanya saat user meminta refleksi.</li>
            </ul>
          </OutlinedCard>

          <OutlinedCard className="space-y-3">
            <h2 className="text-h6 font-bold">C. AI Rules</h2>
            <ul className="list-disc space-y-1 pl-5 text-caption text-ink-soft">
              <li>AI OFF by default, tidak jalan di background.</li>
              <li>Peran AI sebagai cermin refleksi, bukan dokter/guru.</li>
              <li>AI tidak boleh memberi diagnosis medis.</li>
              <li>AI tidak boleh memberi instruksi preskriptif “harus melakukan X”.</li>
              <li>Output fokus merangkum emosi dan pertanyaan reflektif.</li>
            </ul>
          </OutlinedCard>
        </section>

        <OutlinedCard className="space-y-3">
          <h2 className="text-h5 font-bold">Technical Boundaries</h2>
          <p className="text-body text-ink-soft">
            Batasan ini menjaga privasi user dan integritas produk: data jurnal tetap local-first, AI aktif hanya atas trigger sadar user, dan komunikasi AI
            berjalan stateless tanpa penyimpanan konteks lintas sesi.
          </p>
          <GroundingCard compact />
        </OutlinedCard>
      </main>

      <Footer />
    </div>
  );
}
