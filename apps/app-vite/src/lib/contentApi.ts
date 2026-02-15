export interface WellnessArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  status: 'draft' | 'published';
  author: string;
  readTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

function normalizeBase(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

export function getContentApiBase(): string {
  const fromEnv = import.meta.env.VITE_CONTENT_API_BASE as string | undefined;
  const defaultBase = '';

  return normalizeBase(fromEnv || defaultBase);
}

export function contentApi(path: string): string {
  const base = getContentApiBase();
  const nextPath = path.startsWith('/') ? path : `/${path}`;

  if (!base) {
    return nextPath;
  }

  return `${base}${nextPath}`;
}
