import React, { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';
import './MultiImageCard.css';

const MultiImageCard = ({ 
  product, 
  className = '', 
  aspectRatio = '1/1',
  objectFit = 'cover',
  showIndicators = true,
  autoRotate = false,
  autoRotateInterval = 2000,
  priority = false, // Nouvelle prop pour la priorité de chargement
  ...props 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Utiliser images ou fallback sur image unique
  const images = product.images || [product.image];
  const hasMultipleImages = images.length > 1;

  // Auto-rotation des images au hover
  useEffect(() => {
    if (!hasMultipleImages || !isHovered || !autoRotate) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [isHovered, hasMultipleImages, images.length, autoRotate, autoRotateInterval]);

  // Changer d'image au hover (sans auto-rotation)
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hasMultipleImages && !autoRotate) {
      setCurrentImageIndex(1 % images.length);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0); // Retour à l'image principale
  };

  // Navigation manuelle des images
  const handleImageClick = (e) => {
    if (!hasMultipleImages) return;
    
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleIndicatorClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <div 
      className={`multi-image-card ${className} ${hasMultipleImages ? 'has-multiple' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Image principale */}
      <div className="image-container" onClick={handleImageClick}>
        <OptimizedImage
          src={images[currentImageIndex]}
          alt={`${product.nom} - Image ${currentImageIndex + 1}`}
          aspectRatio={aspectRatio}
          objectFit={objectFit}
          priority={priority || currentImageIndex === 0}
          loading={priority ? 'eager' : 'lazy'}
          className="product-image"
        />
        
        {/* Overlay pour indiquer qu'il y a plusieurs images */}
        {hasMultipleImages && (
          <div className="multi-image-overlay">
            <div className="image-count">
              {currentImageIndex + 1}/{images.length}
            </div>
          </div>
        )}
      </div>

      {/* Indicateurs de navigation */}
      {hasMultipleImages && showIndicators && (
        <div className="image-indicators">
          {images.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
              onClick={(e) => handleIndicatorClick(e, index)}
              aria-label={`Voir image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Badge "Plusieurs photos" */}
      {hasMultipleImages && (
        <div className="multi-image-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
          </svg>
          {images.length}
        </div>
      )}
    </div>
  );
};

export default MultiImageCard;
