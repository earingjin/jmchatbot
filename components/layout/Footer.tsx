import { ESCALATION_MESSAGE } from '@/config/constants';

export function Footer() {
  return (
    <footer
      style={{
        position: 'sticky',
        bottom: 0,
        width: '100%',
        background: '#1a1a1a',
        color: '#fff',
        textAlign: 'center',
        padding: '10px 12px',
        fontSize: 13,
      }}
    >
      {ESCALATION_MESSAGE}
    </footer>
  );
}
