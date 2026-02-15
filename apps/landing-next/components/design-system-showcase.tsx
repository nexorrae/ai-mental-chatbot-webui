'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  ChatBubbleSet,
  EmptyState,
  GroundingCard,
  Input,
  InsightsChartCard,
  JournalEntryCard,
  LoadingState,
  Modal,
  MoodPicker,
  OutlinedCard,
  Select,
  Tabs,
  Textarea,
  Toast
} from './ui';

export function DesignSystemShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-h4 font-bold">Token warna</h2>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { name: 'Ink', className: 'bg-ink text-paper' },
            { name: 'Paper', className: 'bg-paper text-ink border' },
            { name: 'BG', className: 'bg-bg text-ink border' },
            { name: 'Muted', className: 'bg-muted text-paper' },
            { name: 'Border', className: 'bg-border text-paper' },
            { name: 'Accent', className: 'bg-accent text-ink border' }
          ].map((token) => (
            <div key={token.name} className={`rounded-md border-base border-border px-3 py-8 text-center text-caption font-semibold ${token.className}`}>
              {token.name}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-h4 font-bold">Button + Badge</h2>
        <OutlinedCard className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge tone="accent">Accent</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warn">Warn</Badge>
            <Badge tone="error">Error</Badge>
          </div>
        </OutlinedCard>
      </section>

      <section className="space-y-3">
        <h2 className="text-h4 font-bold">Form Elements</h2>
        <OutlinedCard className="grid gap-4 md:grid-cols-2">
          <Input id="demo-name" label="Nama" placeholder="Nama" />
          <Select
            id="demo-select"
            label="Pilih"
            options={[
              { value: '1', label: 'Pilihan 1' },
              { value: '2', label: 'Pilihan 2' }
            ]}
          />
          <div className="md:col-span-2">
            <Textarea id="demo-textarea" label="Catatan" placeholder="Tulis sesuatu..." />
          </div>
        </OutlinedCard>
      </section>

      <section className="space-y-3">
        <h2 className="text-h4 font-bold">Tabs + Modal + Toast</h2>
        <Tabs
          items={[
            {
              id: 'states',
              label: 'Interaction Notes',
              panel: (
                <ul className="list-disc space-y-1 pl-5 text-body text-ink-soft">
                  <li>Hover: latar accent ringan, tetap high-contrast.</li>
                  <li>Focus: ring tebal dan terlihat jelas pada keyboard navigation.</li>
                  <li>Empty: tampilkan empty state + grounding card.</li>
                  <li>Loading: gunakan indikator sederhana tanpa animasi berlebihan.</li>
                </ul>
              )
            },
            {
              id: 'feedback',
              label: 'Feedback',
              panel: (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => setModalOpen(true)}>
                      Buka modal
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setShowToast(true);
                        window.setTimeout(() => setShowToast(false), 3000);
                      }}
                    >
                      Tampilkan toast
                    </Button>
                  </div>
                  {showToast && <Toast message="Perubahan disimpan." tone="success" />}
                </div>
              )
            }
          ]}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-h4 font-bold">Mental Wellness Components</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <GroundingCard />
          <OutlinedCard className="space-y-4">
            <p className="text-caption font-bold uppercase tracking-wide">Mood Picker</p>
            <MoodPicker />
          </OutlinedCard>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-h4 font-bold">App Components</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <JournalEntryCard />
          <InsightsChartCard />
          <OutlinedCard className="md:col-span-2">
            <ChatBubbleSet />
          </OutlinedCard>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-h4 font-bold">Empty + Loading</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <EmptyState
            title="Belum ada data"
            description="Mulai jurnal pertama untuk melihat insight pola emosimu."
            action={<Button variant="primary">Buat entri</Button>}
          />
          <LoadingState />
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Konfirmasi tindakan"
        description="Kamu bisa selalu kembali mengubah ini di Settings."
      >
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => setModalOpen(false)}>
            Lanjutkan
          </Button>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Batal
          </Button>
        </div>
      </Modal>
    </div>
  );
}
