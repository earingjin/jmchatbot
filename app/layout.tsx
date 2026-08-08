import './globals.css';
import { Noto_Sans_KR } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SERVICE_NAME } from '@/config/constants';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

export const metadata = {
  title: SERVICE_NAME,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body>
        <div className="page">
          <Header />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
