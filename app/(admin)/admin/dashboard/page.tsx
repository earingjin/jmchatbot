import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { ChatDashboard } from '@/components/dashboard/ChatDashboard';

export default function Page() {
  return (
    <div className="cns-page">
      <div className="page-head">
        <div>
          <div className="eyebrow">관리자 대시보드</div>
          <h1>상담 · 챗봇 통합 현황</h1>
          <p className="page-sub">상담 진행 현황과 챗봇 이용 현황을 한 화면에서 확인합니다.</p>
        </div>
      </div>

      <section style={{ marginBottom: 40 }}>
        <div className="panel-title" style={{ fontSize: 16, marginBottom: 14 }}>상담 현황</div>
        <AdminDashboard />
      </section>

      <section>
        <div className="panel-title" style={{ fontSize: 16, marginBottom: 14 }}>챗봇 이용 현황</div>
        <ChatDashboard />
      </section>
    </div>
  );
}
