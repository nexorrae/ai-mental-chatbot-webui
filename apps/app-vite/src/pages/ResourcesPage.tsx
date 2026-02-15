import { Accordion, OutlinedCard } from '../components/ui';

export function ResourcesPage() {
  return (
    <div className="space-y-4">
      <OutlinedCard>
        <h1 className="text-h4 font-semibold tracking-tight">Resources</h1>
        <p className="text-body text-ink-soft">Daftar sumber bacaan dan latihan ringan untuk dukung refleksi harian.</p>
      </OutlinedCard>

      <Accordion
        items={[
          {
            id: 'breathing',
            title: 'Latihan napas singkat',
            content: <p>Gunakan pola 4-4-6 selama 1 menit saat merasa penuh.</p>
          },
          {
            id: 'grounding',
            title: 'Grounding 5-4-3-2-1',
            content: <p>Teknik untuk kembali hadir di momen kini ketika pikiran terasa melompat.</p>
          },
          {
            id: 'crisis',
            title: 'Bantuan krisis',
            content: <p>Jika kamu merasa tidak aman, segera hubungi profesional atau nomor darurat setempat.</p>
          }
        ]}
      />
    </div>
  );
}
