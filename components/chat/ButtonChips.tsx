import { COLORS, RADIUS } from '@/config/theme';

export function ButtonChips({
  options,
  disabled,
  onSelect,
}: {
  options: string[];
  disabled: boolean;
  onSelect: (label: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, marginLeft: 4 }}>
      {options.map((label) => (
        <button
          key={label}
          disabled={disabled}
          onClick={() => onSelect(label)}
          style={{
            padding: '8px 14px',
            borderRadius: RADIUS.pill,
            border: `1px solid ${COLORS.accent}`,
            background: COLORS.card,
            color: COLORS.accentDark,
            fontSize: 13,
            fontWeight: 700,
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
