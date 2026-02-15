import { InsightsChartCard, OutlinedCard } from '../components/ui';

export function AdminReportsPage() {
  return (
    <div className="space-y-4">
      <OutlinedCard>
        <h1 className="text-h4 font-semibold tracking-tight">Reports</h1>
        <p className="text-body text-ink-soft">Ringkasan penggunaan anonymized untuk evaluasi produk.</p>
      </OutlinedCard>
      <InsightsChartCard />
    </div>
  );
}
