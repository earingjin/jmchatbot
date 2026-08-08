# jmchatbot — 버크만 검사 24시 AI 도움센터

버크만 검사 응시자를 위한 익명 AI 트러블슈팅 챗봇 + FAQ + 관리자 통계 대시보드.

**이 앱은 `jm-counseling`(상담사 기록 시스템)과 완전히 독립된 서비스입니다.** 별도 저장소, 별도 배포 단위이며 코드/의존성/DB를 공유하지 않습니다.

## 스코프 (설계 논의에서 확정된 제약)

- 검사 응시자는 로그인/회원가입/본인인증을 하지 않습니다 — 완전 익명, 무상태.
- 실제 버크만 검사 플랫폼(링크·로그인·진행상태·결과)과 연동하지 않습니다 — 안내 문구로만 응답합니다.
- 상담사 인계는 실시간 상담이 아니라 "평일 09:00~18:00 전화 안내" 고정 문구입니다. 사용자가 스스로 전화를 겁니다.
- 영상 가이드는 스코프에서 제외했습니다.

## 실행 방법

```
npm install
cp .env.local.example .env.local
npm run dev   # http://localhost:3000
```

`.env.local`을 채우지 않아도 `LLM_PROVIDER=mock`(기본값)으로 동작합니다 — 실제 LLM 키 없이 데모 가능.

## 아키텍처

- `lib/systemPrompt.ts` — 챗봇의 전체 행동 규칙(분류 → 진단 → 해결 → 종료, 금지사항, 숨김 STATE 태그 출력 형식).
- `lib/llm/client.ts` — `LLMClient` 인터페이스. `LLM_PROVIDER=mock`이면 트리의 한 분기(검사 링크 → 화면 하얗게 나옴)만 재현하는 스크립트형 목업이 동작하고, `LLM_PROVIDER=anthropic`이면 실제 Anthropic API를 호출합니다. 공급자를 바꿔도 `/api/chat`은 수정할 필요 없습니다.
- `lib/stateTag.ts` — LLM 응답 끝의 `<!--STATE:{...}-->` 숨김 태그를 파싱/제거. 이 태그로 `category`/`topic`/`outcome`(success/fail/neutral)을 서버가 구조화된 값으로 받습니다.
- `app/api/chat/route.ts` — 매 요청마다: PII 마스킹 → (같은 topic에서 2회 연속 실패면 LLM 호출 없이 강제로 전화 안내 종료) → LLM 호출 → STATE 파싱 → `chat_sessions`/`chat_messages` 갱신.
- `lib/store.ts` — 저장 계층 인터페이스. 현재는 `.data/store.json` 파일에 저장하는 `FileStore`입니다. (처음엔 순수 메모리 `Map`으로 만들었으나, Next.js가 `app/api/**/route.ts`를 각각 별도 번들로 컴파일하면서 라우트 파일마다 모듈 인스턴스가 분리돼 `/api/chat`에서 만든 세션을 `/api/chat/rate`·`/api/admin/stats`가 못 찾는 문제가 실제로 발생했음 — 파일로 옮겨 해결했다.) **여러 서버리스 인스턴스로 배포하면 인스턴스마다 별도 파일시스템을 가지므로 통계가 어긋납니다** — 실제 운영에서는 같은 인터페이스를 구현하는 Postgres/Supabase 기반 Store로 교체해야 합니다. 스키마는 아래 참고.
- `lib/pii.ts` — 전화번호/이메일/주민번호 패턴을 저장·LLM 전송 전에 마스킹. 정규식 기반이라 모든 변형을 잡아내지 못할 수 있으니, 운영 전 실데이터로 재검증 권장.
- `lib/adminAuth.ts` — 단일 비밀번호(`ADMIN_PASSWORD`) 기반 MVP 인증. 관리자가 여럿이거나 민감도가 높아지면 실제 인증(예: jmcounseling과 동일한 Supabase Auth 패턴)으로 교체 필요.

## DB 스키마 (실제 DB로 교체 시)

```sql
create table chat_sessions (
  id           uuid primary key default gen_random_uuid(),
  started_at   timestamptz not null default now(),
  ended_at     timestamptz,
  category     text,
  topic        text,
  turn_count   int not null default 0,
  consecutive_fail_count int not null default 0,
  resolved     boolean,
  escalated    boolean not null default false,
  rating       smallint,
  created_at   timestamptz not null default now()
);

create table chat_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references chat_sessions(id) on delete cascade,
  role        text not null check (role in ('user','assistant')),
  content     text not null,
  created_at  timestamptz not null default now()
);
```

RLS로 `anon` 접근을 전부 막고, `service_role`은 서버(API 라우트)에서만 사용하세요 — jmcounseling과 동일한 원칙입니다.

## 알려진 MVP 단순화 (프로덕션 전 재검토 필요)

1. **목업 LLM은 전체 14개 문제유형 트리 중 1개 분기만 재현합니다.** 실제 지능은 `LLM_PROVIDER=anthropic` + `ANTHROPIC_API_KEY`/`ANTHROPIC_MODEL` 설정 시 시스템 프롬프트를 통해 나옵니다.
2. **FileStore(`.data/store.json`)는 단일 인스턴스에서만 유효합니다.** 배포 전 Postgres/Supabase 구현으로 교체하세요.
3. **관리자 인증은 단일 공유 비밀번호**입니다. 감사 로그나 개인별 계정이 필요하면 교체하세요.
4. **PII 마스킹은 정규식 기반**이라 완벽하지 않습니다. `chat_messages`는 보존 기간(예: 30일)을 정해 자동 삭제하는 걸 권장합니다.
5. **유입 경로(도메인, 이 사이트로 오는 링크/QR)는 아직 정해지지 않았습니다.**
