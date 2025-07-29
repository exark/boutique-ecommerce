import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../assets/logo-solene.png';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../cartContext';
import { Link, useNavigate } from 'react-router-dom';
import CartDrawer from './CartDrawer';
import SidebarCategories from './SidebarCategories';
import produits from '../data/produits';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const navigate = useNavigate();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  // Extraire dynamiquement les catégories uniques
  const categories = Array.from(new Set(produits.map(p => p.categorie))).sort();

  // Gestion du scroll pour masquer/afficher la navbar sur mobile
  // useEffect supprimé car la navbar doit toujours être visible

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

  // Handler pour la sélection d'une catégorie
  function handleSelectCategory(cat) {
    setCategoriesOpen(false);
    setMenuOpen(false);
    navigate('/produits', { state: { categorie: cat } });
  }

  // Handler pour la sélection d'une catégorie (mobile)
  function handleMobileSelectCategory(cat) {
    setMenuOpen(false);
    setCategoriesOpen(false);
    navigate('/produits', { state: { categorie: cat } });
  }

  return (
    <nav className={`navbar${menuOpen ? ' navbar--menu-open' : ''}`}>
      <div className="navbar__left">
        <div className="navbar__logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="Logo Solène" />
        </div>
        <div
          style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
          onMouseEnter={() => setCategoriesOpen(true)}
          onMouseLeave={() => setCategoriesOpen(false)}
        >
          <ul className="navbar__menu">
            {/* <li><a href="/home" onClick={handleAccueilClick}>Accueil</a></li> */}
            <li><a href="/home" onClick={(e) => { e.preventDefault(); navigate('/home'); setMenuOpen(false); }}>Notre collection</a></li>
            <li>
              <a href="/categories" onClick={e => { e.preventDefault(); navigate('/categories'); setMenuOpen(false); }}>Catégories</a>
            </li>
          </ul>
          <SidebarCategories
            open={categoriesOpen}
            onClose={() => setCategoriesOpen(false)}
            onSelectCategory={handleSelectCategory}
          />
        </div>
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
          {/* <li><a href="/home" onClick={handleAccueilClick}>Accueil</a></li> */}
          <li><a href="/home" onClick={(e) => { e.preventDefault(); navigate('/home'); setMenuOpen(false); }}>Notre collection</a></li>
        </ul>
        <hr style={{ margin: '24px 0 12px 0', border: 'none', borderTop: '1px solid #eee' }} />
        <div style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#e91e63', fontSize: '1.1rem', paddingLeft: 2 }}>Catégories</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li>
            <a
              href="/categories"
              style={{ display: 'block', padding: '10px 0 10px 2px', color: '#333', fontWeight: 500, textDecoration: 'none', borderRadius: 8, transition: 'background 0.15s' }}
              onClick={e => { e.preventDefault(); navigate('/categories'); setMenuOpen(false); }}
              onKeyDown={e => { if (e.key === 'Enter') { navigate('/categories'); setMenuOpen(false); } }}
            >
              Catégories
            </a>
          </li>
        </ul>
        <hr style={{ margin: '24px 0 12px 0', border: 'none', borderTop: '1px solid #eee' }} />
        {/* Lien Contact supprimé */}
      </div>
      {menuOpen && <div className="navbar__backdrop" onClick={() => setMenuOpen(false)} />}
      
      {/* Composant CartDrawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
} 