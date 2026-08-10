export function Seal({ color = '#C7A45E' }: { color?: string }) {
  return (
    <svg className="seal" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke={color} strokeWidth="1.3" />
      <circle cx="20" cy="20" r="13" stroke={color} strokeWidth="1" />
      <text x="20" y="24" textAnchor="middle" fontFamily="Pretendard, Noto Sans KR, sans-serif" fontSize="10" fill={color} fontWeight="600">
        JM
      </text>
    </svg>
  );
}
