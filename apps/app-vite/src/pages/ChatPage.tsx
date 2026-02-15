import { type KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge, Button, GroundingCard, LoadingState, Modal, MoodPicker, Textarea, Toast } from '../components/ui';
import { getRuntimeEnv } from '../lib/runtimeEnv';
import {
  createThread,
  loadThreads,
  saveThreads,
  STARTER_ASSISTANT_MESSAGE,
  titleFromMessage,
  type ChatMessage,
  type ConversationThread
} from '../lib/chatStorage';

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

const USER_PROFILE_KEY = 'curhatin:user:profile:v2';
const GUEST_MESSAGES_LEGACY_KEY = 'curhatin:guest:messages:v2';
const GUEST_ENTRIES_KEY = 'curhatin:guest:entries:v2';

const categories = [
  { id: 'general', label: 'Umum' },
  { id: 'karir', label: 'Karir' },
  { id: 'asmara', label: 'Relasi' },
  { id: 'keluarga', label: 'Keluarga' },
  { id: 'pengembangan diri', label: 'Growth' }
];

const quickPrompts = [
  'Aku lagi cemas dan butuh ditenangkan dulu.',
  'Hari ini aku capek banget tapi sulit cerita.',
  'Bantu aku merangkum perasaanku hari ini.',
  'Aku butuh pertanyaan refleksi sebelum tidur.'
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

function parseLegacyMessages(raw: string | null): ChatMessage[] {
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

function legacyMessagesKey(userId: string | null): string {
  return userId ? `curhatin:user:${userId}:messages:v2` : GUEST_MESSAGES_LEGACY_KEY;
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

function formatUpdatedAt(value: string): string {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(time));
}

function sortThreads(threads: ConversationThread[]): ConversationThread[] {
  return [...threads].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [threads, setThreads] = useState<ConversationThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [mood, setMood] = useState('Tenang');
  const [journalInput, setJournalInput] = useState('');
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
  const storageEntriesKey = useMemo(() => {
    return currentUserId ? userEntriesKey(currentUserId) : GUEST_ENTRIES_KEY;
  }, [currentUserId]);

  const apiBaseUrl = useMemo(
    () => normalizeBase(getRuntimeEnv('VITE_API_URL') ?? (import.meta.env.VITE_API_URL as string | undefined)),
    []
  );
  const chatEndpoint = useMemo(() => buildApiEndpoint(apiBaseUrl, '/api/chat'), [apiBaseUrl]);
  const chatHistoryEndpoint = useMemo(() => buildApiEndpoint(apiBaseUrl, '/api/chat/history'), [apiBaseUrl]);

  const activeThread = useMemo(() => {
    if (threads.length === 0) return null;
    return threads.find((thread) => thread.id === activeThreadId) ?? threads[0];
  }, [threads, activeThreadId]);
  const messages: ChatMessage[] = activeThread?.messages ?? [{ role: 'assistant', text: STARTER_ASSISTANT_MESSAGE }];

  function applyThreadUpdate(threadId: string, updater: (thread: ConversationThread) => ConversationThread) {
    setThreads((prev) => {
      const index = prev.findIndex((thread) => thread.id === threadId);
      if (index < 0) return prev;
      const nextThread = updater(prev[index]);
      const rest = prev.filter((thread) => thread.id !== threadId);
      return [nextThread, ...rest];
    });
  }

  function switchThread(threadId: string) {
    const thread = threads.find((row) => row.id === threadId);
    if (!thread) return;
    setActiveThreadId(threadId);
    setSelectedCategory(thread.category || 'general');
    setSearchParams({ thread: threadId }, { replace: true });
  }

  function createNewThread() {
    const next = createThread(selectedCategory);
    setThreads((prev) => [next, ...prev]);
    setActiveThreadId(next.id);
    setJournalInput('');
    setErrorMessage(null);
    setSearchParams({ thread: next.id }, { replace: true });
  }

  useEffect(() => {
    const entries = loadEntries(storageEntriesKey);
    setSavedEntriesCount(entries.length);
  }, [storageEntriesKey]);

  useEffect(() => {
    const stored = loadThreads(currentUserId);
    let nextThreads = stored;

    if (nextThreads.length === 0) {
      const legacy = parseLegacyMessages(window.localStorage.getItem(legacyMessagesKey(currentUserId)));
      if (legacy.length > 0) {
        const migrated = createThread(selectedCategory);
        const now = new Date().toISOString();
        migrated.messages = legacy.slice(-100);
        migrated.updatedAt = now;
        const firstUser = migrated.messages.find((message) => message.role === 'user');
        migrated.title = titleFromMessage(firstUser?.text ?? 'Percakapan sebelumnya');
        nextThreads = [migrated];
      } else {
        nextThreads = [createThread(selectedCategory)];
      }
    }

    const sorted = sortThreads(nextThreads);
    setThreads(sorted);
    setHistoryLoadedFromServer(false);

    const requestedThread = searchParams.get('thread');
    const initialThread = requestedThread && sorted.some((thread) => thread.id === requestedThread) ? requestedThread : sorted[0]?.id ?? '';
    setActiveThreadId(initialThread);
    const initialCategory = sorted.find((thread) => thread.id === initialThread)?.category ?? 'general';
    setSelectedCategory(initialCategory);
  }, [currentUserId]);

  useEffect(() => {
    if (!activeThreadId) return;
    if (threads.some((thread) => thread.id === activeThreadId)) return;
    const fallback = threads[0];
    if (!fallback) return;
    setActiveThreadId(fallback.id);
    setSelectedCategory(fallback.category || 'general');
    setSearchParams({ thread: fallback.id }, { replace: true });
  }, [activeThreadId, threads]);

  useEffect(() => {
    if (threads.length === 0) return;
    saveThreads(currentUserId, sortThreads(threads));
  }, [threads, currentUserId]);

  useEffect(() => {
    const requestedThread = searchParams.get('thread');
    if (!requestedThread) return;
    const target = threads.find((thread) => thread.id === requestedThread);
    if (!target || target.id === activeThreadId) return;
    setActiveThreadId(target.id);
    setSelectedCategory(target.category || 'general');
  }, [searchParams, threads, activeThreadId]);

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

        if (serverMessages.length === 0) return;

        const serverThreadId = `server-${userId}`;
        setThreads((prev) => {
          const serverThread: ConversationThread = {
            id: serverThreadId,
            title: 'Riwayat akun sebelumnya',
            category: 'general',
            updatedAt: new Date().toISOString(),
            messages: serverMessages.slice(-100)
          };

          return [serverThread, ...prev.filter((thread) => thread.id !== serverThreadId)];
        });

        setActiveThreadId(serverThreadId);
        setSelectedCategory('general');
        setSearchParams({ thread: serverThreadId }, { replace: true });
        setHistoryLoadedFromServer(true);
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
    const thread = activeThread;
    if (!userText || isLoading || !thread) return;

    setShowConsentModal(false);
    setIsLoading(true);
    setErrorMessage(null);
    setToastMessage(null);

    const history: ChatPayloadMessage[] = thread.messages.slice(-12).map((message) => ({
      role: message.role,
      content: message.text
    }));

    const userMessage: ChatMessage = { role: 'user', text: userText };
    const threadId = thread.id;
    const now = new Date().toISOString();
    applyThreadUpdate(threadId, (current) => {
      const hasUserMessage = current.messages.some((message) => message.role === 'user');
      return {
        ...current,
        title: hasUserMessage ? current.title : titleFromMessage(userText),
        updatedAt: now,
        category: selectedCategory,
        messages: [...current.messages, userMessage].slice(-100)
      };
    });
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
      applyThreadUpdate(threadId, (current) => ({
        ...current,
        updatedAt: new Date().toISOString(),
        messages: [...current.messages, { role: 'assistant' as const, text: assistantText }].slice(-100)
      }));
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

  function handleInputKeydown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && journalInput.trim()) startReflectFlow();
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        <aside className="flex min-h-[72vh] flex-col rounded-xl border border-border bg-white p-3 sm:p-4">
          <Button onClick={createNewThread} className="w-full">
            + Percakapan Baru
          </Button>

          <div className="mt-3 rounded-lg border border-border bg-accent p-3">
            <p className="text-label font-medium text-ink">Mode aktif</p>
            <p className="mt-1 text-caption text-muted">{currentUserId ? 'Login' : 'Anonymous guest'}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="accent">AI by consent</Badge>
              <Badge tone="success">{currentUserId ? 'Riwayat sinkron' : 'Lokal dulu'}</Badge>
            </div>
          </div>

          <div className="mt-3 flex-1 overflow-y-auto pr-1">
            <p className="mb-2 text-caption font-medium text-muted">Riwayat chat</p>
            <div className="space-y-1">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => switchThread(thread.id)}
                  className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                    activeThread?.id === thread.id
                      ? 'border-brand-blue/40 bg-brand-blue-soft'
                      : 'border-border bg-white hover:bg-accent'
                  }`}
                >
                  <p className="truncate text-caption font-medium text-ink">{thread.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{formatUpdatedAt(thread.updatedAt)}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 space-y-3 border-t border-border pt-3">
            <div>
              <p className="text-label font-medium text-ink">Mood check-in</p>
              <div className="mt-2">
                <MoodPicker onSelect={setMood} />
              </div>
              <p className="mt-2 text-caption text-muted">Entri tersimpan: <strong>{savedEntriesCount}</strong></p>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentUserId ? (
                <Button variant="secondary" className="w-full" onClick={logout}>
                  Logout akun
                </Button>
              ) : (
                <Button variant="secondary" className="w-full" onClick={() => setShowLoginModal(true)}>
                  Login untuk simpan konteks
                </Button>
              )}
            </div>
          </div>
        </aside>

        <section className="flex min-h-[72vh] flex-col rounded-xl border border-border bg-white">
          <header className="border-b border-border p-3 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-h6 font-semibold tracking-tight text-ink">{activeThread?.title ?? 'Percakapan baru'}</p>
                <p className="text-caption text-muted">
                  {historyLoadedFromServer ? 'Riwayat akun terdeteksi' : 'UI chat gaya ChatGPT, tema CurhatIn'}
                </p>
              </div>
              <label className="inline-flex items-start gap-2 rounded-md border border-brand-green/30 bg-brand-green-soft px-3 py-2">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={shareAnonymously}
                  onChange={(event) => setShareAnonymously(event.target.checked)}
                />
                <span className="text-[11px] text-ink-soft">Bagikan anonim untuk knowledge base komunitas</span>
              </label>
            </div>

            <div className="hide-scrollbar -mx-1 mt-3 flex gap-2 overflow-x-auto px-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'secondary'}
                  className="shrink-0 text-caption"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    if (!activeThread) return;
                    applyThreadUpdate(activeThread.id, (current) => ({
                      ...current,
                      category: category.id
                    }));
                  }}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-white p-3 sm:p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[92%] rounded-xl px-3.5 py-2.5 text-body sm:max-w-[84%] sm:px-4 sm:py-3 ${
                    message.role === 'user'
                      ? 'bg-[#191919] text-white'
                      : 'border border-border bg-brand-blue-soft text-ink'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading ? <LoadingState label="AI sedang menyusun refleksi..." /> : null}
          </div>

          <div className="border-t border-border p-3 sm:p-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-caption font-medium text-muted">Contoh kalimat pembuka:</p>
                <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="shrink-0 rounded-md border border-brand-blue/30 bg-brand-blue-soft px-3 py-1.5 text-caption font-medium text-brand-blue"
                      onClick={() => setJournalInput(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                id="chat-input"
                label="Tulis jurnal / pesan refleksi"
                placeholder="Contoh: Hari ini aku merasa capek tapi masih berusaha hadir..."
                className="min-h-[96px]"
                value={journalInput}
                onChange={(event) => setJournalInput(event.target.value)}
                onKeyDown={handleInputKeydown}
              />

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button variant="secondary" className="w-full sm:w-auto" onClick={saveJournalLocally} disabled={isLoading}>
                  Simpan Lokal
                </Button>
                <Button className="w-full sm:w-auto" onClick={startReflectFlow} disabled={!journalInput.trim() || isLoading}>
                  Kirim ke AI
                </Button>
              </div>
              <p className="text-caption text-muted">
                Tekan Enter untuk kirim, Shift+Enter untuk baris baru. AI tetap OFF by default sampai kamu konfirmasi.
              </p>
              {toastMessage ? <Toast message={toastMessage} tone="success" /> : null}
              {errorMessage ? <Toast message={errorMessage} tone="error" /> : null}
            </div>
          </div>
        </section>
      </div>

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
          <div className="rounded-md border border-border bg-accent p-3 text-caption text-ink-soft">
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
              className="h-10 rounded-md border border-border bg-white px-3 text-[15px]"
              value={loginName}
              onChange={(event) => setLoginName(event.target.value)}
              placeholder="Nama kamu"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-caption font-semibold">Email</span>
            <input
              className="h-10 rounded-md border border-border bg-white px-3 text-[15px]"
              type="email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              placeholder="nama@email.com"
            />
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setShowLoginModal(false)}>
              Batal
            </Button>
            <Button className="w-full sm:w-auto" onClick={submitLogin}>Masuk</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
