import { NextRequest, NextResponse } from 'next/server';
import { getRecordById } from '@/lib/records';
import { getSession } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase/server';

// Next.js 15+: 동적 라우트의 params는 Promise 입니다.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  }

  try {
    const record = await getRecordById(id);
    if (!record) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }
    // counselor는 본인 소유 기록만 열람 가능. admin/defense_education은 전체 열람
    // (defense_education도 이 분기를 타지 않으므로 자동으로 통과 — INTEGRATION_BRIEF.md 3-6).
    if (session.role === 'counselor' && record.counselor_id !== session.counselorId) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    // 국방교육담당자 조회는 감사 로그에 남긴다 — 계정이 부서 공용이라
    // "누가"는 특정할 수 없고 "언제 무엇을 조회했는지"만 추적한다 (INTEGRATION_BRIEF.md 3-7).
    if (session.role === 'defense_education') {
      const { error: logError } = await supabaseServer
        .from('access_logs')
        .insert({ user_id: session.userId, record_id: id });
      if (logError) console.error('access_logs insert failed:', logError);
    }

    return NextResponse.json(record);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'failed to load record' }, { status: 500 });
  }
}
