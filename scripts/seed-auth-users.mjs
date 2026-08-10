// 로그인 계정을 Supabase Auth에 생성하거나 최신 상태로 갱신한다.
// jmcounseling과 동일한 Supabase 프로젝트(Auth 사용자 풀)를 공유한다.
// 실행: npm run seed:auth
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 .env.local에 설정해 주세요.');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

function toLoginEmail(id) {
  return `${id}@login.jm-counseling.local`;
}

const accounts = [
  { id: 'counselor_kim', password: 'demo1234', role: 'counselor', displayName: '김상담' },
  { id: 'admin_jm', password: 'admin1234', role: 'admin', displayName: '관리자' },
  {
    id: 'defense_dept',
    // 부서 공용 계정 — 초기 비밀번호는 DEFENSE_DEPT_PASSWORD 환경변수로 주입한다.
    // 운영 정책(누가/어떻게 전달할지)이 아직 확정되지 않았으므로 하드코딩하지 않음
    // (INTEGRATION_BRIEF.md 7번 참조).
    password: process.env.DEFENSE_DEPT_PASSWORD,
    role: 'defense_education',
    displayName: '국방전직교육원 담당자',
    // counselor_id는 role이 counselor가 아닐 때는 쓰이지 않는 placeholder.
    counselorId: 'defense_dept',
  },
];

for (const account of accounts) {
  if (!account.password) {
    console.error(`- ${account.id} 계정 건너뜀: 비밀번호가 설정되지 않았습니다.`);
    process.exitCode = 1;
    continue;
  }

  const email = toLoginEmail(account.id);
  const attributes = {
    email,
    password: account.password,
    email_confirm: true,
    app_metadata: {
      role: account.role,
      counselor_id: account.counselorId ?? account.id,
      display_name: account.displayName,
    },
  };

  const { data: created, error: createError } = await supabase.auth.admin.createUser(attributes);
  if (!createError && created.user) {
    console.log(`+ ${account.id} 계정 생성 완료 (${account.role})`);
    continue;
  }

  if (!createError?.message?.toLowerCase().includes('already been registered')) {
    console.error(`- ${account.id} 계정 생성 실패: ${createError?.message}`);
    process.exitCode = 1;
    continue;
  }

  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const existing = usersData?.users.find((user) => user.email === email);
  if (listError || !existing) {
    console.error(`- ${account.id} 기존 계정을 찾지 못했습니다: ${listError?.message ?? '사용자 없음'}`);
    process.exitCode = 1;
    continue;
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, attributes);
  if (updateError) {
    console.error(`- ${account.id} 계정 갱신 실패: ${updateError.message}`);
    process.exitCode = 1;
    continue;
  }

  console.log(`✓ ${account.id} 비밀번호와 권한 갱신 완료 (${account.role})`);
}
