import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  ChatBubbleSet,
  GroundingCard,
  LoadingState,
  Modal,
  MoodPicker,
  OutlinedCard,
  Textarea,
  Toast
} from '../components/ui';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  text: string;
}

interface ChatPayloadMessage {
  role: string;
  content: string;
}

interface ChatResponseBody {
  response?: string;
  error?: string;
}

interface JournalEntry {
  id: string;
  text: string;
  mood: string;
  createdAt: string;
}

const JOURNAL_STORAGE_KEY = 'curhatin:journal_entries';

const categories = [
  { id: 'general', label: 'Umum' },
  { id: 'karir', label: 'Karir' },
  { id: 'asmara', label: 'Relasi' },
  { id: 'keluarga', label: 'Keluarga' },
  { id: 'pengembangan diri', label: 'Pengembangan Diri' }
];

function normalizeBase(raw?: string): string {
  return (raw ?? '').trim().replace(/\/+$/, '');
}

function buildApiEndpoint(baseUrl: string, path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (!baseUrl) return normalizedPath;
  if (baseUrl.endsWith('/api') && normalizedPath.startsWith('/api/')) {
    return `${baseUrl}${normalizedPath.slice(4)}`;
  }
  return `${baseUrl}${normalizedPath}`;
}

function loadJournalEntries(): JournalEntry[] {
  try {
    const raw = window.localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is JournalEntry => {
      if (!entry || typeof entry !== 'object') return false;
      const candidate = entry as Partial<JournalEntry>;
      return (
        typeof candidate.id === 'string' &&
        typeof candidate.text === 'string' &&
        typeof candidate.mood === 'string' &&
        typeof candidate.createdAt === 'string'
      );
    });
  } catch {
    return [];
  }
}

export function ChatPage() {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [mood, setMood] = useState('Tenang');
  const [journalInput, setJournalInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Halo, terima kasih sudah datang. Apa yang sedang paling terasa hari ini?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedEntriesCount, setSavedEntriesCount] = useState<number>(() => loadJournalEntries().length);

  const chatEndpoint = useMemo(() => {
    const baseUrl = normalizeBase(import.meta.env.VITE_API_URL as string | undefined);
    return buildApiEndpoint(baseUrl, '/api/chat');
  }, []);

  function saveJournalLocally() {
    const text = journalInput.trim();
    if (!text) {
      setErrorMessage('Tulis jurnal dulu sebelum disimpan.');
      setToastMessage(null);
      return;
    }

    const entry: JournalEntry = {
      id: `entry-${Date.now()}`,
      text,
      mood,
      createdAt: new Date().toISOString()
    };

    const nextEntries = [entry, ...loadJournalEntries()].slice(0, 200);
    window.localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(nextEntries));
    setSavedEntriesCount(nextEntries.length);
    setToastMessage('Catatan tersimpan lokal di perangkat ini.');
    setErrorMessage(null);
  }

  function startReflectFlow() {
    if (!journalInput.trim()) {
      setErrorMessage('Tulis jurnal dulu, lalu lanjutkan ke Reflect with AI.');
      setToastMessage(null);
      return;
    }
    setErrorMessage(null);
    setShowConsentModal(true);
  }

  async function submitReflectRequest() {
    const userText = journalInput.trim();
    if (!userText || isLoading) return;

    setShowConsentModal(false);
    setIsLoading(true);
    setErrorMessage(null);
    setToastMessage(null);

    const history: ChatPayloadMessage[] = messages.map((message) => ({
      role: message.role,
      content: message.text
    }));

    const userMessage: ChatMessage = { role: 'user', text: userText };
    setMessages((prev) => [...prev, userMessage]);
    setJournalInput('');

    try {
      const response = await fetch(chatEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userText,
          category: selectedCategory,
          conversation_history: history
        })
      });

      let body: ChatResponseBody = {};
      try {
        body = (await response.json()) as ChatResponseBody;
      } catch {
        body = {};
      }

      if (!response.ok) {
        throw new Error(body.error ?? `HTTP ${response.status}`);
      }
      if (body.error) {
        throw new Error(body.error);
      }

      const assistantText = body.response?.trim() || 'Aku mendengarmu. Terima kasih sudah berbagi.';
      setMessages((prev) => [...prev, { role: 'assistant', text: assistantText }]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? `Gagal menghubungi AI: ${error.message}` : 'Gagal menghubungi AI.');
      setJournalInput(userText);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <OutlinedCard className="space-y-3">
        <h1 className="text-h4 font-extrabold">Chat Refleksi</h1>
        <p className="text-body text-ink-soft">
          AI tetap <strong>OFF by default</strong>. Refleksi AI hanya berjalan saat kamu menekan tombol
          <strong> Reflect with AI</strong> dan menyetujui konfirmasi kirim data.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge tone="accent">Guest mode first</Badge>
          <Badge>Local-first</Badge>
          <Badge tone="success">Stateless AI</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'secondary'}
              className="px-4 py-2 text-caption"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
        <OutlinedCard>
          <ChatBubbleSet messages={messages} />
          {isLoading ? <div className="mt-3"><LoadingState label="AI sedang merefleksikan jurnalmu..." /></div> : null}
        </OutlinedCard>
      </OutlinedCard>

      <OutlinedCard className="space-y-3">
        <h2 className="text-h6 font-bold">Daily Check-in (Local First)</h2>
        <MoodPicker onSelect={setMood} />
        <Textarea
          id="chat-input"
          label="Tulis jurnal"
          placeholder="Ceritakan pelan-pelan..."
          value={journalInput}
          onChange={(event) => setJournalInput(event.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={saveJournalLocally} disabled={isLoading}>
            Simpan Lokal
          </Button>
          <Button onClick={startReflectFlow} disabled={!journalInput.trim() || isLoading}>
            Reflect with AI
          </Button>
        </div>
        <p className="text-caption text-muted">
          Data jurnal tersimpan lokal secara default. Tombol Reflect akan meminta konfirmasi kirim data ke AI per request.
        </p>
        <p className="text-caption text-muted">Entri lokal tersimpan: {savedEntriesCount}</p>
        {toastMessage ? <Toast message={toastMessage} tone="success" /> : null}
        {errorMessage ? <Toast message={errorMessage} tone="error" /> : null}
      </OutlinedCard>

      <GroundingCard />

      <Modal
        open={showConsentModal}
        title="Konfirmasi Reflect with AI"
        description="AI opsional dan hanya aktif atas trigger sadar kamu."
        onClose={() => setShowConsentModal(false)}
      >
        <div className="space-y-4">
          <p className="text-body">
            Data jurnal ini akan dikirim sementara untuk diproses AI. Respons AI bersifat reflektif, bukan diagnosis medis.
          </p>
          <div className="rounded-md border-base border-border bg-bg p-3 text-caption text-ink-soft">
            <p className="font-semibold text-ink">Pratinjau data yang akan dikirim:</p>
            <p className="mt-1 whitespace-pre-wrap">{journalInput.trim()}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setShowConsentModal(false)}>
              Batal
            </Button>
            <Button onClick={() => void submitReflectRequest()} disabled={isLoading}>
              Setuju, Kirim ke AI
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
