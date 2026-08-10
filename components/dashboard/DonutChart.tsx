export function DonutChart({
  pct,
  done,
  pending,
}: {
  pct: number;
  done: number;
  pending: number;
}) {
  const circumference = 2 * Math.PI * 15.9;
  const doneLen = (pct / 100) * circumference;

  return (
    <div className="donut-wrap">
      <svg width="120" height="120" viewBox="0 0 42 42">
        <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#E7E4D9" strokeWidth="6" />
        <circle
          cx="21"
          cy="21"
          r="15.9"
          fill="transparent"
          stroke="#9C7A3E"
          strokeWidth="6"
          strokeDasharray={`${doneLen.toFixed(1)} ${(circumference - doneLen).toFixed(1)}`}
          strokeDashoffset="25"
          transform="rotate(-90 21 21)"
        />
        <text x="21" y="24" textAnchor="middle" fontFamily="Pretendard, Noto Sans KR, sans-serif" fontSize="8" fill="#1E2A38" fontWeight="600">
          {pct}%
        </text>
      </svg>
      <div className="donut-legend" style={{ flex: 1 }}>
        <div className="dl-row">
          <span className="dl-key">
            <span className="dl-dot" style={{ background: '#9C7A3E' }} />
            완료
          </span>
          <b className="num">{done}건</b>
        </div>
        <div className="dl-row">
          <span className="dl-key">
            <span className="dl-dot" style={{ background: '#E7E4D9' }} />
            미완료
          </span>
          <b className="num">{pending}건</b>
        </div>
        <div className="dl-row">
          <span className="dl-key">대상 총원</span>
          <b className="num">{done + pending}명</b>
        </div>
      </div>
    </div>
  );
}
