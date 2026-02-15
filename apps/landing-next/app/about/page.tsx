import { HeroBlock } from '@/components/page-primitives';
import { OutlinedCard } from '@/components/ui';

const values = [
  {
    title: 'Empati sebelum fitur',
    description: 'Bahasa, warna, dan alur dirancang agar terasa aman dan tidak menghakimi.'
  },
  {
    title: 'Kejelasan visual',
    description: 'Tipografi tegas dan outline tebal membantu fokus saat pikiran sedang ramai.'
  },
  {
    title: 'Transparansi safety',
    description: 'Kami tidak memberi diagnosis. Dukungan krisis selalu disediakan secara eksplisit.'
  }
];

export default function AboutPage() {
  return (
    <>
      <HeroBlock
        badge="About"
        title="Membuat ruang digital yang terasa manusiawi"
        description="CurhatIn AI hadir untuk menemani proses refleksi harian: perlahan, jelas, dan tetap hangat."
      >
        <div className="three-col-grid">
          {values.map((value) => (
            <OutlinedCard key={value.title} className="space-y-2">
              <h3 className="text-h6 font-bold">{value.title}</h3>
              <p className="text-body text-ink-soft">{value.description}</p>
            </OutlinedCard>
          ))}
        </div>
      </HeroBlock>

      <section className="section-wrap pb-20">
        <OutlinedCard className="space-y-4 md:p-8">
          <h2 className="text-h3 font-bold">Prinsip komunikasi kami</h2>
          <ul className="list-disc space-y-2 pl-5 text-body text-ink-soft">
            <li>Tidak menghakimi pengguna.</li>
            <li>Tidak memberi janji penyembuhan medis.</li>
            <li>Selalu memberi jalur bantuan profesional saat kondisi tidak aman.</li>
          </ul>
        </OutlinedCard>
      </section>
    </>
  );
}
