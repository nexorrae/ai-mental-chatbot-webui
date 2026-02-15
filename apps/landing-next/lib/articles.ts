import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { seededArticles, type WellnessArticle, type ArticleStatus } from './articles-seed';

export type { WellnessArticle, ArticleStatus };

interface CreateArticleInput {
  title: string;
  excerpt: string;
  body: string;
  tags?: string[];
  status?: ArticleStatus;
  author?: string;
  readTimeMinutes?: number;
}

interface UpdateArticleInput {
  title?: string;
  excerpt?: string;
  body?: string;
  tags?: string[];
  status?: ArticleStatus;
  author?: string;
  readTimeMinutes?: number;
}

const ARTICLES_FILE = path.join(process.cwd(), 'data', 'articles.json');

const collator = new Intl.Collator('id', { sensitivity: 'base', usage: 'search' });

function safeTrim(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function normalizeMultiline(value: string): string {
  return value
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

function normalizeTags(tags?: string[]): string[] {
  if (!tags) return [];

  const unique = new Set<string>();
  for (const tag of tags) {
    const cleaned = safeTrim(tag);
    if (cleaned.length > 0) unique.add(cleaned);
  }

  return Array.from(unique);
}

function estimateReadTimeMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 180);
  return Math.max(1, minutes);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function ensureStorage(): Promise<void> {
  const dir = path.dirname(ARTICLES_FILE);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(ARTICLES_FILE);
  } catch {
    await fs.writeFile(ARTICLES_FILE, JSON.stringify(seededArticles, null, 2), 'utf8');
  }
}

async function readArticles(): Promise<WellnessArticle[]> {
  await ensureStorage();

  const raw = await fs.readFile(ARTICLES_FILE, 'utf8');
  const parsed = JSON.parse(raw) as WellnessArticle[];

  if (!Array.isArray(parsed)) return [];

  return parsed;
}

async function writeArticles(articles: WellnessArticle[]): Promise<void> {
  await ensureStorage();
  await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf8');
}

function sortByLatest(articles: WellnessArticle[]): WellnessArticle[] {
  return [...articles].sort((a, b) => {
    const left = new Date(a.publishedAt ?? a.updatedAt).getTime();
    const right = new Date(b.publishedAt ?? b.updatedAt).getTime();
    return right - left;
  });
}

function assertArticlePayload(input: CreateArticleInput): void {
  if (!safeTrim(input.title)) throw new Error('title is required');
  if (!safeTrim(input.excerpt)) throw new Error('excerpt is required');
  if (!normalizeMultiline(input.body)) throw new Error('body is required');
}

function uniqueSlug(baseSlug: string, articles: WellnessArticle[]): string {
  const fallback = baseSlug || 'artikel-baru';
  let nextSlug = fallback;
  let counter = 2;

  while (articles.some((article) => collator.compare(article.slug, nextSlug) === 0)) {
    nextSlug = `${fallback}-${counter}`;
    counter += 1;
  }

  return nextSlug;
}

export async function getAllArticles(): Promise<WellnessArticle[]> {
  const articles = await readArticles();
  return sortByLatest(articles);
}

export async function getPublishedArticles(): Promise<WellnessArticle[]> {
  const articles = await readArticles();
  return sortByLatest(articles.filter((article) => article.status === 'published'));
}

export async function getArticleBySlug(slug: string, includeDraft = false): Promise<WellnessArticle | null> {
  const articles = await readArticles();
  const article = articles.find((entry) => collator.compare(entry.slug, slug) === 0) ?? null;

  if (!article) return null;
  if (!includeDraft && article.status !== 'published') return null;

  return article;
}

export async function createArticle(input: CreateArticleInput): Promise<WellnessArticle> {
  assertArticlePayload(input);

  const articles = await readArticles();
  const now = new Date().toISOString();

  const nextArticle: WellnessArticle = {
    id: crypto.randomUUID(),
    slug: uniqueSlug(slugify(input.title), articles),
    title: safeTrim(input.title),
    excerpt: safeTrim(input.excerpt),
    body: normalizeMultiline(input.body),
    tags: normalizeTags(input.tags),
    status: input.status ?? 'draft',
    author: safeTrim(input.author ?? 'Admin CurhatIn') || 'Admin CurhatIn',
    readTimeMinutes: input.readTimeMinutes ?? estimateReadTimeMinutes(input.body),
    createdAt: now,
    updatedAt: now,
    publishedAt: (input.status ?? 'draft') === 'published' ? now : null
  };

  const next = [nextArticle, ...articles];
  await writeArticles(next);
  return nextArticle;
}

export async function updateArticle(slug: string, input: UpdateArticleInput): Promise<WellnessArticle | null> {
  const articles = await readArticles();
  const index = articles.findIndex((entry) => collator.compare(entry.slug, slug) === 0);

  if (index === -1) return null;

  const current = articles[index];
  const now = new Date().toISOString();

  const nextStatus = input.status ?? current.status;
  const nextBody = input.body ? normalizeMultiline(input.body) : current.body;

  const updated: WellnessArticle = {
    ...current,
    title: input.title ? safeTrim(input.title) : current.title,
    excerpt: input.excerpt ? safeTrim(input.excerpt) : current.excerpt,
    body: nextBody,
    tags: input.tags ? normalizeTags(input.tags) : current.tags,
    status: nextStatus,
    author: input.author ? safeTrim(input.author) : current.author,
    readTimeMinutes: input.readTimeMinutes ?? estimateReadTimeMinutes(nextBody),
    updatedAt: now,
    publishedAt:
      nextStatus === 'published'
        ? current.publishedAt ?? now
        : null
  };

  articles[index] = updated;
  await writeArticles(articles);
  return updated;
}

export async function deleteArticle(slug: string): Promise<boolean> {
  const articles = await readArticles();
  const next = articles.filter((entry) => collator.compare(entry.slug, slug) !== 0);

  if (next.length === articles.length) return false;

  await writeArticles(next);
  return true;
}
