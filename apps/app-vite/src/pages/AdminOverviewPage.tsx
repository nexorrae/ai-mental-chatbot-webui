import { Link } from 'react-router-dom';
import { Badge, OutlinedCard } from '../components/ui';

export function AdminOverviewPage() {
  return (
    <div className="space-y-4">
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

      <OutlinedCard className="space-y-3">
        <h2 className="text-h6 font-bold">Content Workflow</h2>
        <p className="text-body text-ink-soft">
          Tambah dan publish artikel wellness untuk landing page melalui admin article CMS.
        </p>
        <Link
          to="/admin/articles"
          className="inline-flex items-center rounded-pill border-base border-border bg-ink px-5 py-2.5 text-button font-semibold text-paper transition hover:translate-y-[-1px]"
        >
          Buka Article CMS
        </Link>
      </OutlinedCard>
    </div>
  );
}
