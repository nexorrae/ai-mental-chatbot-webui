import { Button, OutlinedCard, Select } from '../components/ui';

export function AdminSettingsPage() {
  return (
    <OutlinedCard className="space-y-4">
      <h1 className="text-h4 font-extrabold">Admin Settings</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          id="admin-retention"
          label="Data retention policy"
          options={[
            { value: '90d', label: '90 days' },
            { value: '180d', label: '180 days' },
            { value: '365d', label: '365 days' }
          ]}
          defaultValue="90d"
        />
        <Select
          id="admin-safety"
          label="Safety escalation threshold"
          options={[
            { value: 'strict', label: 'Strict' },
            { value: 'balanced', label: 'Balanced' },
            { value: 'relaxed', label: 'Relaxed' }
          ]}
          defaultValue="strict"
        />
      </div>
      <Button variant="primary">Simpan konfigurasi</Button>
    </OutlinedCard>
  );
}
