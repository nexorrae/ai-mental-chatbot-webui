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
        <h1 className="text-h4 font-semibold tracking-tight">Settings</h1>

        <div className="grid gap-4 sm:grid-cols-2">
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

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            variant="primary"
            className="w-full sm:w-auto"
            onClick={() => {
              setToast(true);
              window.setTimeout(() => setToast(false), 2500);
            }}
          >
            Simpan preferensi
          </Button>
          <Button variant="secondary" className="w-full sm:w-auto">Export data</Button>
          <Button variant="secondary" className="w-full sm:w-auto">Delete data</Button>
        </div>
        {toast && <Toast tone="success" message="Pengaturan tersimpan." />}
      </OutlinedCard>

      <OutlinedCard className="space-y-2">
        <h2 className="text-h6 font-semibold tracking-tight">Safety notice</h2>
        <p className="text-body text-ink-soft">
          Jika kamu merasa tidak aman, hubungi bantuan profesional atau nomor darurat setempat.
        </p>
        <a
          href="https://www.who.int/teams/mental-health-and-substance-use/suicide-data"
          className="text-caption font-medium underline decoration-dotted underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          Lihat sumber bantuan krisis
        </a>
      </OutlinedCard>
    </div>
  );
}
