import Image from 'next/image';
import hero3 from './hero3.png';

export function Hero() {
  return (
    <section className="landing-hero">
      <Image
        className="hero-image"
        src={hero3}
        alt="버크만 진로 안내"
        fill
        priority
        sizes="(max-width: 1200px) 100vw, 1160px"
      />
    </section>
  );
}
