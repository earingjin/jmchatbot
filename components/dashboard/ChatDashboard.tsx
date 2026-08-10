'use client';

import { useEffect, useState } from 'react';
import { CategoryBarChart } from './CategoryBarChart';
import { StatCard } from './StatCard';
import { TopicRankList } from './TopicRankList';
import type { DashboardStats } from '@/lib/store';

type Range = 'today' | 'week' | 'month';

/**
 * 챗봇 이용 현황 섹션 (기존 app/admin/dashboard/page.tsx의 내용을 분리).
 * 상담 현황(AdminDashboard)과 상하로 배치되는 섹션이라 페이지 제목은
 * 상위 page.tsx가 담당한다.
 */
export function ChatDashboard() {
  const [range, setRange] = useState<Range>('today');
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch(`/api/admin/stats?range=${range}`)
      .then((res) => res.json())
      .then((data) => setStats(data.stats ?? null));
  }, [range]);

  if (!stats) {
    return <p style={{ padding: 24, color: 'var(--ink-soft)' }}>불러오는 중...</p>;
  }

  const resolutionRate = stats.endedCount ? Math.round((stats.resolvedCount / stats.endedCount) * 100) : 0;
  const escalationRate = stats.totalSessions ? Math.round((stats.escalatedCount / stats.totalSessions) * 100) : 0;

  return (
    <div>
      <div className="tabs">
        {(['today', 'week', 'month'] as const).map((r) => (
          <div key={r} className={`tab ${r === range ? 'active' : ''}`} onClick={() => setRange(r)}>
            {r === 'today' ? '오늘' : r === 'week' ? '이번 주' : '이번 달'}
          </div>
        ))}
      </div>

      <div className="stat-grid">
        <StatCard label="총 문의" value={`${stats.totalSessions}건`} />
        <StatCard label="AI 해결률" value={`${resolutionRate}%`} />
        <StatCard label="상담사 전환율" value={`${escalationRate}%`} />
        <StatCard label="평균 만족도" value={stats.avgRating ? `★${stats.avgRating.toFixed(1)}` : '-'} />
      </div>

      <div className="card">
        <CategoryBarChart counts={stats.categoryCounts} />
      </div>

      <div className="card">
        <TopicRankList topics={stats.topTopics} />
      </div>
    </div>
  );
}
