/**
 * 로그인 화면의 ID(예: counselor_kim)를 Supabase Auth가 요구하는 이메일 형식으로 매핑.
 * 실제 발송되는 이메일이 아니라 내부 식별용 합성 값이다.
 * jmcounseling과 Supabase 프로젝트(및 Auth 사용자 풀)를 공유하므로
 * 동일한 도메인을 그대로 사용한다.
 */
export function toLoginEmail(id: string) {
  return `${id}@login.jm-counseling.local`;
}
