import { useState } from 'react';
import {
  Button,
  ChatBubbleSet,
  GroundingCard,
  OutlinedCard,
  Tabs,
  Textarea,
  Toast
} from '../components/ui';

export function ChatPage() {
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="space-y-4">
      <OutlinedCard className="space-y-3">
        <h1 className="text-h4 font-extrabold">Chat Refleksi</h1>
        <p className="text-body text-ink-soft">Gunakan bahasa yang nyaman untukmu. Tidak ada jawaban yang "salah".</p>
        <Tabs
          items={[
            {
              id: 'general',
              label: 'Umum',
              panel: <ChatBubbleSet />
            },
            {
              id: 'karir',
              label: 'Karir',
              panel: (
                <ChatBubbleSet
                  messages={[
                    { role: 'assistant', text: 'Hal apa di pekerjaan yang paling bikin penuh belakangan ini?' },
                    { role: 'user', text: 'Deadline numpuk dan aku merasa stuck.' }
                  ]}
                />
              )
            },
            {
              id: 'asmara',
              label: 'Relasi',
              panel: (
                <ChatBubbleSet
                  messages={[
                    { role: 'assistant', text: 'Kamu bisa mulai dari cerita yang paling ringan dulu.' },
                    { role: 'user', text: 'Aku takut salah ngomong ke pasangan.' }
                  ]}
                />
              )
            }
          ]}
        />
      </OutlinedCard>

      <OutlinedCard className="space-y-3">
        <Textarea id="chat-input" label="Tulis pesan" placeholder="Ceritakan pelan-pelan..." />
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setShowToast(true);
              window.setTimeout(() => setShowToast(false), 2500);
            }}
          >
            Kirim
          </Button>
          <Button variant="secondary">Simpan ke jurnal</Button>
        </div>
        {showToast && <Toast message="Pesan terkirim." tone="success" />}
      </OutlinedCard>

      <GroundingCard />
    </div>
  );
}
