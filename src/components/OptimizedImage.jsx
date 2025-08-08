import React, { useState, useEffect, useRef } from 'react';
import './OptimizedImage.css';

// Helper function to generate srcset for modern formats
const generateModernSrcSet = (src, sizes = [400, 800, 1200]) => {
  if (src.includes('imgur.com')) {
    // For Imgur images, use their built-in resizing
    return sizes.map(size => `${src.replace('.jpg', 'm.jpg')} ${size}w`).join(', ');
  }
  
  // For local images, assume Vite imagetools processing
  const baseSrc = src.replace(/\.(jpg|jpeg|png)$/i, '');
  return sizes.map(size => `${baseSrc}?w=${size}&format=webp ${size}w`).join(', ');
};

const generateAvifSrcSet = (src, sizes = [400, 800, 1200]) => {
  if (src.includes('imgur.com')) {
    return null; // Imgur doesn't support AVIF yet
  }
  
  const baseSrc = src.replace(/\.(jpg|jpeg|png)$/i, '');
  return sizes.map(size => `${baseSrc}?w=${size}&format=avif ${size}w`).join(', ');
};

const OptimizedImage = ({
  src,
  alt,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading = 'lazy',
  priority = false,
  aspectRatio = '1/1',
  objectFit = 'cover',
  placeholder = true,
  onLoad,
  onError,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const effectiveLoading = priority ? 'eager' : 'lazy';

  // Intersection Observer pour preload agressif sur mobile
  useEffect(() => {
    if (priority || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        // Preload plus agressif sur mobile - 200px avant d'être visible
        rootMargin: window.innerWidth <= 768 ? '200px' : '100px',
        threshold: 0.01
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [priority]);

  // Generate responsive image URLs - supports both local and Imgur images
  const generateResponsiveUrls = (imageName) => {
    if (!imageName) return { webp: null, avif: null, jpg: { src: '', fallback: '' } };
    
    // Handle Imgur images (full URLs)
    if (imageName.includes('imgur.com')) {
      return {
        webp: null,
        avif: null,
        jpg: {
          srcSet: null,
          src: imageName,
          fallback: imageName
        }
      };
    }
    
    // Handle Imgur IDs (just the ID without full URL)
    if (/^[a-zA-Z0-9]{7}$/.test(imageName)) {
      const imgurUrl = `https://i.imgur.com/${imageName}.jpg`;
      return {
        webp: null,
        avif: null,
        jpg: {
          srcSet: null,
          src: imgurUrl,
          fallback: imgurUrl
        }
      };
    }
    
    // Handle local images - use simple path resolution
    const fullPath = imageName.startsWith('/') ? imageName : `/images/${imageName}`;
    
    return {
      webp: null,
      avif: null,
      jpg: {
        srcSet: null,
        src: fullPath,
        fallback: fullPath
      }
    };
  };

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleImageError = (e) => {
    const currentSrc = e.target.src;
    
    // For Imgur images, try different fallbacks
    if (currentSrc.includes('imgur.com')) {
      // Try WebP to JPG fallback first
      if (currentSrc.includes('.webp')) {
        e.target.src = currentSrc.replace('.webp', '.jpg');
        return;
      }
      // Then try size fallbacks
      if (currentSrc.includes('l.jpg')) {
        // Try medium size
        e.target.src = currentSrc.replace('l.jpg', 'm.jpg');
        return;
      } else if (currentSrc.includes('m.jpg')) {
        // Try small size
        e.target.src = currentSrc.replace('m.jpg', 's.jpg');
        return;
      } else if (currentSrc.includes('s.jpg')) {
        // Try original size
        e.target.src = currentSrc.replace('s.jpg', '.jpg');
        return;
      }
    }
    
    // For local images, try fallback to original image if optimized version fails
    if (!currentSrc.includes('original-') && !currentSrc.includes('imgur.com')) {
      const originalSrc = src.startsWith('/') ? src : `/images/${src}`;
      e.target.src = originalSrc;
      return;
    }
    
    setImageError(true);
    // Notify parent components of the failure after all fallbacks have been attempted
    onError?.(e);
  };

  const responsiveUrls = generateResponsiveUrls(src);

  return (
    <div
      ref={containerRef}
      className={`optimized-image-container ${className} ${isLoaded ? 'loaded' : 'loading'}`}
      style={{ aspectRatio }}
      {...props}
    >
      {placeholder && !isLoaded && !imageError && (
        <div className="optimized-image-skeleton" />
      )}
      
      {imageError ? (
        <div className="optimized-image-error">
          <span>Image failed to load</span>
        </div>
      ) : (
        /* Chargement conditionnel basé sur la visibilité */
        (isInView || priority) && (
          <img
            ref={imgRef}
            src={responsiveUrls.jpg.src}
            alt={alt}
            loading={effectiveLoading}
            sizes={sizes}
            decoding="async"
            className="optimized-image"
            style={{ objectFit }}
            onLoad={handleLoad}
            onError={handleImageError}
          />
        )
      )}
    </div>
  );
};

export default OptimizedImage;
