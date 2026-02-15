import { useEffect, useMemo, useState } from 'react';
import { Badge, Button, GroundingCard, LoadingState, Modal, MoodPicker, Textarea, Toast } from '../components/ui';
import { getRuntimeEnv } from '../lib/runtimeEnv';

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

interface UserProfile {
  name: string;
  email: string;
}

interface JournalEntry {
  id: string;
  text: string;
  mood: string;
  createdAt: string;
}

const GUEST_MESSAGES_KEY = 'curhatin:guest:messages:v2';
const GUEST_ENTRIES_KEY = 'curhatin:guest:entries:v2';
const USER_PROFILE_KEY = 'curhatin:user:profile:v2';

const categories = [
  { id: 'general', label: 'Umum' },
  { id: 'karir', label: 'Karir' },
  { id: 'asmara', label: 'Relasi' },
  { id: 'keluarga', label: 'Keluarga' },
  { id: 'pengembangan diri', label: 'Growth' }
];

const starterMessages: ChatMessage[] = [
  {
    role: 'assistant',
    text: 'Halo, terima kasih sudah datang. Aku siap jadi ruang refleksi kamu. Mulai dari hal yang paling terasa hari ini ya.'
  }
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

function parseMessages(raw: string | null): ChatMessage[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((row): row is ChatMessage => {
      if (!row || typeof row !== 'object') return false;
      const item = row as Partial<ChatMessage>;
      return (item.role === 'user' || item.role === 'assistant') && typeof item.text === 'string';
    });
  } catch {
    return [];
  }
}

function parseProfile(raw: string | null): UserProfile | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const profile = parsed as Partial<UserProfile>;
    if (!profile.name || !profile.email) return null;
    return {
      name: profile.name.trim(),
      email: profile.email.trim().toLowerCase()
    };
  } catch {
    return null;
  }
}

function userMessagesKey(userId: string): string {
  return `curhatin:user:${userId}:messages:v2`;
}

function userEntriesKey(userId: string): string {
  return `curhatin:user:${userId}:entries:v2`;
}

