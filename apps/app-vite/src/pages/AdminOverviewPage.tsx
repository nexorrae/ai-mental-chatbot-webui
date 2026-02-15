import { Badge, OutlinedCard } from '../components/ui';

export function AdminOverviewPage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <OutlinedCard className="space-y-2">
        <Badge tone="accent">Users</Badge>
        <p className="text-h4 font-extrabold">12.480</p>
        <p className="text-caption text-muted">Pengguna aktif bulanan</p>
      </OutlinedCard>
      <OutlinedCard className="space-y-2">
        <Badge tone="warn">Safety</Badge>
        <p className="text-h4 font-extrabold">34</p>
        <p className="text-caption text-muted">Escalation minggu ini</p>
      </OutlinedCard>
      <OutlinedCard className="space-y-2">
        <Badge tone="success">Stability</Badge>
        <p className="text-h4 font-extrabold">99.92%</p>
        <p className="text-caption text-muted">Uptime 30 hari</p>
      </OutlinedCard>
    </div>
  );
}
