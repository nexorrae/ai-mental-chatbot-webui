import { NextRequest, NextResponse } from 'next/server';
import { createArticle, getAllArticles, getPublishedArticles, type ArticleStatus } from '@/lib/articles';
import { createCorsHeaders, withCors } from './cors';

export const runtime = 'nodejs';

interface CreateArticleRequestBody {
  title?: string;
  excerpt?: string;
  body?: string;
  tags?: string[];
  status?: ArticleStatus;
  author?: string;
  readTimeMinutes?: number;
}

function parseStatus(value: unknown): ArticleStatus {
  return value === 'published' ? 'published' : 'draft';
}

function parseStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string');
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: createCorsHeaders(request)
  });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeDraft = searchParams.get('includeDraft') === 'true';

    const articles = includeDraft
      ? await getAllArticles()
      : await getPublishedArticles();

    return withCors(request, { articles });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch articles';
    return withCors(request, { error: message }, 500);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = (await request.json()) as CreateArticleRequestBody;

    const article = await createArticle({
      title: payload.title ?? '',
      excerpt: payload.excerpt ?? '',
      body: payload.body ?? '',
      tags: parseStringList(payload.tags),
      status: parseStatus(payload.status),
      author: payload.author,
      readTimeMinutes: payload.readTimeMinutes
    });

    return withCors(request, { article }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create article';
    return withCors(request, { error: message }, 400);
  }
}
