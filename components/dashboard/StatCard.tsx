/**
 * motichatbot 대시보드(값만 있는 카드)와 jmcounseling 대시보드(값+단위+증감)가
 * 각자 StatCard를 갖고 있어 이름이 겹쳤다 — INTEGRATION_BRIEF.md 3-8 결정에 따라
 * props 스키마를 하나로 통일해 병합했다. unit/delta는 선택값이라 motichatbot 쪽
 * 호출부(값을 이미 "12건"처럼 완성된 문자열로 넘기는 방식)는 그대로 동작한다.
 */
export function StatCard({
  label,
  value,
  unit,
  delta,
  deltaDirection = 'up',
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaDirection?: 'up' | 'down';
}) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        {unit && <small>{unit}</small>}
      </div>
      {delta && (
        <div className={`stat-delta ${deltaDirection === 'up' ? 'delta-up' : 'delta-down'}`}>{delta}</div>
      )}
    </div>
  );
}
