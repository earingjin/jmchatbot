import './globals.css';
import { Noto_Sans_KR } from 'next/font/google';
import { SERVICE_NAME } from '@/config/constants';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

export const metadata = {
  title: SERVICE_NAME,
};

/**
 * 공개 챗봇 사이트와 상담사/관리자 포털이 하나의 Next.js 앱을 공유하므로,
 * 이 최상위 레이아웃은 <html>/<body>와 폰트만 담당한다. 챗봇 전용 Header/Footer는
 * app/(site)/layout.tsx로, 포털 전용 TopBar는 app/(counselor|admin)/layout.tsx로 옮겼다.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body>{children}</body>
    </html>
  );
}
