'use client';

import { useEffect, useState } from 'react';
import { PeriodStats, Period } from '@/lib/stats';
import { StatCard } from './StatCard';
import { BarChart } from './BarChart';
import { DonutChart } from './DonutChart';

const COUNSELOR_TABLE = [
  { name: '김상담', assigned: 14, done: 13, rate: 93 },
  { name: '이지원', assigned: 11, done: 9, rate: 82 },
  { name: '박훈련', assigned: 9, done: 8, rate: 89 },
  { name: '최전직', assigned: 8, done: 7, rate: 88 },
];

/**
 * 상담·진단 현황 섹션. 원래 jmcounseling에서는 이 컴포넌트가 페이지 전체
 * (page-head 포함)를 그렸지만, motichatbot 통합 대시보드에서는 챗봇 현황과
 * 상하로 배치되는 한 섹션이라 페이지 제목/여백은 상위 page.tsx가 담당한다.
 */
export function AdminDashboard() {
  const [period, setPeriod] = useState<Period>('week');
  const [stats, setStats] = useState<PeriodStats | null>(null);

  useEffect(() => {
    fetch(`/api/stats?period=${period}`)
      .then((r) => r.json())
      .then(setStats);
  }, [period]);

  return (
    <div>
      <div className="tabs">
        <div className={`tab ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>
          주간
        </div>
        <div className={`tab ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>
          월간
        </div>
      </div>

      {!stats && <div style={{ padding: 24, color: 'var(--ink-soft)' }}>불러오는 중...</div>}

      {stats && (
        <>
          <div className="stat-grid">
            <StatCard label="상담 예약 건수" value={stats.reserved} unit="건" delta={stats.reserved_delta} deltaDirection="up" />
            <StatCard label="상담 진행 완료" value={stats.progressed} unit="건" delta={stats.progressed_delta} deltaDirection="up" />
            <StatCard label="버크만 진단 완료" value={stats.burkman_done} unit="건" delta={stats.burkman_done_delta} deltaDirection="up" />
            <StatCard label="버크만 진단 미완료" value={stats.burkman_pending} unit="건" delta={stats.burkman_pending_delta} deltaDirection="down" />
          </div>

          <div className="chart-row">
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="panel-title">{stats.chart1_title}</div>
              <p className="panel-sub">요일별 예약 대비 실제 진행 완료 건수</p>
              <BarChart bars={stats.bars} />
              <div className="legend">
                <span>
                  <i style={{ background: '#D8DDD1' }} /> 예약
                </span>
                <span>
                  <i style={{ background: 'var(--brass)' }} /> 진행완료
                </span>
              </div>
            </div>
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="panel-title">{stats.chart2_title}</div>
              <p className="panel-sub">완료 / 미완료 비율</p>
              <DonutChart pct={stats.donut_pct} done={stats.burkman_done} pending={stats.burkman_pending} />
            </div>
          </div>

          <div className="card">
            <div className="panel-title">상담사별 진행 현황</div>
            <p className="panel-sub">
              이번 <span>{stats.period_label}</span> 개인별 상담 건수
            </p>
            <table className="counselor-table">
              <thead>
                <tr>
                  <th>상담사</th>
                  <th>배정 건수</th>
                  <th>진행완료</th>
                  <th>완료율</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {COUNSELOR_TABLE.map((c) => (
                  <tr key={c.name}>
                    <td>{c.name}</td>
                    <td className="num">{c.assigned}</td>
                    <td className="num">{c.done}</td>
                    <td className="num">{c.rate}%</td>
                    <td>
                      <div className="mini-bar-bg">
                        <div className="mini-bar-fill" style={{ width: `${c.rate}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
