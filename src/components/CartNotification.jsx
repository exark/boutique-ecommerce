import React from 'react';
import { Snackbar, Alert, Box, Typography } from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const CartNotification = ({ open, onClose, productName, selectedSize }) => {
  return (
    <AnimatePresence>
      {open && (
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={onClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            '& .MuiSnackbar-root': {
              top: '80px !important',
            },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Alert
              onClose={onClose}
              severity="success"
              sx={{
                backgroundColor: '#f8e6ee',
                color: '#e91e63',
                border: '1px solid #f47b9b',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(233, 30, 99, 0.15)',
                '& .MuiAlert-icon': {
                  color: '#e91e63',
                },
                '& .MuiAlert-message': {
                  padding: '8px 0',
                },
                minWidth: '300px',
                maxWidth: '400px',
              }}
              icon={<CheckIcon sx={{ fontSize: '1.5rem' }} />}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  Produit ajouté au panier !
                </Typography>
                <Typography variant="body2" sx={{ color: '#b71c47', fontSize: '0.9rem' }}>
                  {productName}
                  {selectedSize && ` - Taille ${selectedSize}`}
                </Typography>
              </Box>
            </Alert>
          </motion.div>
        </Snackbar>
      )}
    </AnimatePresence>
  );
};

export default CartNotification; 