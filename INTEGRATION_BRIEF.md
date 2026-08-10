# motichatbot × jmcounseling 통합 구현 브리프

이 문서는 Claude Code가 `earingjin/motichatbot` 저장소의 `inter` 브랜치에서
작업할 때 참고하는 작업 지시서입니다. 아래 내용은 두 저장소를 실제로
클론해서 코드를 읽고 작성한 것이며, 가정이 아닌 확인된 사실입니다.

## 0. 목표

`motichatbot`(익명 사용자용 상담 챗봇)과 `jmcounseling`(상담사/관리자용
상담 기록 시스템)을 하나의 Next.js 앱으로 통합한다. 최종 결과물은
`motichatbot` 저장소 위에서 완성되며, `jmcounseling`은 인증/역할/기록
관리 패턴의 소스로 참조·이식한다.

역할: `counselor`(상담사) · `admin`(관리자=교육담당자) · `defense_education`
(국방교육담당자, 신규) · 익명 사용자(챗봇 이용자, 로그인 없음)

## 1. 현재 상태 (실측)

### motichatbot (통합 대상 = 최종 베이스)
- Next.js 15 App Router, TypeScript. **Supabase 미사용.**
- 데이터: `lib/store.ts` — 파일 기반 JSON 저장소(`.data/store.json`).
  `Store` 인터페이스로 추상화되어 있고, 주석에 이미
  "swap it for a real Postgres/Supabase-backed Store" 라고 명시되어 있음 →
  이번 작업에서 이 스왑을 실제로 수행한다.
- 관리자 인증: `lib/adminAuth.ts` — `ADMIN_PASSWORD` 환경변수 하나를
  해시 비교하는 단일 비밀번호 방식. `admin_session` HttpOnly 쿠키, 8시간.
  주석에도 "replace with real auth (e.g. Supabase Auth, matching
  jmcounseling's pattern)"라고 명시됨.
- 라우트: `app/admin/{login,dashboard,documents}`, `app/api/admin/*`,
  `app/api/chat/*`, `app/chat`, `app/faq`, `app/guide`.
- 챗봇 데이터 모델: `ChatSession`(id, startedAt, endedAt, category, topic,
  turnCount, resolved, escalated, rating), `ChatMessage`(id, sessionId,
  role, content, createdAt). `getStats(range)`가 대시보드 집계를 만든다.

### jmcounseling (패턴 이식 소스)
- Next.js 15 App Router + `@supabase/ssr` + `@supabase/supabase-js`.
- 역할 분리 라우트 그룹: `app/(counselor)/records/*`, `app/(admin)/admin/*`.
  URL에는 영향 없음(그룹 폴더일 뿐) — 코드 스플리팅 목적.
- 인증: `lib/auth.ts`의 `getSession()` — Supabase Auth 유저의
  `app_metadata.{role, counselor_id, display_name}`을 읽어 `SessionInfo`
  반환. **role은 유저가 못 바꾸는 app_metadata에만 저장** (service_role만
  기록 가능 — 클라이언트가 role을 위조할 수 없는 구조).
- `middleware.ts`: 세션 없으면 `/login/counselor`로 리다이렉트.
  `/admin/*`은 role !== 'admin'이면 `/records`로 되돌림.
  **`/records`는 counselor/admin 누구나 이미 접근 가능** (역할 제한 없음 —
  이 구조 덕분에 `defense_education`을 추가해도 미들웨어 수정이 최소화됨).
- 데이터 접근: 브라우저는 Supabase에 직접 접근하지 않음. 유일한 경로는
  `Client → app/api/*/route.ts → lib/records.ts|lib/stats.ts →
  lib/supabase/server.ts(service_role) → Supabase`.
  `SUPABASE_SERVICE_ROLE_KEY`가 RLS를 완전히 우회하므로
  **`lib/supabase/server.ts`는 절대 `'use client'` 코드에서 import 금지**.
- `lib/records.ts`의 `getAllRecords({role, counselorId})`:
  role이 `'counselor'`면 `.eq('counselor_id', counselorId)` 필터,
  `'admin'`이면 전체 반환. 테이블명 `counseling_records`.
- `app/api/records/route.ts`의 `POST`: **role 체크가 없음** — 현재는
  counselor/admin 누구나 기록 생성 가능. `defense_education`을 추가하면
  이 엔드포인트에 role 차단을 반드시 추가해야 함 (아래 4-3 참조).
- 계정 생성: `scripts/seed-auth-users.mjs` — `supabase.auth.admin.createUser`
  로 `email: '{id}@login.jm-counseling.local'`, `app_metadata`에 role 주입.
