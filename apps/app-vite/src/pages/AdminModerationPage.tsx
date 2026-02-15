import { Accordion, OutlinedCard } from '../components/ui';

export function AdminModerationPage() {
  return (
    <div className="space-y-4">
      <OutlinedCard>
        <h1 className="text-h4 font-semibold tracking-tight">Moderation Queue</h1>
        <p className="text-body text-ink-soft">Tinjau flag percakapan berisiko tinggi sesuai policy safety.</p>
      </OutlinedCard>

      <Accordion
        items={[
          {
            id: 'm1',
            title: 'Case #2451 - Intensitas emosi tinggi',
            content: <p>Direkomendasikan menampilkan grounding card + safety resource prompt.</p>
          },
          {
            id: 'm2',
            title: 'Case #2450 - Potensi self-harm mention',
            content: <p>Escalation flow aktif, tampilkan info bantuan darurat setempat secara prioritas.</p>
          }
        ]}
      />
    </div>
  );
}
