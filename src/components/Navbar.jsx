import React, { useState } from 'react';
import './Navbar.css';
import logo from '../assets/logo-solene.png';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = 2; // fictif pour l'exemple

  return (
    <nav className={`navbar${menuOpen ? ' navbar--menu-open' : ''}`}>
      <div className="navbar__left">
        <div className="navbar__logo">
          <img src={logo} alt="Logo Solène" />
        </div>
      </div>
      <div className="navbar__right">
        <div className="navbar__cart">
          <ShoppingCartIcon fontSize="large" />
          <span className="navbar__cart-badge">{cartCount}</span>
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
          <li><a href="#" onClick={() => setMenuOpen(false)}>Accueil</a></li>
          <li><a href="#" onClick={() => setMenuOpen(false)}>Boutique</a></li>
          <li><a href="#" onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>
      </div>
      {menuOpen && <div className="navbar__backdrop" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
} 