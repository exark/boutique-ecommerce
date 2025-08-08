import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box,
  Chip,
  Alert,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import './SizeSelectionModal.css';

export default function SizeSelectionModal({ 
  open, 
  onClose, 
  produit, 
  onAddToCart 
}) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);

  useEffect(() => {
    if (produit && produit.tailles) {
      const available = produit.tailles.filter(t => t.stock > 0);
      setAvailableSizes(available);
      
      // Sélectionner automatiquement la première taille disponible
      if (available.length > 0 && !selectedSize) {
        setSelectedSize(available[0].taille);
      }
    }
  }, [produit, selectedSize]);

  const handleSizeSelect = (taille) => {
    setSelectedSize(taille);
  };

  const handleAddToCart = () => {
    if (selectedSize) {
      const selectedSizeData = produit.tailles.find(t => t.taille === selectedSize);
      onAddToCart({
        ...produit,
        selectedSize,
        stock: selectedSizeData.stock
      });
      onClose();
      setSelectedSize(null);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { status: 'rupture', text: 'Rupture' };
    if (stock <= 2) return { status: 'limite', text: `Plus que ${stock}` };
    return { status: 'disponible', text: 'En stock' };
  };

  if (!produit) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        className: 'size-modal-paper'
      }}
      BackdropProps={{
        className: 'size-modal-backdrop'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.4 
        }}
      >
        {/* Header avec bouton fermer */}
        <Box className="size-modal-header">
          <IconButton 
            onClick={onClose}
            className="size-modal-close-btn"
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogTitle className="size-modal-title">
          <Typography variant="h6" component="div" className="size-modal-title-text">
            Choisissez votre taille
          </Typography>
          <Typography variant="body2" className="size-modal-subtitle">
            {produit.nom}
          </Typography>
        </DialogTitle>

        <DialogContent className="size-modal-content">
          {availableSizes.length === 0 ? (
            <Alert severity="warning" className="size-modal-alert">
              Ce produit n'est actuellement disponible dans aucune taille.
            </Alert>
          ) : (
            <>
              <Box className="size-modal-sizes">
                {produit.tailles.map((sizeData, index) => {
                  const { status, text } = getStockStatus(sizeData.stock);
                  const isAvailable = sizeData.stock > 0;
                  const isSelected = selectedSize === sizeData.taille;

                  return (
                    <motion.div
                      key={sizeData.taille}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={isAvailable ? { 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      } : {}}
                      whileTap={isAvailable ? { 
                        scale: 0.98,
                        transition: { duration: 0.1 }
                      } : {}}
                    >
                      <Box
                        className={`size-option ${status} ${isSelected ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`}
                        onClick={() => isAvailable && handleSizeSelect(sizeData.taille)}
                      >
                        <Typography className="size-label">
                          {sizeData.taille}
                        </Typography>
                        <Box className={`stock-indicator ${status}`}>
                          {status === 'disponible' && '✓'}
                          {status === 'limite' && '!'}
                          {status === 'rupture' && '✕'}
                        </Box>
                        <Typography className="stock-text">
                          {text}
                        </Typography>
                      </Box>
                    </motion.div>
                  );
                })}
              </Box>

              <AnimatePresence>
                {selectedSize && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                    className="size-selection-indicator"
                  >
                    <Box className="selection-content">
                      <Typography className="selection-text">
                        Taille sélectionnée
                      </Typography>
                      <Typography className="selection-size">
                        {selectedSize}
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </DialogContent>

        <DialogActions className="size-modal-actions">
          <motion.div 
            className="action-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              onClick={onClose}
              className="size-modal-cancel-btn"
              fullWidth
            >
              Annuler
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize || availableSizes.length === 0}
              className="size-modal-add-btn"
              fullWidth
            >
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Ajouter au panier
              </motion.span>
            </Button>
          </motion.div>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
}