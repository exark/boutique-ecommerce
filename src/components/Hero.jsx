import React, { useState, useEffect } from 'react';
import './Hero.css';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Images du slider
  const slides = [
    {
      id: 'hero-1',
      url: '/images/hero/8b99ed79-86a0-49e2-b641-27528a799d13.webp',
      alt: 'Collection tendance 1'
    },
    {
      id: 'hero-2',
      url: '/images/hero/hero-1.webp',
      alt: 'Collection tendance 2'
    },
    {
      id: 'hero-3', 
      url: '/images/hero/hero-2.webp',
      alt: 'Collection tendance 3'
    }
  ];

  // Auto-slide toutes les 8 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Marquer comme chargé après un court délai
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`hero-parallax ${isLoaded ? 'loaded' : 'loading'}`}>
      {/* Slider d'images */}
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${
              index === currentSlide ? 'active' : ''
            } ${
              index === (currentSlide - 1 + slides.length) % slides.length ? 'prev' : ''
            } ${
              index === (currentSlide + 1) % slides.length ? 'next' : ''
            }`}
          >
            <img
              src={slide.url}
              alt={slide.alt}
              className="hero-image"
              loading="eager"
            />
          </div>
        ))}
      </div>

      {/* Hero content */}
      <div className="hero-slogan">
        <h1>Découvrez la nouvelle collection tendance&nbsp;!</h1>
      </div>
    </section>
  );
}