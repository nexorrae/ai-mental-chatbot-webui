type RuntimeEnvKey = 'VITE_API_URL' | 'VITE_CONTENT_API_BASE';

declare global {
  interface Window {
    _env_?: Partial<Record<RuntimeEnvKey, string>>;
  }
}

export function getRuntimeEnv(key: RuntimeEnvKey): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const value = window._env_?.[key];
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export {};
