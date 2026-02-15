import { NextRequest, NextResponse } from 'next/server';

export function createCorsHeaders(request: NextRequest): HeadersInit {
  const origin = request.headers.get('origin') ?? '*';

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

export function withCors<T>(request: NextRequest, payload: T, status = 200): NextResponse<T> {
  const response = NextResponse.json(payload, { status });
  const headers = createCorsHeaders(request);

  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }

  return response;
}
