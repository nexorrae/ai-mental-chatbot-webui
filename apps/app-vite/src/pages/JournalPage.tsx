import { useState } from 'react';
import {
  Button,
  JournalEntryCard,
  Modal,
  OutlinedCard,
  Textarea,
  Toast
} from '../components/ui';

export function JournalPage() {
  const [openModal, setOpenModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="space-y-4">
      <OutlinedCard className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-h4 font-extrabold">Journal</h1>
          <p className="text-body text-ink-soft">Tulis entri singkat harian untuk melihat pola yang berulang.</p>
        </div>
        <Button variant="primary" onClick={() => setOpenModal(true)}>
          Entri baru
        </Button>
      </OutlinedCard>

      <div className="grid gap-4 md:grid-cols-2">
        <JournalEntryCard />
        <JournalEntryCard
          title="Catatan sore"
          mood="Cemas"
          content="Sore ini pikiranku ramai, tapi setelah napas 1 menit rasanya lebih stabil."
        />
      </div>

      {showToast && <Toast message="Entri disimpan." tone="success" />}

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Buat entri jurnal"
        description="Tidak perlu panjang. Cukup jujur dan ringkas."
      >
        <div className="space-y-3">
          <Textarea id="journal-entry" label="Isi entri" placeholder="Hari ini aku merasa..." />
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={() => {
                setOpenModal(false);
                setShowToast(true);
                window.setTimeout(() => setShowToast(false), 2500);
              }}
            >
              Simpan
            </Button>
            <Button variant="secondary" onClick={() => setOpenModal(false)}>
              Batal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
