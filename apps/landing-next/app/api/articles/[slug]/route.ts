import { NextRequest, NextResponse } from 'next/server';
import { deleteArticle, getArticleBySlug, type ArticleStatus, updateArticle } from '@/lib/articles';
import { createCorsHeaders, withCors } from '../cors';

export const runtime = 'nodejs';

interface UpdateArticleRequestBody {
  title?: string;
  excerpt?: string;
  body?: string;
  tags?: string[];
  status?: ArticleStatus;
  author?: string;
  readTimeMinutes?: number;
}

function parseStatus(value: unknown): ArticleStatus | undefined {
  if (value === 'published' || value === 'draft') {
    return value;
  }

  return undefined;
}

function parseStringList(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string');
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return undefined;
}

export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: createCorsHeaders(request)
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await context.params;

  try {
    const includeDraft = request.nextUrl.searchParams.get('includeDraft') === 'true';
    const article = await getArticleBySlug(slug, includeDraft);

    if (!article) {
      return withCors(request, { error: 'Article not found' }, 404);
    }

    return withCors(request, { article });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch article';
    return withCors(request, { error: message }, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await context.params;

  try {
    const payload = (await request.json()) as UpdateArticleRequestBody;
    const article = await updateArticle(slug, {
      title: payload.title,
      excerpt: payload.excerpt,
      body: payload.body,
      tags: parseStringList(payload.tags),
      status: parseStatus(payload.status),
      author: payload.author,
      readTimeMinutes: payload.readTimeMinutes
    });

    if (!article) {
      return withCors(request, { error: 'Article not found' }, 404);
    }

    return withCors(request, { article });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update article';
    return withCors(request, { error: message }, 400);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await context.params;

  try {
    const deleted = await deleteArticle(slug);

    if (!deleted) {
      return withCors(request, { error: 'Article not found' }, 404);
    }

    return withCors(request, { ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete article';
    return withCors(request, { error: message }, 500);
  }
}
