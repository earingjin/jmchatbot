-- motichatbot × jmcounseling 통합 스키마
-- INTEGRATION_BRIEF.md 3-2 참조. jmcounseling과 같은 Supabase 프로젝트에 적용한다.
--
-- 기존 jmcounseling 테이블(counseling_records, period_stats)은 이미 존재하므로
-- 여기서는 만들지 않는다 — 마이그레이션 그대로 사용.

-- ===== 챗봇 데이터 (lib/store.ts의 FileStore를 대체) =====

CREATE TABLE IF NOT EXISTS chat_sessions (
  id text PRIMARY KEY,
  started_at timestamptz NOT NULL,
  ended_at timestamptz,
  category text,
  topic text,
  turn_count int DEFAULT 0,
  consecutive_fail_count int DEFAULT 0,
  resolved boolean,
  escalated boolean DEFAULT false,
  rating int
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id text PRIMARY KEY,
  session_id text REFERENCES chat_sessions(id),
  role text CHECK (role IN ('user', 'assistant')),
  content text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_messages_session_id_idx ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS chat_sessions_started_at_idx ON chat_sessions(started_at);

-- ===== 챗봇→상담 핸드오프 연계 (기존 계획 유지, 로직은 별도 작업) =====

CREATE TABLE IF NOT EXISTS handoff_links (
  chat_session_id text REFERENCES chat_sessions(id),
  counseling_record_id bigint REFERENCES counseling_records(id),
  created_at timestamptz DEFAULT now()
);

-- ===== 국방교육담당자 조회 이력 (감사 로그) =====

CREATE TABLE IF NOT EXISTS access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  record_id bigint REFERENCES counseling_records(id),
  accessed_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS access_logs_record_id_idx ON access_logs(record_id);

-- ===== RLS: jmcounseling과 동일하게 전면 차단 + service_role 전용 접근 =====
-- 브라우저는 이 테이블들에 직접 접근하지 않는다 (lib/supabase/server.ts의
-- service_role 클라이언트를 통해서만 app/api/*/route.ts에서 접근).

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE handoff_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- 정책을 만들지 않으면 기본적으로 전체 차단(anon/authenticated 모두)되고,
-- service_role 키는 RLS를 우회하므로 별도 정책이 필요 없다.
