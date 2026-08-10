import Link from 'next/link';

/**
 * jmcounseling의 Landing.tsx(다크/라이트 스플릿 레이아웃)를 참고해 만든
 * 로그인 유형 선택 화면. 카드가 상담사/관리자 2개에서 국방전직교육원 담당자를 더해 3개로 늘었다.
 */
export function RoleSelect() {
  return (
    <div className="landing">
      <div className="landing-visual">
        <div className="lv-top">
          <Link href="/" className="btn-ghost-dark" style={{ marginBottom: 18 }}>← 메인으로</Link>
          <div className="brand">
            <span className="header-brand-mark" aria-hidden="true">B</span>
            <div className="brand-text">
              버크만 AI 도움센터
              <small>BIRKMAN CAREER · AI HELP CENTER</small>
            </div>
          </div>
        </div>
        <div>
          <div className="lv-eyebrow">AI 상담 · 상담기록 통합 포털</div>
          <h1 className="lv-title">
            AI가 먼저 응답하고,
            <br />
            필요한 순간 사람이 이어받습니다.
          </h1>
          <p className="lv-desc">
            익명 사용자는 챗봇에서 바로 도움을 받고, 상담사·관리자·국방전직교육원 담당자는
            역할에 맞는 범위로 상담 기록과 검사 현황을 확인합니다.
          </p>
        </div>
        <div className="lv-footer">
          <div><b>AI 챗봇</b> 24시간 상시 응대</div>
          <div><b>상담사 연계</b> 필요 시 즉시 전환</div>
          <div><b>개인정보 최소화</b> 전화번호 뒷자리로만 식별</div>
        </div>
      </div>
      <div className="landing-actions">
        <div className="la-inner">
          <div className="la-head">
            <div className="eyebrow">상담관리시스템</div>
            <h2>로그인 유형을 선택하세요</h2>
            <p>역할에 따라 열람할 수 있는 범위가 다릅니다.</p>
          </div>

          <Link href="/login/counselor" className="role-card">
            <div className="role-icon">☎</div>
            <div className="role-card-body">
              <h3>상담사 로그인</h3>
            </div>
            <div className="role-card-arrow">→</div>
          </Link>

          <Link href="/login/admin" className="role-card">
            <div className="role-icon alt">▦</div>
            <div className="role-card-body">
              <h3>관리자 로그인</h3>
            </div>
            <div className="role-card-arrow">→</div>
          </Link>

          <Link href="/login/defense" className="role-card">
            <div className="role-icon alt2">⛨</div>
            <div className="role-card-body">
              <h3>국방전직교육원 담당자 로그인</h3>
            </div>
            <div className="role-card-arrow">→</div>
          </Link>

          <div className="la-note">
            발급받은 계정으로만 로그인할 수 있습니다. 계정 문의는 관리자에게 연락해 주세요.
          </div>
        </div>
      </div>
    </div>
  );
}
