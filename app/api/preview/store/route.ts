// app/api/preview/store/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store
const store = new Map<string, string>();

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json();
    if (!html) return NextResponse.json({ error: 'No HTML' }, { status: 400 });

    const id = Math.random().toString(36).slice(2, 12);
    store.set(id, html);

    // Auto-delete after 1 hour
    setTimeout(() => store.delete(id), 60 * 60 * 1000);

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') || '';
  const html = store.get(id);

  if (!html) {
    return new NextResponse('<h1>Preview expired. Please rebuild.</h1>', {
      status: 404,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Frame-Options': 'SAMEORIGIN',
    },
  });
}
