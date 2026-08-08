import Image from 'next/image';

export function Hero() {
  return (
    <section className="landing-hero">
      <Image
        className="hero-image"
        src="/images/hero.png"
        alt="버크만 진로 안내"
        fill
        priority
        sizes="(max-width: 1200px) 100vw, 1160px"
      />
    </section>
  );
}
