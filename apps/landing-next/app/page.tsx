import { HeroBlock, SectionHeader } from '@/components/page-primitives';
import {
  Badge,
  ChatBubbleSet,
  GroundingCard,
  InsightsChartCard,
  JournalEntryCard,
  LinkButton,
  OutlinedCard
} from '@/components/ui';
import { marketingFeatures } from '@/lib/content';

export default function HomePage() {
  return (
    <>
      <HeroBlock
        badge="Ruang refleksi yang aman"
        title="Pelan-pelan, kamu aman di sini."
        description="CurhatIn AI membantu kamu menulis, bernapas, dan memahami pola emosi dengan antarmuka yang bersih, tenang, dan tidak menghakimi."
      >
        <div className="grid gap-4 md:grid-cols-12">
          <OutlinedCard className="space-y-5 md:col-span-7">
            <p className="text-body text-ink-soft">
              Napas dulu, lalu lanjut. Satu aksi utama setiap layar supaya fokusmu tetap utuh.
            </p>
            <div className="flex flex-wrap gap-2">
              <LinkButton href="/app/chat" variant="primary">
                Mulai Chat
              </LinkButton>
              <LinkButton href="/onboarding/consent" variant="secondary">
                Mulai Onboarding
              </LinkButton>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent">2-3px outline</Badge>
              <Badge>High contrast</Badge>
              <Badge>No medical claims</Badge>
            </div>
          </OutlinedCard>

          <OutlinedCard className="space-y-4 md:col-span-5">
            <ChatBubbleSet />
          </OutlinedCard>
        </div>
      </HeroBlock>

      <section className="section-wrap pb-16">
        <SectionHeader
          title="Struktur jelas, hati tetap tenang"
          description="Soft-neobrutalism: tipografi tegas, outline tebal, whitespace lega, dan alur yang mudah dipahami."
        />
        <div className="three-col-grid mt-6">
          {marketingFeatures.slice(0, 3).map((feature) => (
            <OutlinedCard key={feature.title} className="space-y-3">
              <h3 className="text-h6 font-bold">{feature.title}</h3>
              <p className="text-body text-ink-soft">{feature.description}</p>
            </OutlinedCard>
          ))}
        </div>
      </section>

      <section className="section-wrap pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          <JournalEntryCard />
          <InsightsChartCard />
        </div>
      </section>

      <section className="section-wrap pb-20">
        <div className="grid gap-4 md:grid-cols-12">
          <OutlinedCard className="space-y-4 md:col-span-7">
            <h2 className="text-h3 font-bold">Saat terasa penuh, kembali ke hal paling dasar.</h2>
            <p className="text-body text-ink-soft">
              Kamu tidak perlu menyelesaikan semuanya sekaligus. Ambil jeda kecil, lalu pilih langkah berikutnya.
            </p>
            <GroundingCard />
          </OutlinedCard>
          <OutlinedCard className="space-y-4 md:col-span-5">
            <h3 className="text-h5 font-bold">Mulai sekarang</h3>
            <p className="text-body text-ink-soft">
              Satu langkah yang konsisten lebih penting daripada perubahan besar yang memaksa.
            </p>
            <LinkButton href="/app/chat" fullWidth variant="primary">
              Buka ruang chat
            </LinkButton>
            <LinkButton href="/features" fullWidth variant="secondary">
              Lihat fitur lengkap
            </LinkButton>
          </OutlinedCard>
        </div>
      </section>
    </>
  );
}
