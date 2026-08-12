'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import banner from './banner.png';
import hero3 from './hero3.png';

const SLIDES = [
  { src: hero3, alt: '버크만 진로 안내' },
  { src: '/images/hero.png', alt: '버크만 진로 안내' },
  { src: banner, alt: '배너 이미지' },
];

const AUTO_ADVANCE_MS = 5000;

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startAutoplay() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);
  }

  useEffect(() => {
    startAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function handleIndicatorClick(index: number) {
    setActiveIndex(index);
    startAutoplay();
  }

  return (
    <section className="landing-hero">
      {SLIDES.map((slide, index) => (
        <div
          key={typeof slide.src === 'string' ? slide.src : index}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: index === activeIndex ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          <Image
            className="hero-image"
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="(max-width: 1200px) 100vw, 1160px"
          />
        </div>
      ))}

      <div className="hero-indicators">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`hero-indicator ${index === activeIndex ? 'active' : ''}`}
            aria-label={`${index + 1}번 배너 보기`}
            aria-current={index === activeIndex}
            onClick={() => handleIndicatorClick(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
