import { Link } from 'react-router-dom';
import { Badge, OutlinedCard } from '../components/ui';

export function AdminOverviewPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <OutlinedCard className="space-y-2">
          <Badge tone="accent">Users</Badge>
          <p className="text-h4 font-semibold tracking-tight">12.480</p>
          <p className="text-caption text-muted">Pengguna aktif bulanan</p>
        </OutlinedCard>
        <OutlinedCard className="space-y-2">
          <Badge tone="warn">Safety</Badge>
          <p className="text-h4 font-semibold tracking-tight">34</p>
          <p className="text-caption text-muted">Escalation minggu ini</p>
        </OutlinedCard>
        <OutlinedCard className="space-y-2">
          <Badge tone="success">Stability</Badge>
          <p className="text-h4 font-semibold tracking-tight">99.92%</p>
          <p className="text-caption text-muted">Uptime 30 hari</p>
        </OutlinedCard>
      </div>

      <OutlinedCard className="space-y-3">
        <h2 className="text-h6 font-semibold tracking-tight">Content Workflow</h2>
        <p className="text-body text-ink-soft">
          Tambah dan publish artikel wellness untuk landing page melalui admin article CMS.
        </p>
        <Link
          to="/admin/articles"
          className="inline-flex h-9 items-center rounded-md border border-[#191919] bg-[#191919] px-4 text-button font-medium text-white hover:bg-black"
        >
          Buka Article CMS
        </Link>
      </OutlinedCard>
    </div>
  );
}
