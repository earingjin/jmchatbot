import { BirkmanIntro } from '@/components/home/BirkmanIntro';
import { Hero } from '@/components/home/Hero';
import { QuickLinks } from '@/components/home/QuickLinks';

export default function HomePage() {
  return (
    <main className="landing-page">
      <Hero />
      <QuickLinks />
      <BirkmanIntro />
    </main>
  );
}
