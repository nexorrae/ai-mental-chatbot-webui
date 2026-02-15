import { MoodPicker, OutlinedCard, InsightsChartCard } from '../components/ui';

export function MoodPage() {
  return (
    <div className="space-y-4">
      <OutlinedCard className="space-y-3">
        <h1 className="text-h4 font-extrabold">Mood Tracker</h1>
        <p className="text-body text-ink-soft">Check-in cepat untuk menangkap kondisi emosi hari ini.</p>
        <MoodPicker />
      </OutlinedCard>
      <InsightsChartCard />
    </div>
  );
}
