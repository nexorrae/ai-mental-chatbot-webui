export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

export interface ConversationThread {
  id: string;
  title: string;
  updatedAt: string;
  category: string;
  messages: ChatMessage[];
}

export const STARTER_ASSISTANT_MESSAGE =
  'Halo, terima kasih sudah datang. Aku siap jadi ruang refleksi kamu. Mulai dari hal yang paling terasa hari ini ya.';

const GUEST_THREADS_KEY = 'curhatin:guest:threads:v1';

function userThreadsKey(userId: string): string {
  return `curhatin:user:${userId}:threads:v1`;
}

export function threadsStorageKey(userId?: string | null): string {
  const normalized = userId?.trim().toLowerCase();
  return normalized ? userThreadsKey(normalized) : GUEST_THREADS_KEY;
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false;
  const row = value as Partial<ChatMessage>;
  return (row.role === 'user' || row.role === 'assistant') && typeof row.text === 'string';
}

function isConversationThread(value: unknown): value is ConversationThread {
  if (!value || typeof value !== 'object') return false;
  const row = value as Partial<ConversationThread>;
  if (typeof row.id !== 'string') return false;
  if (typeof row.title !== 'string') return false;
  if (typeof row.updatedAt !== 'string') return false;
  if (typeof row.category !== 'string') return false;
  if (!Array.isArray(row.messages)) return false;
  return row.messages.every((message) => isChatMessage(message));
}

export function parseThreads(raw: string | null): ConversationThread[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is ConversationThread => isConversationThread(item));
  } catch {
    return [];
  }
}

export function loadThreads(userId?: string | null): ConversationThread[] {
  return parseThreads(window.localStorage.getItem(threadsStorageKey(userId)));
}

export function saveThreads(userId: string | null, threads: ConversationThread[]): void {
  window.localStorage.setItem(threadsStorageKey(userId), JSON.stringify(threads.slice(0, 100)));
}

export function titleFromMessage(text: string): string {
  const compact = text.replace(/\s+/g, ' ').trim();
  if (!compact) return 'Percakapan baru';
  return compact.length > 46 ? `${compact.slice(0, 46)}...` : compact;
}

export function createThread(category = 'general'): ConversationThread {
  const now = new Date().toISOString();
  return {
    id: `thread-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: 'Percakapan baru',
    updatedAt: now,
    category,
    messages: [{ role: 'assistant', text: STARTER_ASSISTANT_MESSAGE }]
  };
}
