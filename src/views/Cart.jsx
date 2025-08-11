import React, { useState, useEffect } from 'react';
import { useCart } from '../cartContext';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  IconButton, 
  TextField,
  Divider,
  Box,
  Alert,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OptimizedImage from '../components/OptimizedImage';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.prix * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const discount = couponApplied ? subtotal * 0.1 : 0; // 10% de réduction
  const total = subtotal + shipping - discount;

  const handleQuantityChange = (itemId, selectedSize, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, selectedSize, newQuantity);
    }
  };

  const handleRemoveItem = (itemId, selectedSize) => {
    removeFromCart(itemId, selectedSize);
  };

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'solene10') {
      setCouponApplied(true);
    }
  };

  const handleCheckout = () => {
    navigate('/commande');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <Typography variant="h4" className="cart-empty__title">
            Votre panier est vide
          </Typography>
          <Typography variant="body1" className="cart-empty__subtitle">
            Découvrez nos produits et commencez vos achats !
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/produits')}
            className="cart-empty__btn"
          >
            Voir nos produits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <IconButton onClick={() => navigate('/')} className="cart-back-btn">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" className="cart-title">
          Votre panier ({cart.length} article{cart.length > 1 ? 's' : ''})
        </Typography>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <Card key={`${item.id}-${item.selectedSize}`} className="cart-item">
              <CardContent className="cart-item__content">
                <OptimizedImage 
                  src={item.image} 
                  alt={item.nom} 
                  className="cart-item__image"
                  priority={true}
                  aspectRatio="1/1"
                  objectFit="cover"
                />
                
                <div className="cart-item__details">
                  <Typography variant="h6" className="cart-item__name">
                    {item.nom}
                  </Typography>
                  {item.selectedSize && (
                    <Chip 
                      label={`Taille: ${item.selectedSize}`}
                      size="small"
                      className="cart-item__size-chip"
                    />
                  )}
                  <Typography variant="body2" className="cart-item__price">
                    {item.prix.toFixed(2)} €
                  </Typography>
                </div>

                <div className="cart-item__quantity">
                  <IconButton 
                    onClick={() => handleQuantityChange(item.id, item.selectedSize, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="quantity-btn"
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="body1" className="quantity-text">
                    {item.quantity}
                  </Typography>
                  <IconButton 
                    onClick={() => handleQuantityChange(item.id, item.selectedSize, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    <AddIcon />
                  </IconButton>
                </div>

                <div className="cart-item__total">
                  <Typography variant="h6" className="item-total">
                    {(item.prix * item.quantity).toFixed(2)} €
                  </Typography>
                </div>

                <IconButton 
                  onClick={() => handleRemoveItem(item.id, item.selectedSize)}
                  className="remove-btn"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="cart-summary">
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h6" className="summary-title">
                Résumé de la commande
              </Typography>

              <div className="coupon-section">
                <Typography variant="body2" className="coupon-label">
                  Code promo
                </Typography>
                <div className="coupon-input">
                  <TextField
                    size="small"
                    placeholder="SOLENE10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    className="coupon-field"
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode}
                    className="coupon-btn"
                  >
                    {couponApplied ? 'Appliqué' : 'Appliquer'}
                  </Button>
                </div>
                {couponApplied && (
                  <Alert severity="success" className="coupon-alert">
                    Code promo appliqué ! -10% sur votre commande
                  </Alert>
                )}
              </div>

              <Divider className="summary-divider" />

              <div className="summary-details">
                <div className="summary-row">
                  <Typography>Sous-total</Typography>
                  <Typography>{subtotal.toFixed(2)} €</Typography>
                </div>
                
                <div className="summary-row">
                  <Typography>Livraison</Typography>
                  <Typography>
                    {shipping === 0 ? 'Gratuit' : `${shipping.toFixed(2)} €`}
                  </Typography>
                </div>

                {discount > 0 && (
                  <div className="summary-row discount">
                    <Typography>Réduction</Typography>
                    <Typography>-{discount.toFixed(2)} €</Typography>
                  </div>
                )}

                <Divider className="summary-divider" />

                <div className="summary-row total">
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">{total.toFixed(2)} €</Typography>
                </div>
              </div>

              <Button 
                variant="contained" 
                onClick={handleCheckout}
                className="checkout-btn"
                fullWidth
              >
                Valider le panier
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 