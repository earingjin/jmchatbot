import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') ?? 'today';

  const to = new Date();
  const from = new Date(to);
  if (range === 'week') from.setDate(from.getDate() - 7);
  else if (range === 'month') from.setMonth(from.getMonth() - 1);
  else from.setHours(0, 0, 0, 0);

  const stats = await store.getStats({ from, to });
  return NextResponse.json({ stats });
}
