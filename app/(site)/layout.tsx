import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

/**
 * 공개 챗봇 사이트(= 사용자 페이지, 홈/채팅/FAQ/가이드) 전용 레이아웃.
 * 상담사·관리자 포털(/login, /records, /admin/*)은 이 그룹 밖에 있어
 * 여기 Header/Footer와 .page 래퍼의 영향을 받지 않는다.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="page">
        <Header />
        {children}
      </div>
      <Footer />
    </>
  );
}
