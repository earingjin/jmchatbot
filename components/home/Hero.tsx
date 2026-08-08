import Image from 'next/image';

export function Hero() {
  return (
    <section className="landing-hero">
      <Image
        className="hero-image"
        src="/images/birkman-career-hero.png"
        alt="버크만으로 취업 진로 준비하기"
        fill
        priority
        sizes="(max-width: 1200px) 100vw, 1160px"
      />
    </section>
  );
}
