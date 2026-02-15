const ADMIN_TOKEN_KEY = 'curhatin:admin:token:v1';

export function getAdminToken(): string {
  return window.localStorage.getItem(ADMIN_TOKEN_KEY) ?? '';
}

export function setAdminToken(token: string): void {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token.trim());
}

export function clearAdminToken(): void {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function hasAdminToken(): boolean {
  return getAdminToken().length > 0;
}
