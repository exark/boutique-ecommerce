import React, { useCallback, useEffect, useState, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import './Hero.css';
import Button from '@mui/material/Button';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const images = [
  '/images/horizontal-carousel1.jpg',
  '/images/horizontal-carousel2.jpg',
];

export default function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const autoplayRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((idx) => emblaApi && emblaApi.scrollTo(idx), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    const onSelect = () => {
      // emblaApi.selectedScrollSnap() donne toujours l'index logique même en loop
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    onSelect();
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return;
    if (isHovered) return;
    autoplayRef.current = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, 3000);
    return () => clearInterval(autoplayRef.current);
  }, [emblaApi, isHovered]);

  return (
    <section className="hero-carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="hero-slogan">
        <h1>Découvrez la nouvelle collection tendance&nbsp;!</h1>
      </div>
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {images.map((src, idx) => (
            <div className="embla__slide" key={idx}>
              <img src={src} alt={`Slide ${idx + 1}`} className="embla__img" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 