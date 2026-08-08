import { ESCALATION_MESSAGE } from '@/config/constants';
import { COLORS } from '@/config/theme';

export function Footer() {
  return (
    <footer
      style={{
        position: 'sticky',
        bottom: 0,
        width: '100%',
        background: COLORS.text,
        borderTop: `3px solid ${COLORS.accent}`,
        color: '#fff',
        textAlign: 'center',
        padding: '10px 12px',
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {ESCALATION_MESSAGE}
    </footer>
  );
}
