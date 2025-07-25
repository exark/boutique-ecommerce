import React, { useState } from 'react';
import './Navbar.css';
import logo from '../assets/logo-solene.png';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useCart } from '../cartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, removeFromCart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const navigate = useNavigate();

  // Génération du message WhatsApp
  function getWhatsappMessage() {
    if (cart.length === 0) return '';
    let msg = 'Nouvelle commande :%0A';
    cart.forEach(item => {
      msg += `- ${item.nom} x${item.quantity} : ${(item.prix * item.quantity).toFixed(2)} €%0A`;
    });
    msg += `%0ATotal : ` + cart.reduce((acc, item) => acc + item.prix * item.quantity, 0).toFixed(2) + ' €';
    return msg;
  }
  const whatsappNumber = '21695495874'; // sans +
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${getWhatsappMessage()}`;

  // Handler pour le logo : refresh complet vers /home
  function handleLogoClick() {
    window.location.href = '/home';
  }

  // Handler pour Accueil : navigation SPA + scroll smooth
  function handleAccueilClick(e) {
    e.preventDefault();
    navigate('/home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false); // ferme le menu mobile si besoin
  }

  return (
    <nav className={`navbar${menuOpen ? ' navbar--menu-open' : ''}`}>
      <div className="navbar__left">
        <div className="navbar__logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="Logo Solène" />
        </div>
        <ul className="navbar__menu">
          <li><a href="/home" onClick={handleAccueilClick}>Accueil</a></li>
          <li><a href="#">Boutique</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
      <div className="navbar__right">
        <div className="navbar__cart" onClick={() => setCartOpen(true)}>
          <ShoppingCartIcon fontSize="large" />
          {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
        </div>
        <button className="navbar__burger" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">
          <MenuIcon fontSize="large" />
        </button>
      </div>
      {/* Menu mobile */}
      <div className={`navbar__mobile-menu${menuOpen ? ' open' : ''}`}>
        <button className="navbar__close" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu">
          <CloseIcon fontSize="large" />
        </button>
        <ul>
          <li><a href="/home" onClick={handleAccueilClick}>Accueil</a></li>
          <li><a href="#" onClick={() => setMenuOpen(false)}>Boutique</a></li>
          <li><a href="#" onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>
      </div>
      {menuOpen && <div className="navbar__backdrop" onClick={() => setMenuOpen(false)} />}
      {/* Drawer Panier */}
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <div style={{ width: 340, padding: 24, minHeight: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" style={{ marginBottom: 16, color: 'var(--color-accent)', fontWeight: 700 }}>Votre panier</Typography>
          <div style={{ flex: 1 }}>
            {cart.length === 0 ? (
              <Typography variant="body2" color="text.secondary">Votre panier est vide.</Typography>
            ) : (
              cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <img src={item.image} alt={item.nom} style={{ width: 56, height: 56, borderRadius: 8, marginRight: 12, background: '#f5f5f5' }} />
                  <div style={{ flex: 1 }}>
                    <Typography variant="subtitle1">{item.nom}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.quantity} x {item.prix.toFixed(2)} €</Typography>
                  </div>
                  <Button size="small" color="error" onClick={() => removeFromCart(item.id)} style={{ minWidth: 0, marginLeft: 8 }}>✕</Button>
                </div>
              ))
            )}
            {cart.length > 0 && (
              <Typography variant="body1" style={{ fontWeight: 600, marginTop: 24 }}>
                Total : {cart.reduce((acc, item) => acc + item.prix * item.quantity, 0).toFixed(2)} €
              </Typography>
            )}
          </div>
          <Button variant="contained" color="primary" onClick={() => setCartOpen(false)} style={{ marginTop: 32, background: 'var(--color-accent)' }}>
            Fermer
          </Button>
          {cart.length > 0 && (
            <Button
              variant="contained"
              color="success"
              style={{ marginTop: 16, background: '#25D366' }}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Envoyer commande
            </Button>
          )}
        </div>
      </Drawer>
    </nav>
  );
} 