import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const CartNotification = ({ open, onClose, productName, selectedSize }) => {
  // Auto-fermeture après 3 secondes
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.4, 0.0, 0.2, 1],
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          style={{
            position: 'fixed',
            top: '100px',
            right: '20px',
            zIndex: 9999,
            pointerEvents: 'auto'
          }}
        >
          <Box
            onClick={onClose}
            sx={{
              backgroundColor: '#f8e6ee',
              color: '#e91e63',
              border: '1px solid #f47b9b',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(233, 30, 99, 0.15)',
              padding: '16px 20px',
              minWidth: '300px',
              maxWidth: '400px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(233, 30, 99, 0.2)',
              },
              transition: 'all 0.2s ease'
            }}
          >
            <CheckIcon sx={{ fontSize: '1.5rem', color: '#e91e63' }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>
                Produit ajouté au panier !
              </Typography>
              <Typography variant="body2" sx={{ color: '#b71c47', fontSize: '0.9rem' }}>
                {productName}
                {selectedSize && ` - Taille ${selectedSize}`}
              </Typography>
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartNotification;