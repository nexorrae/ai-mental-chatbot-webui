import { Badge, LoadingState, OutlinedCard } from '../components/ui';

export function NotificationsPage() {
  return (
    <div className="space-y-4">
      <OutlinedCard>
        <h1 className="text-h4 font-semibold tracking-tight">Notifications</h1>
        <p className="text-body text-ink-soft">Atur pengingat check-in agar ritmemu konsisten.</p>
      </OutlinedCard>

      <div className="space-y-3">
        <OutlinedCard className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold">Pengingat malam</p>
            <p className="text-caption text-muted">20:30 WIB, setiap hari</p>
          </div>
          <Badge tone="accent">Aktif</Badge>
        </OutlinedCard>

        <OutlinedCard className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold">Ringkasan mingguan</p>
            <p className="text-caption text-muted">Minggu pagi</p>
          </div>
          <Badge>Aktif</Badge>
        </OutlinedCard>

        <LoadingState label="Menyinkronkan preferensi notifikasi..." />
      </div>
    </div>
  );
}
