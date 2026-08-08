import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidAdminToken } from '@/lib/adminAuth';
import { store } from '@/lib/store';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!isValidAdminToken(token)) {
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
