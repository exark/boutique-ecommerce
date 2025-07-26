import React, { useState } from 'react';
import './Navbar.css';
import logo from '../assets/logo-solene.png';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../cartContext';
import { Link, useNavigate } from 'react-router-dom';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const navigate = useNavigate();

  // Handler pour le logo : refresh complet vers /home
  function handleLogoClick() {
    window.location.href = '/home';
  }

  // Handler pour Accueil : navigation SPA + smooth scroll
  function handleAccueilClick(e) {
    e.preventDefault();
    navigate('/home');
    // Smooth scroll vers le haut, même si on est déjà sur la page home
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
          <li><a href="/produits" onClick={(e) => { e.preventDefault(); navigate('/produits'); setMenuOpen(false); }}>Produits</a></li>
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
          <li><a href="/produits" onClick={(e) => { e.preventDefault(); navigate('/produits'); setMenuOpen(false); }}>Produits</a></li>
          <li><a href="#" onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>
      </div>
      {menuOpen && <div className="navbar__backdrop" onClick={() => setMenuOpen(false)} />}
      
      {/* Composant CartDrawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
} 