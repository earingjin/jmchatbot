import './globals.css';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SERVICE_NAME } from '@/config/constants';

export const metadata = {
  title: SERVICE_NAME,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
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
