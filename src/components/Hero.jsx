import React, { useState, useRef, useEffect } from 'react';
import './Hero.css';

export default function Hero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for lazy video loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoadVideo) {
            setShouldLoadVideo(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '100px 0px', // Start loading 100px before entering viewport
        threshold: 0.1
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [shouldLoadVideo]);

  // Handle video loading and playback
  useEffect(() => {
    if (shouldLoadVideo && videoRef.current && !isVideoLoaded) {
      const video = videoRef.current;
      
      const handleCanPlay = () => {
        setIsVideoLoaded(true);
        // Ensure video plays after loading
        video.play().catch((error) => {
          console.warn('Video autoplay failed:', error);
        });
      };

      const handleError = () => {
        setHasError(true);
        console.error('Video failed to load');
      };

      video.addEventListener('canplaythrough', handleCanPlay);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('canplaythrough', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [shouldLoadVideo, isVideoLoaded]);

  return (
    <section 
      ref={sectionRef}
      className={`hero-parallax ${
        isVideoLoaded ? 'video-loaded' : 'video-loading'
      } ${hasError ? 'video-error' : ''}`}
    >
      {/* Temporary: No poster image until optimized version is available */}
      <div 
        className={`hero-poster ${isVideoLoaded ? 'fade-out' : 'fade-in'}`}
        style={{
          backgroundColor: '#1a1a1a', // Dark background while video loads
        }}
      />
      
      {/* Loading indicator */}
      {shouldLoadVideo && !isVideoLoaded && !hasError && (
        <div className="hero-loading">
          <div className="loading-spinner"></div>
          <p>Chargement de la vidéo...</p>
        </div>
      )}

      {/* Optimized video with multiple formats */}
      {shouldLoadVideo && (
        <video 
          ref={videoRef}
          className={`hero-video ${isVideoLoaded ? 'visible' : 'hidden'}`}
          muted 
          loop 
          playsInline
          preload="metadata"
        >
          {/* Temporary: Use original video until optimized versions are available */}
          <source src="/images/4782414-uhd_3840_2160_30fps.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      )}
      
      {/* Error fallback */}
      {hasError && (
        <div className="hero-error">
          <p>Impossible de charger la vidéo</p>
        </div>
      )}

      {/* Hero content */}
      <div className="hero-slogan">
        <h1>Découvrez la nouvelle collection tendance&nbsp;!</h1>
      </div>
    </section>
  );
}