'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CategoryBarChart } from '@/components/dashboard/CategoryBarChart';
import { StatCard } from '@/components/dashboard/StatCard';
import type { DashboardStats } from '@/lib/store';

type Range = 'today' | 'week' | 'month';

export default function AdminDashboardPage() {
  const [range, setRange] = useState<Range>('today');
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch(`/api/admin/stats?range=${range}`)
      .then((res) => res.json())
      .then((data) => setStats(data.stats ?? null));
  }, [range]);

  if (!stats) {
    return <p>불러오는 중...</p>;
  }

  const resolutionRate = stats.endedCount ? Math.round((stats.resolvedCount / stats.endedCount) * 100) : 0;
  const escalationRate = stats.totalSessions ? Math.round((stats.escalatedCount / stats.totalSessions) * 100) : 0;

  return (
    <main>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, margin: 0 }}>관리자 대시보드</h1>
        <Link href="/admin/documents" style={{ color: '#e4531f', fontSize: 13, fontWeight: 800 }}>AI 참고자료 관리 →</Link>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['today', 'week', 'month'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: r === range ? '2px solid #2563eb' : '1px solid #ddd',
              background: '#fff',
            }}
          >
            {r === 'today' ? '오늘' : r === 'week' ? '이번 주' : '이번 달'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="총 문의" value={`${stats.totalSessions}건`} />
        <StatCard label="AI 해결률" value={`${resolutionRate}%`} />
        <StatCard label="상담사 전환율" value={`${escalationRate}%`} />
        <StatCard label="평균 만족도" value={stats.avgRating ? `★${stats.avgRating.toFixed(1)}` : '-'} />
      </div>

      <CategoryBarChart counts={stats.categoryCounts} />
    </main>
  );
}
