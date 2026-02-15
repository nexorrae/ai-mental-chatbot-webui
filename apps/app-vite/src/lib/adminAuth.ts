const ADMIN_CREDENTIALS_KEY = 'curhatin:admin:credentials:v1';
const LEGACY_ADMIN_TOKEN_KEY = 'curhatin:admin:token:v1';

export interface AdminCredentials {
  username: string;
  password: string;
}

function normalize(value: string): string {
  return value.trim();
}

export function getAdminCredentials(): AdminCredentials | null {
  const raw = window.localStorage.getItem(ADMIN_CREDENTIALS_KEY);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const row = parsed as Partial<AdminCredentials>;
    const username = normalize(row.username ?? '');
    const password = normalize(row.password ?? '');
    if (!username || !password) return null;
    return { username, password };
  } catch {
    return null;
  }
}

export function setAdminCredentials(username: string, password: string): void {
  const payload: AdminCredentials = {
    username: normalize(username),
    password: normalize(password)
  };
  window.localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(payload));
  window.localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
}

export function clearAdminCredentials(): void {
  window.localStorage.removeItem(ADMIN_CREDENTIALS_KEY);
}

export function hasAdminCredentials(): boolean {
  return getAdminCredentials() !== null;
}
