import { OutlinedCard, Tabs, InsightsChartCard } from '../components/ui';

export function InsightsPage() {
  return (
    <div className="space-y-4">
      <OutlinedCard className="space-y-3">
        <h1 className="text-h4 font-semibold tracking-tight">Insights</h1>
        <p className="text-body text-ink-soft">Lihat pola perilaku dan emosi tanpa label diagnosis.</p>
      </OutlinedCard>

      <Tabs
        items={[
          {
            id: 'patterns',
            label: 'Patterns',
            panel: <InsightsChartCard />
          },
          {
            id: 'triggers',
            label: 'Triggers',
            panel: (
              <ul className="list-disc space-y-1 pl-5 text-body text-ink-soft">
                <li>Jam lembur berkorelasi dengan kecemasan malam.</li>
                <li>Jeda napas 1 menit membantu menurunkan intensitas chat.</li>
                <li>Jurnal sebelum tidur memperbaiki mood esok pagi.</li>
              </ul>
            )
          },
          {
            id: 'recommendation',
            label: 'Reflection',
            panel: <p className="text-body text-ink-soft">Fokus minggu ini: pertahankan rutinitas check-in malam 5 menit.</p>
          }
        ]}
      />
    </div>
  );
}
