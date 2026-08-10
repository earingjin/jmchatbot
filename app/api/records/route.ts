import { NextRequest, NextResponse } from 'next/server';
import { getAllRecords, createRecord, NewRecordInput } from '@/lib/records';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const records = await getAllRecords({ role: session.role, counselorId: session.counselorId });
    return NextResponse.json(records);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'failed to load records' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  // 국방교육담당자는 읽기 전용 — 기록 생성 권한이 없다 (INTEGRATION_BRIEF.md 3-6).
  if (session.role === 'defense_education') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  try {
    const body = (await req.json()) as NewRecordInput;

    // 서버 검증 — 클라이언트 검증은 UX용, 이게 실제 방어선입니다.
    if (!body.phone_last4 || body.phone_last4.length !== 4) {
      return NextResponse.json({ error: '전화번호 뒷자리 4자리가 필요합니다.' }, { status: 400 });
    }
    if (!body.topic || !body.record_date || !body.branch) {
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
    }
    if (body.content && body.content.length > 260) {
      return NextResponse.json({ error: '주요 진행내용은 260자를 넘을 수 없습니다.' }, { status: 400 });
    }

    // counselor_id/counselor_name은 클라이언트 입력이 아니라 세션에서 채운다.
    const record = await createRecord({
      ...body,
      counselor_id: session.counselorId,
      counselor_name: session.displayName,
    });
    return NextResponse.json(record, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'failed to create record' }, { status: 500 });
  }
}
