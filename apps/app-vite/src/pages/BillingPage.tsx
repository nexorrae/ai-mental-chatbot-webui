import { useState } from 'react';
import { Badge, Button, Modal, OutlinedCard } from '../components/ui';

export function BillingPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <OutlinedCard>
        <h1 className="text-h4 font-extrabold">Billing & Subscription</h1>
        <p className="text-body text-ink-soft">Kelola paket langganan dan metode pembayaran.</p>
      </OutlinedCard>

      <div className="grid gap-4 md:grid-cols-3">
        <OutlinedCard className="space-y-3">
          <Badge tone="accent">Aktif</Badge>
          <h2 className="text-h6 font-bold">Calm Plus</h2>
          <p className="text-body text-ink-soft">Rp79.000/bulan</p>
          <Button variant="secondary" onClick={() => setOpen(true)}>Ubah paket</Button>
        </OutlinedCard>
        <OutlinedCard className="space-y-3">
          <h2 className="text-h6 font-bold">Metode bayar</h2>
          <p className="text-body text-ink-soft">Visa **** 1024</p>
          <Button variant="secondary">Kelola kartu</Button>
        </OutlinedCard>
        <OutlinedCard className="space-y-3">
          <h2 className="text-h6 font-bold">Riwayat tagihan</h2>
          <p className="text-body text-ink-soft">3 invoice terakhir tersedia.</p>
          <Button variant="secondary">Unduh invoice</Button>
        </OutlinedCard>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Ganti paket" description="Perubahan berlaku di periode berikutnya.">
        <div className="space-y-3">
          <Button variant="primary" fullWidth onClick={() => setOpen(false)}>
            Upgrade ke Care Team
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setOpen(false)}>
            Downgrade ke Calm Start
          </Button>
        </div>
      </Modal>
    </div>
  );
}
