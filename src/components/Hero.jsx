import React, { useCallback, useEffect, useState, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import './Hero.css';
import Button from '@mui/material/Button';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const images = [
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
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
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {images.map((src, idx) => (
            <div className="embla__slide" key={idx}>
              <img src={src} alt={`Slide ${idx + 1}`} className="embla__img" />
            </div>
          ))}
        </div>
        <Button
          className="embla__button embla__button--prev"
          onClick={scrollPrev}
          aria-label="Précédent"
          variant="contained"
          sx={{ minWidth: 0, width: 44, height: 44, borderRadius: 2, position: 'absolute', left: 32, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: '#fff', color: '#222', boxShadow: 1, '&:hover': { background: 'var(--color-accent)', color: '#fff', borderColor: 'var(--color-accent)' } }}
        >
          <ChevronLeftIcon fontSize="medium" />
        </Button>
        <Button
          className="embla__button embla__button--next"
          onClick={scrollNext}
          aria-label="Suivant"
          variant="contained"
          sx={{ minWidth: 0, width: 44, height: 44, borderRadius: 2, position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: '#fff', color: '#222', boxShadow: 1, '&:hover': { background: 'var(--color-accent)', color: '#fff', borderColor: 'var(--color-accent)' } }}
        >
          <ChevronRightIcon fontSize="medium" />
        </Button>
      </div>
      <div
        className="embla__dots"
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: window.innerWidth < 900 ? 12 : 32
        }}
      >
        {scrollSnaps.map((_, idx) => (
          <button
            key={idx}
            className={`embla__dot${idx === selectedIndex ? ' is-selected' : ''}`}
            type="button"
            onClick={() => scrollTo(idx)}
            aria-label={`Aller à la slide ${idx + 1}`}
            style={{
              minWidth: 18,
              height: 18,
              borderRadius: '4px',
              background: idx === selectedIndex ? 'var(--color-accent)' : '#fff',
              border: idx === selectedIndex ? '2px solid var(--color-accent)' : '2px solid #eee',
              color: 'transparent',
              boxShadow: idx === selectedIndex ? '0 2px 8px rgba(247,86,124,0.18)' : 'none',
              margin: '0 4px',
              cursor: 'pointer',
              outline: 'none',
              transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
            }}
          />
        ))}
      </div>
    </section>
  );
} 