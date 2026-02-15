import { HeroBlock, SectionHeader } from '@/components/page-primitives';
import {
  Badge,
  EmptyState,
  LinkButton,
  OutlinedCard,
  Tabs
} from '@/components/ui';
import { marketingFeatures } from '@/lib/content';

export default function FeaturesPage() {
  return (
    <>
      <HeroBlock
        badge="Features"
        title="Fitur yang jelas, tidak melelahkan"
        description="Setiap komponen dirancang agar tetap fokus, aman, dan nyaman dipakai saat emosi naik turun."
      >
        <div className="three-col-grid">
          {marketingFeatures.map((feature) => (
            <OutlinedCard key={feature.title} className="space-y-2">
              <Badge tone="accent">Core</Badge>
              <h3 className="text-h6 font-bold">{feature.title}</h3>
              <p className="text-body text-ink-soft">{feature.description}</p>
            </OutlinedCard>
          ))}
        </div>
      </HeroBlock>

      <section className="section-wrap pb-16">
        <SectionHeader
          title="Pilar pengalaman"
          description="Interaksi dibagi menjadi tiga mode agar kamu selalu tahu apa yang sedang kamu lakukan."
        />
        <div className="mt-6">
          <Tabs
            items={[
              {
                id: 'reflect',
                label: 'Reflect',
                panel: (
                  <p className="text-body text-ink-soft">
                    Chat, journaling, dan mood picker dibuat linear. Satu tindakan utama per layar agar beban kognitif tetap rendah.
                  </p>
                )
              },
              {
                id: 'ground',
                label: 'Ground',
                panel: (
                  <p className="text-body text-ink-soft">
                    Take-a-breath widget + grounding card siap dipanggil saat intensitas emosional terasa tinggi.
                  </p>
                )
              },
              {
                id: 'understand',
                label: 'Understand',
                panel: (
                  <p className="text-body text-ink-soft">
                    Insight visual sederhana membantu melihat pola, bukan menilai atau memberikan label medis.
                  </p>
                )
              }
            ]}
          />
        </div>
      </section>

      <section className="section-wrap pb-20">
        <EmptyState
          title="Belum ada preferensi personal"
          description="Isi onboarding singkat agar CurhatIn menyesuaikan bahasa dan ritme check-in untukmu."
          action={
            <LinkButton href="/onboarding/consent" variant="primary">
              Mulai onboarding
            </LinkButton>
          }
        />
      </section>
    </>
  );
}