- `lib/stats.ts`: `period_stats` 테이블에서 관리자 대시보드 통계 조회.
- CLAUDE.md에 "auth는 데모 스텁"이라고 적혀 있으나 **실제 코드(lib/auth.ts,
  middleware.ts)는 이미 실인증이 구현되어 있음 — 문서가 코드보다 오래됨.
  참고만 하고 문서 서술은 무시할 것.**

## 2. 최종 아키텍처 (motichatbot 기준)

```
motichatbot/
 app/
  ├─ chat/                         기존 유지 (로그인 불필요)
  ├─ faq/, guide/                  기존 유지
  ├─ login/
  │    ├─ counselor/               jmcounseling에서 이식
  │    └─ admin/                   jmcounseling에서 이식
  ├─ (counselor)/
  │    └─ records/                 jmcounseling에서 이식 (counselor 전용 작성)
  ├─ (admin)/
  │    └─ admin/
  │         ├─ dashboard/          기존 챗봇 통계 + jmcounseling 상담 통계 통합
  │         ├─ accounts/           jmcounseling에서 이식
  │         └─ documents/          기존 유지 (문서관리)
  └─ api/
       ├─ chat/*                   기존 유지
       ├─ admin/stats/             기존 유지 + 상담 통계 병합
       ├─ records/*                jmcounseling에서 이식
       └─ records/[id]/            jmcounseling에서 이식
 lib/
  ├─ store.ts                      → Supabase 기반으로 교체 (chat_sessions/chat_messages)
  ├─ auth.ts                       jmcounseling에서 이식 + Role에 'defense_education' 추가
  ├─ records.ts                    jmcounseling에서 이식 + defense_education 스코프 추가
  ├─ stats.ts                      jmcounseling에서 이식
  └─ supabase/{server,browser,middleware}.ts   jmcounseling에서 이식
 middleware.ts                     jmcounseling 패턴 이식 (matcher에 기존 챗봇 경로 제외 확인)
```

`/records` URL은 counselor·admin·defense_education 셋 다 접근하고,
데이터 스코프만 역할별로 갈린다 (아래 4-2).

## 3. 작업 순서

### 3-1. Supabase 프로젝트 연결
- **결정: jmcounseling과 동일한 Supabase 프로젝트를 공유한다.** 새 프로젝트
  생성 불필요 — jmcounseling의 `.env.local`에 있는 값을 그대로 가져온다.
- `.env.local`에 jmcounseling과 동일한 키 이름 사용:
  `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 3-2. 스키마
```sql
-- 기존 jmcounseling 테이블: counseling_records, period_stats (마이그레이션 그대로 사용)

-- 챗봇 데이터 이전 (lib/store.ts의 FileStore를 대체)
CREATE TABLE chat_sessions (
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

CREATE TABLE chat_messages (
  id text PRIMARY KEY,
  session_id text REFERENCES chat_sessions(id),
  role text CHECK (role IN ('user','assistant')),
  content text,
  created_at timestamptz DEFAULT now()
);

-- 챗봇→상담 핸드오프 연계 (기존 계획 유지)
CREATE TABLE handoff_links (
  chat_session_id text REFERENCES chat_sessions(id),
  counseling_record_id bigint REFERENCES counseling_records(id),
  created_at timestamptz DEFAULT now()
);

-- 국방교육담당자 조회 이력 (감사 로그)
CREATE TABLE access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  record_id bigint REFERENCES counseling_records(id),
  accessed_at timestamptz DEFAULT now()
);
```
RLS는 jmcounseling과 동일하게 **전면 차단 + service_role 전용 접근** 패턴을
그대로 따른다 (`lib/supabase/server.ts` 방식 재사용).

### 3-3. lib/store.ts → Supabase 전환
- `Store` 인터페이스는 그대로 유지 (호출부 코드 변경 없음).
- `FileStore` 클래스를 `SupabaseStore`로 교체 구현, `chat_sessions`/
  `chat_messages` 테이블에 read/write.
- `getStats(range)`는 기존 집계 로직을 SQL 쿼리 또는 애플리케이션 레벨
  집계로 이식 (기존 반환 타입 `DashboardStats` 그대로 유지).

### 3-4. 인증 이식
- `lib/adminAuth.ts` 삭제. `lib/auth.ts`를 jmcounseling에서 그대로 복사.
- `Role` 타입 확장: `'counselor' | 'admin' | 'defense_education'`
- `app/admin/login` → jmcounseling의 `/login/admin` 화면으로 교체,
  `/login/counselor`도 함께 이식.
- `scripts/seed-auth-users.mjs` 이식 + 계정 추가:
  ```js
  { id: 'defense_dept', password: '<발급 예정>', role: 'defense_education',
    displayName: '국방교육담당자' }
  ```
  (부서 공용 계정 — 요청사항 확정대로. `counselor_id`는 role이
  counselor가 아니므로 임의 placeholder 값 필요 — `getAllRecords`
  로직에서 이 값이 실제로 쓰이지 않는지 3-5에서 확인)

### 3-5. lib/records.ts 확장
```ts
export interface RecordScope {
  role: 'counselor' | 'admin' | 'defense_education';
  counselorId: string;
}

