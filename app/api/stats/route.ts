import { NextRequest, NextResponse } from 'next/server';
import { getPeriodStats, Period } from '@/lib/stats';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const period = (req.nextUrl.searchParams.get('period') ?? 'week') as Period;

  if (period !== 'week' && period !== 'month') {
    return NextResponse.json({ error: 'invalid period' }, { status: 400 });
  }

  try {
    const stats = await getPeriodStats(period);
    return NextResponse.json(stats);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'failed to load stats' }, { status: 500 });
  }
}
