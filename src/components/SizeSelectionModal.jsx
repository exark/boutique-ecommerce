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
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
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
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: 'size-modal-paper'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle className="size-modal-title">
          <Typography variant="h5" component="div" className="size-modal-title-text">
            Choisissez votre taille
          </Typography>
          <Typography variant="body2" color="text.secondary" className="size-modal-subtitle">
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
                {produit.tailles.map((sizeData) => {
                  const { status, text } = getStockStatus(sizeData.stock);
                  const isAvailable = sizeData.stock > 0;
                  const isSelected = selectedSize === sizeData.taille;

                  return (
                    <motion.div
                      key={sizeData.taille}
                      whileHover={isAvailable ? { scale: 1.05 } : {}}
                      whileTap={isAvailable ? { scale: 0.95 } : {}}
                    >
                      <Button
                        variant={isSelected ? "contained" : "outlined"}
                        className={`size-button ${status} ${isSelected ? 'selected' : ''}`}
                        onClick={() => isAvailable && handleSizeSelect(sizeData.taille)}
                        disabled={!isAvailable}
                        fullWidth
                      >
                        <Box className="size-button-content">
                          <Typography variant="h6" className="size-text">
                            {sizeData.taille}
                          </Typography>
                          <Chip 
                            label={text}
                            size="small"
                            className={`stock-chip ${status}`}
                          />
                        </Box>
                      </Button>
                    </motion.div>
                  );
                })}
              </Box>

              {selectedSize && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Alert severity="info" className="size-modal-selection">
                    Taille sélectionnée : <strong>{selectedSize}</strong>
                  </Alert>
                </motion.div>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions className="size-modal-actions">
          <Button 
            onClick={onClose}
            className="size-modal-cancel-btn"
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleAddToCart}
            disabled={!selectedSize || availableSizes.length === 0}
            className="size-modal-add-btn"
          >
            Ajouter au panier
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
} 