export async function getAllRecords(scope: RecordScope) {
  let query = supabaseServer.from('counseling_records').select('*');
  if (scope.role === 'counselor') {
    query = query.eq('counselor_id', scope.counselorId);
  }
  // admin, defense_education → 전체 (기존 admin 분기 재사용)
  ...
}
```

### 3-6. app/api/records/route.ts — 쓰기 권한 차단 (신규, 현재 jmcounseling에 없음)
```ts
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (session.role === 'defense_education') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  // ...기존 로직
}
```
`app/api/records/[id]/route.ts`의 GET도 동일하게 defense_education을
admin과 같이 전체 열람 허용 (현재 코드는 `role === 'counselor'`일 때만
소유자 체크 → 이미 defense_education에 대해서도 자동으로 통과하므로
**이 파일은 수정 불필요**, 확인만 할 것).

### 3-7. access_logs 기록 (감사 로그)
`app/api/records/[id]/route.ts` GET 안에서 `session.role ===
'defense_education'`일 때 `access_logs`에 insert 한 줄 추가.

### 3-8. 관리자 대시보드 통합
- `components/dashboard/`의 motichatbot 쪽(`CategoryBarChart`,
  `TopicRankList`, `StatCard`)과 jmcounseling 쪽(`AdminDashboard`,
  `BarChart`, `DonutChart`, `StatCard`)이 **이름이 겹침** (`StatCard`).
  **결정: 두 `StatCard`를 하나로 병합한다.** 두 구현을 비교해 props
  스키마(라벨/값/증감(delta)/아이콘 등)를 공통 인터페이스로 통일하고,
  단일 `components/dashboard/StatCard.tsx`로 유지한다. 병합 시 두 곳의
  사용처(motichatbot 대시보드 카드, jmcounseling `AdminDashboard`)가
  깨지지 않는지 각각 확인.
- `app/(admin)/admin/dashboard/page.tsx`에 탭 2개
  (상담 현황 / 챗봇 이용 현황) 또는 상하 섹션 구성 — 병합된 `StatCard`를
  양쪽 섹션에서 공용으로 사용.

### 3-9. 챗봇 → 상담 핸드오프 (기존 계획, 이번 요청 범위 밖이지만 스키마는 3-2에 반영)
- 범위·트리거 로직은 이번 브리프 대상 아님. `handoff_links` 테이블만
  먼저 만들어두고 로직은 별도 작업으로 분리 권장.

## 4. 확정된 요구사항 요약 (이번 대화에서 결정된 것)

| 항목 | 결정 |
|---|---|
| 국방교육담당자 열람 범위 | 개별 상담 기록 전체 (상담사와 동일한 상세) |
| 국방교육담당자 계정 방식 | 부서 공용 계정 1개 (Supabase Auth, `ADMIN_PASSWORD` 방식 아님) |
| 국방교육담당자 쓰기 권한 | 없음 (읽기 전용) |
| 상담사 열람 범위 | 자신이 담당한 케이스만 (`counselor_id` 필터 유지) |
| 국방교육담당자 감사 로그 | `access_logs`로 조회 이력만 기록 (계정이 공용이라 "누가"는 특정 불가, "언제 무엇을"만 추적) |

## 5. 브랜치/PR 안내

- 작업 브랜치: `earingjin/motichatbot` 저장소의 `inter` 브랜치
  (이미 로컬에 생성됨 — Claude Code 실행 환경에서 `git fetch && git
  checkout inter` 또는 `git checkout -b inter` 후 원격에 처음 push).
- 이 저장소를 클론해서 위 내용을 직접 확인했으나, 현재 세션에는 GitHub
  push 권한(토큰)이 없어 원격 브랜치는 아직 생성되지 않은 상태입니다.
  Claude Code 쪽에서 최초 push까지 진행해주세요.

## 6. 확정 사항 (업데이트됨)

| 항목 | 결정 |
|---|---|
| Supabase 프로젝트 | jmcounseling과 동일 프로젝트 공유 |
| StatCard 충돌 | 두 컴포넌트를 하나로 병합 |

## 7. 착수 전 마지막 확인 필요 사항 (남은 것)

1. `defense_dept` 계정의 초기 비밀번호는 누가/어떻게 전달할지 (운영 정책 —
   코드 작업과 무관하므로 Claude Code 작업과 별개로 처리해도 무방)
