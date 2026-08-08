import { SERVICE_NAME } from '@/config/constants';

export function Hero() {
  return (
    <section style={{ textAlign: 'center', padding: '32px 0 24px' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>{SERVICE_NAME}</h1>
      <p style={{ color: '#555', fontSize: 15 }}>
        검사 중 어려움이 있으신가요?
        <br />
        AI가 24시간 도와드립니다.
      </p>
    </section>
  );
}
