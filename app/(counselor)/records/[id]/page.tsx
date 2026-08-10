import { JournalForm } from '@/components/records/JournalForm';

// Next.js 15+: 동적 라우트의 params는 Promise 입니다.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JournalForm recordId={Number(id)} />;
}
