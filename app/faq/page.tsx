import Link from 'next/link';
import { FaqList } from '@/components/faq/FaqList';

export default function FaqPage() {
  return (
    <main>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>자주 발생하는 문제</h1>
      <FaqList />
      <Link href="/chat" style={{ color: '#2563eb', fontWeight: 600 }}>
        원하는 답을 못 찾으셨나요? AI에게 질문하기 →
      </Link>
    </main>
  );
}
