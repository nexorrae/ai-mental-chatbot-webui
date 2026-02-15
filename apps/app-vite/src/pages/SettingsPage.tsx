import { useState } from 'react';
import {
  Button,
  OutlinedCard,
  Select,
  Toast
} from '../components/ui';

export function SettingsPage() {
  const [toast, setToast] = useState(false);

  return (
    <div className="space-y-4">
      <OutlinedCard className="space-y-4">
        <h1 className="text-h4 font-extrabold">Settings</h1>

        <div className="grid gap-4 md:grid-cols-2">
          <Select
            id="settings-privacy"
            label="Data sharing"
            options={[
              { value: 'minimal', label: 'Minimal (recommended)' },
              { value: 'standard', label: 'Standard' }
            ]}
            defaultValue="minimal"
          />
          <Select
            id="settings-retention"
            label="Retensi data"
            options={[
              { value: '90d', label: '90 hari' },
              { value: '180d', label: '180 hari' },
              { value: 'manual', label: 'Manual' }
            ]}
            defaultValue="90d"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            onClick={() => {
              setToast(true);
              window.setTimeout(() => setToast(false), 2500);
            }}
          >
            Simpan preferensi
          </Button>
          <Button variant="secondary">Export data</Button>
          <Button variant="secondary">Delete data</Button>
        </div>
        {toast && <Toast tone="success" message="Pengaturan tersimpan." />}
      </OutlinedCard>

      <OutlinedCard className="space-y-2">
        <h2 className="text-h6 font-bold">Safety notice</h2>
        <p className="text-body text-ink-soft">
          Jika kamu merasa tidak aman, hubungi bantuan profesional atau nomor darurat setempat.
        </p>
        <a
          href="https://www.who.int/teams/mental-health-and-substance-use/suicide-data"
          className="text-caption font-semibold underline"
          target="_blank"
          rel="noreferrer"
        >
          Lihat sumber bantuan krisis
        </a>
      </OutlinedCard>
    </div>
  );
}
