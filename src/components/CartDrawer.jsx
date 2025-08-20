import React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Chip } from '@mui/material';
import { useCart } from '../cartContext';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';
import './CartDrawer.css';
import { formatPrice } from '../utils/currency';

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.prix * item.quantity, 0);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="cart-drawer">
        <Typography variant="h6" className="cart-drawer__title">
          Votre panier
        </Typography>
        
        <div className="cart-drawer__content">
          {cart.length === 0 ? (
            <Typography variant="body2" color="text.secondary" className="cart-drawer__empty">
              Votre panier est vide.
            </Typography>
          ) : (
            <>
              <div className="cart-drawer__items">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="cart-drawer__item">
                    <OptimizedImage 
                      src={item.image} 
                      alt={item.nom} 
                      className="cart-drawer__item-image"
                      priority={true}
                      aspectRatio="1/1"
                      objectFit="cover"
                    />
                    <div className="cart-drawer__item-details">
                      <Typography variant="subtitle1" className="cart-drawer__item-name">
                        {item.nom}
                      </Typography>
                      {item.selectedSize && (
                        <Chip 
                          label={`Taille: ${item.selectedSize}`}
                          size="small"
                          className="cart-drawer__size-chip"
                        />
                      )}
                      <Typography variant="body2" color="text.secondary" className="cart-drawer__item-price">
                        {item.quantity} x {formatPrice(item.prix)}
                      </Typography>
                    </div>
                    <Button 
                      size="small" 
                      color="error" 
                      onClick={() => removeFromCart(item.id, item.selectedSize)} 
                      className="cart-drawer__remove-btn"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="cart-drawer__summary">
                <Typography variant="body1" className="cart-drawer__subtotal">
                  Sous-total : {formatPrice(total)}
                </Typography>
                <Typography variant="body2" className="cart-drawer__shipping">
                  Livraison : {total > 50 ? 'Gratuite' : formatPrice(5.99)}
                </Typography>
                <Typography variant="h6" className="cart-drawer__total">
                  Total : {formatPrice(total > 50 ? total : total + 5.99)}
                </Typography>
              </div>
            </>
          )}
        </div>
        
        <div className="cart-drawer__actions">
          {cart.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onClose();
                navigate('/cart');
              }}
              className="cart-drawer__view-cart-btn"
            >
              Voir le panier complet
            </Button>
          )}
          
          <Button 
            variant="outlined" 
            onClick={onClose} 
            className="cart-drawer__close-btn"
          >
            Fermer
          </Button>
        </div>
      </div>
    </Drawer>
  );
} 