function loadEntries(key: string): JournalEntry[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is JournalEntry => {
      if (!entry || typeof entry !== 'object') return false;
      const row = entry as Partial<JournalEntry>;
      return (
        typeof row.id === 'string' &&
        typeof row.text === 'string' &&
        typeof row.mood === 'string' &&
        typeof row.createdAt === 'string'
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
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shareAnonymously, setShareAnonymously] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [historyLoadedFromServer, setHistoryLoadedFromServer] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => parseProfile(window.localStorage.getItem(USER_PROFILE_KEY)));
  const [savedEntriesCount, setSavedEntriesCount] = useState<number>(0);

  const currentUserId = userProfile?.email?.trim().toLowerCase() || null;

  const storageMessagesKey = useMemo(() => {
    return currentUserId ? userMessagesKey(currentUserId) : GUEST_MESSAGES_KEY;
  }, [currentUserId]);

  const storageEntriesKey = useMemo(() => {
    return currentUserId ? userEntriesKey(currentUserId) : GUEST_ENTRIES_KEY;
  }, [currentUserId]);

  const apiBaseUrl = useMemo(
    () => normalizeBase(getRuntimeEnv('VITE_API_URL') ?? (import.meta.env.VITE_API_URL as string | undefined)),
    []
  );
  const chatEndpoint = useMemo(() => buildApiEndpoint(apiBaseUrl, '/api/chat'), [apiBaseUrl]);
  const chatHistoryEndpoint = useMemo(() => buildApiEndpoint(apiBaseUrl, '/api/chat/history'), [apiBaseUrl]);

  useEffect(() => {
    const localMessages = parseMessages(window.localStorage.getItem(storageMessagesKey));
    if (localMessages.length > 0) {
      setMessages(localMessages);
    } else {
      setMessages(starterMessages);
    }

    const entries = loadEntries(storageEntriesKey);
    setSavedEntriesCount(entries.length);
    setHistoryLoadedFromServer(false);
  }, [storageEntriesKey, storageMessagesKey]);

  useEffect(() => {
    window.localStorage.setItem(storageMessagesKey, JSON.stringify(messages.slice(-100)));
  }, [messages, storageMessagesKey]);

  useEffect(() => {
    const userId = currentUserId ?? '';
    if (!userId) return;

    let cancelled = false;
    async function loadHistory() {
      try {
        const response = await fetch(
          `${chatHistoryEndpoint}?user_id=${encodeURIComponent(userId)}&limit=30`
        );
        if (!response.ok) return;

        const payload = (await response.json()) as { messages?: ChatPayloadMessage[] };
        if (cancelled || !Array.isArray(payload.messages)) return;

        const serverMessages: ChatMessage[] = payload.messages
          .map((row): ChatMessage => ({
            role: row.role === 'assistant' ? 'assistant' : 'user',
            text: row.content ?? ''
          }))
          .filter((row) => row.text.trim().length > 0);

        if (serverMessages.length > 0) {
          setMessages(serverMessages.slice(-100));
          setHistoryLoadedFromServer(true);
        }
      } catch {
        // Fallback to local storage only
      }
    }

    void loadHistory();
    return () => {
      cancelled = true;
    };
  }, [chatHistoryEndpoint, currentUserId]);

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

    const nextEntries = [entry, ...loadEntries(storageEntriesKey)].slice(0, 500);
    window.localStorage.setItem(storageEntriesKey, JSON.stringify(nextEntries));
    setSavedEntriesCount(nextEntries.length);
    setToastMessage(currentUserId ? 'Jurnal tersimpan di akun ini.' : 'Jurnal tersimpan lokal sebagai guest.');
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

    const history: ChatPayloadMessage[] = messages.slice(-12).map((message) => ({
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
          conversation_history: history,
          user_id: currentUserId ?? undefined,
          share_anonymously: shareAnonymously
        })
      });

      const body = (await response.json()) as ChatResponseBody;
      if (!response.ok) {
        throw new Error(body.error ?? `HTTP ${response.status}`);
      }
      if (body.error) {
        throw new Error(body.error);
      }

      const assistantText = body.response?.trim() || 'Aku mendengarmu. Terima kasih sudah berbagi.';
      setMessages((prev) => [...prev, { role: 'assistant', text: assistantText }]);
      if (currentUserId) {
        setToastMessage('Chat tersimpan sebagai konteks akunmu.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? `Gagal menghubungi AI: ${error.message}` : 'Gagal menghubungi AI.');
      setJournalInput(userText);
    } finally {
      setIsLoading(false);
    }
  }

  function submitLogin() {
    const name = loginName.trim();
    const email = loginEmail.trim().toLowerCase();
    if (!name || !email || !email.includes('@')) {
      setErrorMessage('Nama dan email valid diperlukan untuk login.');
      return;
    }

    const profile: UserProfile = { name, email };
    window.localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    setUserProfile(profile);
    setShowLoginModal(false);
    setLoginName('');
    setLoginEmail('');
    setToastMessage('Login berhasil. Riwayat chat akun dimuat otomatis.');
    setErrorMessage(null);
  }

  function logout() {
    window.localStorage.removeItem(USER_PROFILE_KEY);
    setUserProfile(null);
    setToastMessage('Kembali ke mode anonymous.');
    setErrorMessage(null);
    setHistoryLoadedFromServer(false);
  }

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-[24px] border-base border-border bg-gradient-to-br from-[#edf8ef] via-[#e6f4ea] to-[#d7eedf] p-5 md:p-6">
        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/45 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#8bc8a0]/25 blur-3xl" />

        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-h5 font-extrabold">Konsultasi AI Assistant CurhatIn</p>
              <p className="text-caption text-ink-soft">
                Cerita dengan bahasa sehari-hari. Anonymous default, login opsional untuk simpan konteks.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">AI by consent</Badge>
              <Badge tone="success">{currentUserId ? 'Mode Login' : 'Mode Anonymous'}</Badge>
            </div>
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

          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="rounded-[20px] border-base border-border bg-paper/90 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-label font-semibold">Percakapan</p>
                {historyLoadedFromServer ? (
                  <span className="text-[11px] font-semibold text-success">Context loaded from account history</span>
                ) : null}
              </div>

              <div className="space-y-2">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-body ${
                        message.role === 'user'
                          ? 'bg-ink text-paper'
                          : 'border-base border-border bg-white/90 text-ink'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isLoading ? <LoadingState label="AI sedang menyusun refleksi..." /> : null}
              </div>
            </div>

            <div className="space-y-3 rounded-[20px] border-base border-border bg-paper/90 p-4">
              <div>
                <p className="text-label font-semibold">Identitas</p>
                <p className="text-caption text-muted">
                  {currentUserId
                    ? `Login sebagai ${userProfile?.name} (${currentUserId})`
                    : 'Sedang chat sebagai anonymous guest'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentUserId ? (
                  <Button variant="secondary" onClick={logout}>
                    Logout
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => setShowLoginModal(true)}>
                    Login untuk simpan konteks
                  </Button>
                )}
              </div>

              <div className="border-t-base border-border pt-3">
                <p className="text-label font-semibold">Daily Check-in</p>
                <p className="text-caption text-muted">Mood + jurnal disimpan sesuai mode aktif.</p>
                <div className="mt-2">
                  <MoodPicker onSelect={setMood} />
                </div>
                <p className="mt-2 text-caption text-muted">
                  Entri tersimpan: <strong>{savedEntriesCount}</strong>
                </p>
              </div>

              <label className="flex items-start gap-2 rounded-xl border-base border-border bg-bg/70 p-3">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={shareAnonymously}
                  onChange={(event) => setShareAnonymously(event.target.checked)}
                />
                <span className="text-caption text-ink-soft">
                  Bagikan anonim untuk knowledge base komunitas agar jadi referensi refleksi user lain.
                </span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border-base border-border bg-paper/90 p-5">
        <div className="space-y-3">
          <Textarea
            id="chat-input"
            label="Tulis jurnal / pesan refleksi"
            placeholder="Contoh: Hari ini aku merasa capek tapi masih berusaha hadir..."
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
            AI tetap OFF by default. AI hanya memproses pesan setelah kamu menekan Reflect dan menyetujui consent.
          </p>
          {toastMessage ? <Toast message={toastMessage} tone="success" /> : null}
          {errorMessage ? <Toast message={errorMessage} tone="error" /> : null}
        </div>
      </section>

      <GroundingCard />

      <Modal
        open={showConsentModal}
        title="Konfirmasi Reflect with AI"
        description="Data dikirim sementara untuk diproses AI reflektif."
        onClose={() => setShowConsentModal(false)}
      >
        <div className="space-y-4">
          <p className="text-body">
            Data jurnal ini akan dikirim sementara ke AI. AI tidak untuk diagnosis medis, hanya untuk refleksi dan pertanyaan balik.
          </p>
          <div className="rounded-md border-base border-border bg-bg p-3 text-caption text-ink-soft">
            <p className="font-semibold text-ink">Pratinjau data:</p>
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

      <Modal
        open={showLoginModal}
        title="Login untuk simpan konteks chat"
        description="Guest tetap tersedia. Login ini untuk menyimpan memory chat per akun."
        onClose={() => setShowLoginModal(false)}
      >
        <div className="space-y-4">
          <label className="flex flex-col gap-2">
            <span className="text-caption font-semibold">Nama</span>
            <input
              className="rounded-md border-base border-border bg-paper px-3 py-2"
              value={loginName}
              onChange={(event) => setLoginName(event.target.value)}
              placeholder="Nama kamu"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-caption font-semibold">Email</span>
            <input
              className="rounded-md border-base border-border bg-paper px-3 py-2"
              type="email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              placeholder="nama@email.com"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
              Batal
            </Button>
            <Button onClick={submitLogin}>Masuk</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
