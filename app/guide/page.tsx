import Link from 'next/link';
import { GUIDE_SECTIONS } from '@/lib/guideContent';

export default function GuidePage() {
  return (
    <main>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>검사방법 안내</h1>
      {GUIDE_SECTIONS.map((section) => (
        <section key={section.title} style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, marginBottom: 6 }}>{section.title}</h2>
          <p style={{ color: '#444', lineHeight: 1.6, margin: 0 }}>{section.body}</p>
        </section>
      ))}
      <Link href="/chat" style={{ color: '#2563eb', fontWeight: 600 }}>
        여전히 문제가 있으신가요? AI에게 질문하기 →
      </Link>
    </main>
  );
}
