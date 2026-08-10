import { NextRequest, NextResponse } from 'next/server';
import { getAllNotices, createNotice, NewNoticeInput } from '@/lib/notices';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const notices = await getAllNotices();
    return NextResponse.json(notices);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'failed to load notices' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  try {
    const body = (await req.json()) as Partial<NewNoticeInput>;

    if (!body.title?.trim() || !body.content?.trim()) {
      return NextResponse.json({ error: '제목과 내용을 모두 입력해 주세요.' }, { status: 400 });
    }

    // author_name은 클라이언트 입력이 아니라 세션에서 채운다.
    const notice = await createNotice({
      title: body.title.trim(),
      content: body.content.trim(),
      author_name: session.displayName,
    });
    return NextResponse.json(notice, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'failed to create notice' }, { status: 500 });
  }
}
