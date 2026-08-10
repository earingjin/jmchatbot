import { NextRequest, NextResponse } from 'next/server';
import { getNoticeById } from '@/lib/notices';

// Next.js 15+: 동적 라우트의 params는 Promise 입니다.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  }

  try {
    const notice = await getNoticeById(id);
    if (!notice) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }
    return NextResponse.json(notice);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'failed to load notice' }, { status: 500 });
  }
}
