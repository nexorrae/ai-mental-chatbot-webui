import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, EmptyState, OutlinedCard } from '../components/ui';
import { loadThreads, type ConversationThread } from '../lib/chatStorage';

interface UserProfile {
  name: string;
  email: string;
}

const USER_PROFILE_KEY = 'curhatin:user:profile:v2';

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

function formatUpdatedAt(value: string): string {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(time));
}

export function HistoryPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => parseProfile(window.localStorage.getItem(USER_PROFILE_KEY)));
  const [threads, setThreads] = useState<ConversationThread[]>([]);

  const currentUserId = useMemo(() => userProfile?.email?.trim().toLowerCase() || null, [userProfile]);

  useEffect(() => {
    setThreads(loadThreads(currentUserId));
  }, [currentUserId]);

  useEffect(() => {
    function syncProfileFromStorage(event: StorageEvent) {
      if (event.key !== USER_PROFILE_KEY) return;
      setUserProfile(parseProfile(window.localStorage.getItem(USER_PROFILE_KEY)));
    }
    window.addEventListener('storage', syncProfileFromStorage);
    return () => window.removeEventListener('storage', syncProfileFromStorage);
  }, []);

  return (
    <div className="space-y-4">
      <OutlinedCard className="space-y-2">
        <h1 className="text-h4 font-semibold tracking-tight">Conversation History</h1>
        <p className="text-body text-ink-soft">
          Daftar percakapanmu. Klik salah satu untuk melanjutkan chat pada konteks yang sama.
        </p>
      </OutlinedCard>

      {threads.length === 0 ? (
        <EmptyState
          title="Belum ada riwayat chat"
          description="Mulai percakapan baru di halaman Chat untuk membuat riwayat seperti ChatGPT."
          action={
            <Link to="/app/chat">
              <Button variant="primary">Mulai chat baru</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => {
            const preview = thread.messages[thread.messages.length - 1]?.text ?? '';
            return (
              <Link key={thread.id} to={`/app/chat?thread=${encodeURIComponent(thread.id)}`} className="block">
                <OutlinedCard className="space-y-2 transition-colors hover:bg-accent">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-h6 font-semibold tracking-tight text-ink">{thread.title}</p>
                    <p className="text-caption text-muted">{formatUpdatedAt(thread.updatedAt)}</p>
                  </div>
                  <p className="max-h-12 overflow-hidden text-body text-ink-soft">{preview}</p>
                  <p className="text-caption text-muted">
                    {thread.messages.length} pesan • Kategori: {thread.category}
                  </p>
                </OutlinedCard>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
