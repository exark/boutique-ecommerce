import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ProductImageGallery.css';

const ProductImageGallery = ({ product, className = '' }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Utiliser la nouvelle structure d'images
  const images = (product.images && product.images.length > 0)
    ? product.images
    : [{ base: product.image, srcset: {}, fallbackJpg: product.image }];
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
              <img
                src={images[selectedImageIndex].base}
                srcSet={`${images[selectedImageIndex].srcset['400']} 400w, ${images[selectedImageIndex].srcset['800']} 800w, ${images[selectedImageIndex].srcset['1200']} 1200w`}
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 300px"
                loading="lazy"
                decoding="async"
                width="300"
                height="400"
                alt={`${product.nom} - Image ${selectedImageIndex + 1}`}
                onError={(e) => { e.currentTarget.src = images[selectedImageIndex].fallbackJpg || product.image; }}
                className="main-product-image"
                style={{ objectFit: 'cover' }}
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
                <img
                  src={image.base}
                  srcSet={`${image.srcset['400']} 400w, ${image.srcset['800']} 800w, ${image.srcset['1200']} 1200w`}
                  sizes="80px"
                  loading="lazy"
                  decoding="async"
                  width="80"
                  height="80"
                  alt={`${product.nom} - Miniature ${index + 1}`}
                  onError={(e) => { e.currentTarget.src = image.fallbackJpg || product.image; }}
                  className="thumbnail-image"
                  style={{ objectFit: 'cover' }}
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
