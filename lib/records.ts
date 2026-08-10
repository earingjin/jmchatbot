import { supabaseServer } from './supabase/server';

export interface CounselingRecord {
  id: number;
  counselor_id: string;
  counselor_name: string;
  record_date: string;
  phone_last4: string;
  branch: string;
  rank: string;
  method: string;
  topic: string;
  topic_detail: string | null;
  content: string | null;
  insights: string[];
  status: 'done' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface RecordScope {
  role: 'counselor' | 'admin' | 'defense_education';
  counselorId: string;
}

/**
 * 상담사는 본인 소유 레코드만, 관리자와 국방교육담당자는 전체를 반환한다.
 * 국방교육담당자는 상담사와 동일한 상세를 열람할 수 있지만 쓰기 권한은 없다
 * (app/api/records/route.ts의 POST에서 차단).
 */
export async function getAllRecords(scope: RecordScope): Promise<CounselingRecord[]> {
  let query = supabaseServer.from('counseling_records').select('*');

  if (scope.role === 'counselor') {
    query = query.eq('counselor_id', scope.counselorId);
  }

  const { data, error } = await query.order('record_date', { ascending: false });

  if (error) throw error;
  return data as CounselingRecord[];
}

export async function getRecordById(id: number): Promise<CounselingRecord | null> {
  const { data, error } = await supabaseServer
    .from('counseling_records')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as CounselingRecord | null;
}

export interface NewRecordInput {
  // 호출자(app/api/records/route.ts)가 세션에서 채워 넣는 값 — 클라이언트 입력을 그대로 쓰지 않는다.
  counselor_id: string;
  counselor_name: string;
  record_date: string;
  phone_last4: string;
  branch: string;
  rank: string;
  method: string;
  topic: string;
  topic_detail?: string;
  content?: string;
  insights?: string[];
  status: 'done' | 'draft';
}

export async function createRecord(input: NewRecordInput): Promise<CounselingRecord> {
  const { data, error } = await supabaseServer
    .from('counseling_records')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as CounselingRecord;
}
