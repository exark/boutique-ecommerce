import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
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
            top: '88px',
            right: '20px',
            zIndex: 9999,
            pointerEvents: 'auto'
          }}
        >
          <Box
            onClick={onClose}
            role="status"
            aria-live="polite"
            sx={{
              background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
              border: '2px solid #FFCAD4',
              borderRadius: '16px',
              padding: '14px 18px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 202, 212, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              maxWidth: '420px',
              fontFamily: 'Playfair Display !important',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 14px 36px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(255, 202, 212, 0.3)'
              },
              transition: 'all 0.25s ease'
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                minWidth: 36,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000000',
                color: '#ffffff',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)'
              }}
            >
              <CheckIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  marginBottom: '2px',
                  color: '#000000',
                  letterSpacing: '-0.01em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title="Produit ajouté au panier !"
              >
                Produit ajouté au panier !
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#444',
                  fontSize: '0.88rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={`${productName || ''}${selectedSize ? ` - Taille ${selectedSize}` : ''}`}
              >
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