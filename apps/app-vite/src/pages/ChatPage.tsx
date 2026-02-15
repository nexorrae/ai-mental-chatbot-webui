import { type KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Button, LoadingState, Modal, Toast } from '../components/ui';
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
  phone?: string;
  provider: 'local' | 'google' | 'github';
}

interface LocalUserAccount {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface JournalEntry {
  id: string;
  text: string;
  mood: string;
  createdAt: string;
}

const USER_PROFILE_KEY = 'curhatin:user:profile:v2';
const USER_ACCOUNTS_KEY = 'curhatin:user:accounts:v1';
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
    const email = profile.email?.trim().toLowerCase() ?? '';
    if (!email || !email.includes('@')) return null;
    const name = profile.name?.trim() || email.split('@')[0] || 'User';
    const provider = profile.provider === 'google' || profile.provider === 'github' ? profile.provider : 'local';
    const phone = profile.phone?.trim() ?? '';

    return {
      name,
      email,
      phone,
      provider
    };
  } catch {
    return null;
  }
}

function parseAccounts(raw: string | null): LocalUserAccount[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((row): LocalUserAccount | null => {
        if (!row || typeof row !== 'object') return null;
        const account = row as Partial<LocalUserAccount>;
        const name = account.name?.trim() ?? '';
        const email = account.email?.trim().toLowerCase() ?? '';
        const phone = account.phone?.trim() ?? '';
        const password = account.password?.trim() ?? '';
        if (!name || !email || !password) return null;
        return { name, email, phone, password };
      })
      .filter((row): row is LocalUserAccount => row !== null);
  } catch {
    return [];
  }
}

function loadAccounts(): LocalUserAccount[] {
  return parseAccounts(window.localStorage.getItem(USER_ACCOUNTS_KEY));
}

function saveAccounts(accounts: LocalUserAccount[]): void {
  window.localStorage.setItem(USER_ACCOUNTS_KEY, JSON.stringify(accounts));
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [threadQuery, setThreadQuery] = useState('');
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
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
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
  const googleSsoUrl = useMemo(
    () =>
      (getRuntimeEnv('VITE_SSO_GOOGLE_URL') ??
        (import.meta.env.VITE_SSO_GOOGLE_URL as string | undefined) ??
        '')
        .trim(),
    []
  );
  const githubSsoUrl = useMemo(
    () =>
      (getRuntimeEnv('VITE_SSO_GITHUB_URL') ??
        (import.meta.env.VITE_SSO_GITHUB_URL as string | undefined) ??
        '')
        .trim(),
    []
  );
  const chatEndpoint = useMemo(() => buildApiEndpoint(apiBaseUrl, '/api/chat'), [apiBaseUrl]);
  const chatHistoryEndpoint = useMemo(() => buildApiEndpoint(apiBaseUrl, '/api/chat/history'), [apiBaseUrl]);

  const activeThread = useMemo(() => {
    if (threads.length === 0) return null;
    return threads.find((thread) => thread.id === activeThreadId) ?? threads[0];
  }, [threads, activeThreadId]);
  const messages: ChatMessage[] = activeThread?.messages ?? [{ role: 'assistant', text: STARTER_ASSISTANT_MESSAGE }];
  const visibleThreads = useMemo(() => {
    const keyword = threadQuery.trim().toLowerCase();
    if (!keyword) return threads;
    return threads.filter((thread) => {
      const title = thread.title.toLowerCase();
      const latest = thread.messages[thread.messages.length - 1]?.text.toLowerCase() ?? '';
      return title.includes(keyword) || latest.includes(keyword);
    });
  }, [threadQuery, threads]);
  const isStarterThread =
    messages.length === 1 &&
    messages[0]?.role === 'assistant' &&
    messages[0]?.text === STARTER_ASSISTANT_MESSAGE;

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
    setSidebarOpen(false);
  }

  function createNewThread() {
    const next = createThread(selectedCategory);
    setThreads((prev) => [next, ...prev]);
    setActiveThreadId(next.id);
    setJournalInput('');
    setErrorMessage(null);
    setSearchParams({ thread: next.id }, { replace: true });
    setSidebarOpen(false);
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

  function completeLogin(profile: UserProfile, successMessage: string) {
    window.localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    setUserProfile(profile);
    setShowLoginModal(false);
    setToastMessage(successMessage);
    setErrorMessage(null);
  }

  function submitUserLogin() {
    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword.trim();
    if (!email || !password || !email.includes('@')) {
      setErrorMessage('Email dan password valid diperlukan untuk login.');
      return;
    }

    const matchedAccount = loadAccounts().find((account) => account.email === email && account.password === password);
    if (!matchedAccount) {
      setErrorMessage('Email atau password salah. Coba lagi atau daftar akun baru.');
      return;
    }

    completeLogin(
      {
        name: matchedAccount.name,
        email: matchedAccount.email,
        phone: matchedAccount.phone,
        provider: 'local'
      },
      'Login berhasil. Riwayat chat akun dimuat otomatis.'
    );
    setLoginEmail('');
    setLoginPassword('');
  }

  function submitUserRegister() {
    const name = registerName.trim();
    const email = registerEmail.trim().toLowerCase();
    const password = registerPassword.trim();
    const phone = registerPhone.trim();
    if (!name || !email || !password || !phone) {
      setErrorMessage('Nama, email, password, dan phone number wajib diisi.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMessage('Format email belum valid.');
      return;
    }
    if (!/^[0-9+()\\-\\s]{8,20}$/.test(phone)) {
      setErrorMessage('Phone number minimal 8 digit (boleh pakai +, spasi, atau -).');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password minimal 6 karakter.');
      return;
    }

    const accounts = loadAccounts();
    if (accounts.some((account) => account.email === email)) {
      setErrorMessage('Email sudah terdaftar. Gunakan menu login.');
      return;
    }

    const nextAccount: LocalUserAccount = { name, email, password, phone };
    saveAccounts([nextAccount, ...accounts]);
    completeLogin(
      {
        name,
        email,
        phone,
        provider: 'local'
      },
      'Registrasi berhasil. Akun aktif dan konteks chat siap disimpan.'
    );
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterPhone('');
  }

  function startSsoLogin(provider: 'google' | 'github', url: string) {
    if (!url) {
      setErrorMessage(`SSO ${provider === 'google' ? 'Google' : 'GitHub'} belum dikonfigurasi di environment.`);
      return;
    }
    window.location.href = url;
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
    <div className="h-full bg-bg text-ink">
      <div className="flex h-full overflow-hidden">
        <aside
          className={`absolute inset-y-0 left-0 z-30 flex w-[280px] shrink-0 flex-col border-r border-border bg-[#f8faf8] transition-transform md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-14 items-center justify-between border-b border-border px-3">
            <Link to="/" className="inline-flex items-center gap-2 text-caption font-semibold tracking-tight text-ink">
              <span className="brand-mark brand-mark--md">
                <img src="/CurhatinAI.png" alt="CurhatIn AI" className="brand-mark__img" />
              </span>
              CurhatIn AI
            </Link>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-ink-soft md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Tutup sidebar"
            >
              ×
            </button>
          </div>

          <div className="space-y-2 border-b border-border p-3">
            <Button className="w-full justify-start" onClick={createNewThread}>
              + New chat
            </Button>
            <input
              className="h-9 w-full rounded-md border border-border bg-white px-3 text-caption text-ink placeholder:text-muted"
              placeholder="Search chats"
              value={threadQuery}
              onChange={(event) => setThreadQuery(event.target.value)}
            />
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted">
              <Link to="/app/history" className="rounded-md border border-border bg-white px-2 py-1 hover:bg-accent hover:text-ink">
                History
              </Link>
              <Link to="/articles" className="rounded-md border border-border bg-white px-2 py-1 hover:bg-accent hover:text-ink">
                Articles
              </Link>
              <a href="/" className="rounded-md border border-border bg-white px-2 py-1 hover:bg-accent hover:text-ink">
                Landing
              </a>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
            {visibleThreads.length > 0 ? (
              visibleThreads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => switchThread(thread.id)}
                  className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                    activeThread?.id === thread.id
                      ? 'border-brand-blue/30 bg-brand-blue-soft'
                      : 'border-transparent hover:border-border hover:bg-white'
                  }`}
                >
                  <p className="truncate text-caption font-medium text-ink">{thread.title}</p>
                  <p className="mt-0.5 truncate text-[11px] text-muted">{formatUpdatedAt(thread.updatedAt)}</p>
                </button>
              ))
            ) : (
              <p className="px-2 py-3 text-caption text-muted">Belum ada chat yang cocok.</p>
            )}
          </div>

          <div className="space-y-2 border-t border-border p-3">
            <div className="rounded-lg border border-border bg-white p-2.5">
              <p className="text-[11px] font-semibold text-ink">
                {currentUserId ? `Login ${userProfile?.provider === 'local' ? 'Email' : userProfile?.provider}` : 'Anonymous mode'}
              </p>
              <p className="mt-1 text-[11px] text-muted">{currentUserId ? userProfile?.email : 'AI aktif hanya saat kamu klik kirim.'}</p>
              <p className="mt-1 text-[11px] text-muted">Jurnal tersimpan: {savedEntriesCount}</p>
            </div>
            {currentUserId ? (
              <Button variant="secondary" className="w-full" onClick={logout}>
                Logout akun
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setAuthMode('login');
                  setShowLoginModal(true);
                }}
              >
                Login / Register
              </Button>
            )}
          </div>
        </aside>

        {sidebarOpen ? (
          <button
            type="button"
            className="absolute inset-0 z-20 bg-black/20 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup sidebar overlay"
          />
        ) : null}

        <section className="relative flex min-h-0 flex-1 flex-col bg-white">
          <header className="flex h-14 items-center justify-between border-b border-border px-3 sm:px-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-ink-soft md:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Buka sidebar"
              >
                ☰
              </button>
              <div>
                <p className="text-body font-semibold tracking-tight text-ink">{activeThread?.title ?? 'Percakapan baru'}</p>
                <p className="text-[11px] text-muted">
                  {historyLoadedFromServer ? 'Riwayat akun terdeteksi' : 'Chat layout model ChatGPT, tema CurhatIn'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="hidden items-center gap-1.5 rounded-md border border-brand-green/30 bg-brand-green-soft px-2 py-1 sm:inline-flex">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5"
                  checked={shareAnonymously}
                  onChange={(event) => setShareAnonymously(event.target.checked)}
                />
                <span className="text-[11px] text-ink-soft">Anonim</span>
              </label>
              {!currentUserId ? (
                <Button
                  variant="secondary"
                  className="h-8 px-3 text-caption"
                  onClick={() => {
                    setAuthMode('login');
                    setShowLoginModal(true);
                  }}
                >
                  Login
                </Button>
              ) : null}
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex h-full w-full max-w-3xl flex-col px-4 py-6 sm:px-6">
              {isStarterThread ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="space-y-3 text-center">
                    <p className="text-[clamp(1.5rem,4.2vw,2.2rem)] font-semibold tracking-[-0.02em] text-ink">
                      What are you working on today?
                    </p>
                    <p className="text-caption text-muted">Mulai dari satu kalimat sederhana. AI hanya merespons saat kamu memberi trigger.</p>
                  </div>
                </div>
              ) : null}

              <div className={`space-y-4 ${isStarterThread ? 'pb-10' : 'mt-1 pb-10'}`}>
                {messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-body leading-relaxed ${
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
            </div>
          </div>

          <div className="border-t border-border bg-white/95 px-3 py-3 backdrop-blur sm:px-4">
            <div className="mx-auto w-full max-w-3xl space-y-2.5">
              <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="shrink-0 rounded-full border border-brand-blue/25 bg-brand-blue-soft px-3 py-1.5 text-[11px] font-medium text-brand-blue"
                    onClick={() => setJournalInput(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-border bg-white p-2.5 shadow-soft">
                <textarea
                  className="min-h-[92px] w-full resize-none border-0 bg-transparent px-2 py-1 text-body text-ink outline-none placeholder:text-muted"
                  placeholder="Tulis perasaanmu di sini, lalu klik Kirim ke AI..."
                  value={journalInput}
                  onChange={(event) => setJournalInput(event.target.value)}
                  onKeyDown={handleInputKeydown}
                />
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      className="h-8 rounded-md border border-border bg-white px-2.5 text-[12px] text-ink"
                      value={selectedCategory}
                      onChange={(event) => {
                        const nextCategory = event.target.value;
                        setSelectedCategory(nextCategory);
                        if (!activeThread) return;
                        applyThreadUpdate(activeThread.id, (current) => ({
                          ...current,
                          category: nextCategory
                        }));
                      }}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    <select
                      className="h-8 rounded-md border border-border bg-white px-2.5 text-[12px] text-ink"
                      value={mood}
                      onChange={(event) => setMood(event.target.value)}
                    >
                      <option value="Tenang">Mood: Tenang</option>
                      <option value="Sedih">Mood: Sedih</option>
                      <option value="Cemas">Mood: Cemas</option>
                      <option value="Lelah">Mood: Lelah</option>
                      <option value="Marah">Mood: Marah</option>
                    </select>
                    <Button variant="secondary" className="h-8 px-3 text-caption" onClick={saveJournalLocally} disabled={isLoading}>
                      Simpan Lokal
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="h-8 px-3 text-caption" onClick={startReflectFlow} disabled={!journalInput.trim() || isLoading}>
                      Kirim ke AI
                    </Button>
                  </div>
                </div>
              </div>

              <p className="px-1 text-[11px] text-muted">Enter untuk kirim, Shift+Enter untuk baris baru. AI tetap OFF by default sampai kamu konfirmasi.</p>
              {toastMessage ? <Toast message={toastMessage} tone="success" /> : null}
              {errorMessage ? <Toast message={errorMessage} tone="error" /> : null}
            </div>
          </div>
        </section>
      </div>

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
        title={authMode === 'login' ? 'Login User' : 'Register User'}
        description="Guest tetap tersedia. Login akun dipakai untuk menyimpan konteks chat personal."
        onClose={() => setShowLoginModal(false)}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-md border border-border bg-accent p-1">
            <button
              type="button"
              className={`h-9 rounded-md text-caption font-medium ${
                authMode === 'login' ? 'bg-white text-ink shadow-soft' : 'text-ink-soft'
              }`}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={`h-9 rounded-md text-caption font-medium ${
                authMode === 'register' ? 'bg-white text-ink shadow-soft' : 'text-ink-soft'
              }`}
              onClick={() => setAuthMode('register')}
            >
              Register
            </button>
          </div>

          {authMode === 'login' ? (
            <div className="space-y-3">
              <label className="flex flex-col gap-2">
                <span className="text-caption font-semibold">Email</span>
                <input
                  className="h-10 rounded-md border border-border bg-white px-3 text-[15px]"
                  type="email"
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  placeholder="nama@email.com"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-caption font-semibold">Password</span>
                <input
                  className="h-10 rounded-md border border-border bg-white px-3 text-[15px]"
                  type="password"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  placeholder="Masukkan password"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="flex flex-col gap-2">
                <span className="text-caption font-semibold">Nama</span>
                <input
                  className="h-10 rounded-md border border-border bg-white px-3 text-[15px]"
                  autoComplete="name"
                  value={registerName}
                  onChange={(event) => setRegisterName(event.target.value)}
                  placeholder="Nama kamu"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-caption font-semibold">Email</span>
                <input
                  className="h-10 rounded-md border border-border bg-white px-3 text-[15px]"
                  type="email"
                  autoComplete="email"
                  value={registerEmail}
                  onChange={(event) => setRegisterEmail(event.target.value)}
                  placeholder="nama@email.com"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-caption font-semibold">Phone Number</span>
                <input
                  className="h-10 rounded-md border border-border bg-white px-3 text-[15px]"
                  autoComplete="tel"
                  value={registerPhone}
                  onChange={(event) => setRegisterPhone(event.target.value)}
                  placeholder="+62 812 3456 7890"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-caption font-semibold">Password</span>
                <input
                  className="h-10 rounded-md border border-border bg-white px-3 text-[15px]"
                  type="password"
                  autoComplete="new-password"
                  value={registerPassword}
                  onChange={(event) => setRegisterPassword(event.target.value)}
                  placeholder="Minimal 6 karakter"
                />
              </label>
            </div>
          )}

          <div className="space-y-2 rounded-md border border-border bg-accent p-3">
            <p className="text-caption font-semibold text-ink">SSO User</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => startSsoLogin('google', googleSsoUrl)}
              >
                Login with Google
              </Button>
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => startSsoLogin('github', githubSsoUrl)}
              >
                Login with GitHub
              </Button>
            </div>
            <p className="text-[11px] text-muted">Aktif jika URL SSO sudah diisi di environment frontend.</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setShowLoginModal(false)}>
              Batal
            </Button>
            <Button className="w-full sm:w-auto" onClick={authMode === 'login' ? submitUserLogin : submitUserRegister}>
              {authMode === 'login' ? 'Masuk' : 'Daftar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
