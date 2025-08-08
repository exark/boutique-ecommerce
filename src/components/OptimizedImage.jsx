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
  sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (min-width: 1024px) 100vw',
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
        webp: null, // Imgur doesn't support WebP conversion via URL params
        avif: null,
        jpg: {
          srcSet: `${imageName}?w=400 400w, ${imageName}?w=800 800w, ${imageName}?w=1200 1200w`,
          src: imageName,
          fallback: imageName
        }
      };
    }
    
    // Handle Imgur IDs (just the ID without full URL) - Enable responsive sizes
    if (/^[a-zA-Z0-9]{7}$/.test(imageName)) {
      const imgurBase = `https://i.imgur.com/${imageName}`;
      const isDesktop = window.innerWidth >= 1024;
      
      return {
        webp: null, // Imgur doesn't support WebP
        avif: null,
        jpg: {
          // Desktop: True original quality (no compression), Mobile: Optimized sizes for performance
          srcSet: isDesktop 
            ? null // No srcSet on desktop = browser uses src directly (original quality)
            : `${imgurBase}s.jpg 400w, ${imgurBase}m.jpg 800w, ${imgurBase}l.jpg 1200w`,
          // Use the highest quality available format for desktop
          src: isDesktop ? `${imgurBase}.jpg` : `${imgurBase}m.jpg`, // Original .jpg is the highest quality Imgur provides
          fallback: `${imgurBase}.jpg`
        }
      };
    }
    
    // Handle local images - enable modern formats for local images
    const fullPath = imageName.startsWith('/') ? imageName : `/images/${imageName}`;
    const baseName = fullPath.replace(/\.[^/.]+$/, '');
    
    return {
      webp: {
        srcSet: `${baseName}?format=webp&w=400 400w, ${baseName}?format=webp&w=800 800w, ${baseName}?format=webp&w=1200 1200w`,
        src: `${baseName}?format=webp&w=800`,
        fallback: fullPath
      },
      avif: {
        srcSet: `${baseName}?format=avif&w=400 400w, ${baseName}?format=avif&w=800 800w, ${baseName}?format=avif&w=1200 1200w`,
        src: `${baseName}?format=avif&w=800`,
        fallback: fullPath
      },
      jpg: {
        srcSet: `${baseName}?w=400 400w, ${baseName}?w=800 800w, ${baseName}?w=1200 1200w`,
        src: `${baseName}?w=800`,
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
    
    // For Imgur images, try different quality fallbacks for desktop
    if (currentSrc.includes('imgur.com')) {
      const isDesktop = window.innerWidth >= 1024;
      
      if (isDesktop) {
        // Desktop quality fallback sequence: .png -> .jpg -> l.jpg -> m.jpg
        if (currentSrc.includes('.png')) {
          e.target.src = currentSrc.replace('.png', '.jpg');
          return;
        } else if (currentSrc.endsWith('.jpg') && !currentSrc.includes('l.jpg') && !currentSrc.includes('m.jpg') && !currentSrc.includes('s.jpg')) {
          // Try large size if original fails
          e.target.src = currentSrc.replace('.jpg', 'l.jpg');
          return;
        } else if (currentSrc.includes('l.jpg')) {
          // Try medium size
          e.target.src = currentSrc.replace('l.jpg', 'm.jpg');
          return;
        }
      } else {
        // Mobile fallback sequence (existing logic)
        if (currentSrc.includes('.webp')) {
          e.target.src = currentSrc.replace('.webp', '.jpg');
          return;
        }
        if (currentSrc.includes('l.jpg')) {
          e.target.src = currentSrc.replace('l.jpg', 'm.jpg');
          return;
        } else if (currentSrc.includes('m.jpg')) {
          e.target.src = currentSrc.replace('m.jpg', 's.jpg');
          return;
        } else if (currentSrc.includes('s.jpg')) {
          e.target.src = currentSrc.replace('s.jpg', '.jpg');
          return;
        }
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
          <picture>
            {/* AVIF format for modern browsers (local images only) */}
            {responsiveUrls.avif && (
              <source
                srcSet={responsiveUrls.avif.srcSet}
                sizes={sizes}
                type="image/avif"
              />
            )}
            
            {/* WebP format fallback (local images only) */}
            {responsiveUrls.webp && (
              <source
                srcSet={responsiveUrls.webp.srcSet}
                sizes={sizes}
                type="image/webp"
              />
            )}
            
            {/* Original format fallback */}
            <img
              ref={imgRef}
              src={responsiveUrls.jpg.src}
              {...(responsiveUrls.jpg.srcSet && { srcSet: responsiveUrls.jpg.srcSet })}
              alt={alt}
              loading={effectiveLoading}
              {...(responsiveUrls.jpg.srcSet && { sizes })}
              decoding="async"
              className="optimized-image"
              style={{ objectFit }}
              onLoad={handleLoad}
              onError={handleImageError}
            />
          </picture>
        )
      )}
    </div>
  );
};

export default OptimizedImage;
