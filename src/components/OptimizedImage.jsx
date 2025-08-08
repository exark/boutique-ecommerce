import React, { useState } from 'react';
import './OptimizedImage.css';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading = 'eager',
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
  const effectiveLoading = priority ? 'eager' : loading;

  // Generate responsive image URLs - supports both local and Imgur images
  const generateResponsiveUrls = (imageName) => {
    if (!imageName) return { webp: '', avif: '', jpg: '' };
    
    // Check if it's an Imgur URL or ID
    const isImgurUrl = imageName.includes('imgur.com') || imageName.includes('i.imgur.com');
    const isImgurId = /^[a-zA-Z0-9]{7}$/.test(imageName); // Imgur IDs are 7 characters
    
    if (isImgurUrl || isImgurId) {
      // Handle Imgur images
      let imgurId;
      if (isImgurUrl) {
        // Extract ID from URL like https://i.imgur.com/XKg6kvm.jpg
        const match = imageName.match(/\/([a-zA-Z0-9]{7})(?:\.[a-zA-Z]+)?$/);
        imgurId = match ? match[1] : imageName;
      } else {
        imgurId = imageName;
      }
      
      // Imgur responsive URLs
      const imgurBase = `https://i.imgur.com/${imgurId}`;
      return {
        webp: {
          srcSet: [
            `${imgurBase}s.jpg 400w`,  // Small (400px max)
            `${imgurBase}m.jpg 800w`,  // Medium (800px max)
            `${imgurBase}l.jpg 1200w`  // Large (1200px max)
          ].join(', '),
          src: `${imgurBase}m.jpg`,
          fallback: `${imgurBase}.jpg`
        },
        avif: {
          srcSet: [
            `${imgurBase}s.jpg 400w`,
            `${imgurBase}m.jpg 800w`,
            `${imgurBase}l.jpg 1200w`
          ].join(', '),
          src: `${imgurBase}m.jpg`,
          fallback: `${imgurBase}.jpg`
        },
        jpg: {
          srcSet: [
            `${imgurBase}s.jpg 400w`,
            `${imgurBase}m.jpg 800w`,
            `${imgurBase}l.jpg 1200w`
          ].join(', '),
          src: `${imgurBase}m.jpg`,
          fallback: `${imgurBase}.jpg`
        }
      };
    }
    
    // Handle local images (existing logic)
    const fullPath = imageName.startsWith('/') ? imageName : `/images/${imageName}`;
    const baseName = fullPath.replace(/\.[^/.]+$/, ''); // Remove extension
    const originalPath = fullPath;
    
    return {
      webp: {
        srcSet: [
          `${baseName}?format=webp&w=400 400w`,
          `${baseName}?format=webp&w=800 800w`,
          `${baseName}?format=webp&w=1200 1200w`
        ].join(', '),
        src: `${baseName}?format=webp&w=800`,
        fallback: originalPath
      },
      avif: {
        srcSet: [
          `${baseName}?format=avif&w=400 400w`,
          `${baseName}?format=avif&w=800 800w`,
          `${baseName}?format=avif&w=1200 1200w`
        ].join(', '),
        src: `${baseName}?format=avif&w=800`,
        fallback: originalPath
      },
      jpg: {
        srcSet: [
          `${baseName}?format=jpg&w=400 400w`,
          `${baseName}?format=jpg&w=800 800w`,
          `${baseName}?format=jpg&w=1200 1200w`
        ].join(', '),
        src: `${baseName}?format=jpg&w=800`,
        fallback: originalPath
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
        /* Temporary: Use original images directly until FFmpeg is installed */
        <img
          src={responsiveUrls.jpg.fallback}
          alt={alt}
          loading={effectiveLoading}
          sizes={sizes}
          decoding="async"
          className="optimized-image"
          style={{ objectFit }}
          onLoad={handleLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
