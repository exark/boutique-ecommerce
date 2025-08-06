import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from './OptimizedImage';
import './ProductImageGallery.css';

const ProductImageGallery = ({ product, className = '' }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Utiliser images ou fallback sur image unique
  const images = product.images || [product.image];
  const hasMultipleImages = images.length > 1;

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleMainImageClick = () => {
    if (hasMultipleImages) {
      const nextIndex = (selectedImageIndex + 1) % images.length;
      setSelectedImageIndex(nextIndex);
    }
  };

  return (
    <div className={`product-image-gallery ${className}`}>
      {/* Image principale */}
      <div className="main-image-container">
        <motion.div
          className="main-image-wrapper"
          whileHover={{ scale: 1.04, rotate: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          onClick={handleMainImageClick}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="main-image-motion-wrapper"
            >
              <OptimizedImage
                src={images[selectedImageIndex]}
                alt={`${product.nom} - Image ${selectedImageIndex + 1}`}
                className="main-product-image"
                priority={true}
                aspectRatio="4/5"
                objectFit="cover"
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Indicateur de clic pour images multiples */}
          {hasMultipleImages && (
            <div className="click-indicator">
              <span>Cliquer pour changer d'image</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Miniatures (seulement si plusieurs images) */}
      {hasMultipleImages && (
        <div className="thumbnails-container">
          <div className="thumbnails-wrapper">
            {images.map((image, index) => (
              <motion.div
                key={index}
                className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <OptimizedImage
                  src={image}
                  alt={`${product.nom} - Miniature ${index + 1}`}
                  className="thumbnail-image"
                  aspectRatio="1/1"
                  objectFit="cover"
                />
                
                {/* Overlay actif */}
                {index === selectedImageIndex && (
                  <motion.div
                    className="thumbnail-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Compteur d'images */}
          <div className="image-counter">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
