import React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Chip } from '@mui/material';
import { useCart } from '../cartContext';
import { useNavigate } from 'react-router-dom';
import './CartDrawer.css';

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
                    <img 
                      src={item.image} 
                      alt={item.nom} 
                      className="cart-drawer__item-image" 
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
                        {item.quantity} x {item.prix.toFixed(2)} €
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
                  Sous-total : {total.toFixed(2)} €
                </Typography>
                <Typography variant="body2" className="cart-drawer__shipping">
                  Livraison : {total > 50 ? 'Gratuite' : '5.99 €'}
                </Typography>
                <Typography variant="h6" className="cart-drawer__total">
                  Total : {total > 50 ? total.toFixed(2) : (total + 5.99).toFixed(2)} €
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