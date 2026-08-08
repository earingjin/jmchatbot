import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const rating = Number(body?.rating);

  if (!body?.sessionId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'sessionId and rating (1-5) are required' }, { status: 400 });
  }

  const updated = await store.updateSession(body.sessionId, { rating });
  if (!updated) {
    return NextResponse.json({ error: 'session not found' }, { status: 404 });
  }
  return NextResponse.json({ session: updated });
}
