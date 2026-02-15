import { Button, EmptyState, OutlinedCard } from '../components/ui';

export function HistoryPage() {
  return (
    <div className="space-y-4">
      <OutlinedCard>
        <h1 className="text-h4 font-extrabold">Conversation History</h1>
        <p className="text-body text-ink-soft">Riwayat percakapan tersusun per tanggal agar mudah ditinjau.</p>
      </OutlinedCard>

      <EmptyState
        title="Belum ada riwayat untuk minggu ini"
        description="Mulai chat baru untuk melihat ringkasan percakapan otomatis di sini."
        action={<Button variant="primary">Mulai chat baru</Button>}
      />
    </div>
  );
}
