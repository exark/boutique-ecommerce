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

  // Désactiver le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Nettoyer lors du démontage du composant
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Gestion du scroll pour masquer/afficher la navbar sur mobile
  // useEffect supprimé car la navbar doit toujours être visible

  // Handler pour le logo : navigation SPA vers /home
  function handleLogoClick() {
    navigate('/home');
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
    navigate('/home', { state: { categorie: cat } });
  }

  // Handler pour la sélection d'une catégorie (mobile)
  function handleMobileSelectCategory(cat) {
    setMenuOpen(false);
    setCategoriesOpen(false);
    navigate('/home', { state: { categorie: cat } });
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
           <li>
             <a 
               href="/home" 
               onClick={(e) => { e.preventDefault(); navigate('/home'); setMenuOpen(false); }}
                               style={{
                  display: 'block',
                  padding: '12px 16px',
                  color: '#333',
                  fontWeight: 600,
                  textDecoration: 'none',
                  borderRadius: 12,
                  transition: 'all 0.2s ease',
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #fff5f7 0%, #ffe4ef 100%)',
                  border: '1px solid #ffe4ef',
                  boxShadow: '0 2px 4px rgba(247,86,124,0.08)',
                  marginBottom: '8px'
                }}
                onMouseEnter={e => {
                  e.target.style.background = 'linear-gradient(135deg, #ffe4ef 0%, #f8d1e0 100%)';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(247,86,124,0.15)';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'linear-gradient(135deg, #fff5f7 0%, #ffe4ef 100%)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(247,86,124,0.08)';
                }}
             >
               Notre collection
             </a>
           </li>
         </ul>
         <hr style={{ margin: '24px 0 16px 0', border: 'none', borderTop: '1px solid #eee' }} />
         <div style={{ 
           margin: '0 0 12px 0', 
           fontWeight: 500, 
           color: '#6c757d', 
           fontSize: '0.9rem', 
           paddingLeft: 4,
           textTransform: 'uppercase',
           letterSpacing: '0.5px'
         }}>
           Catégories
         </div>
         <div style={{ 
           display: 'grid', 
           gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
           gap: '8px',
           padding: '0 4px'
         }}>
           {categories.map(cat => (
             <div key={cat}>
               <a
                 href="/home"
                 style={{ 
                   display: 'block', 
                   padding: '8px 12px', 
                   color: '#495057', 
                   fontWeight: 400, 
                   textDecoration: 'none', 
                   borderRadius: 8, 
                   transition: 'all 0.2s ease',
                   fontSize: '0.85rem',
                   background: 'transparent',
                   border: '1px solid transparent',
                   textAlign: 'center',
                   whiteSpace: 'nowrap',
                   overflow: 'hidden',
                   textOverflow: 'ellipsis'
                 }}
                 onClick={e => { 
                   e.preventDefault(); 
                   handleMobileSelectCategory(cat);
                 }}
                 onKeyDown={e => { 
                   if (e.key === 'Enter') { 
                     handleMobileSelectCategory(cat);
                   } 
                 }}
                 onMouseEnter={e => {
                   e.target.style.background = '#f8f9fa';
                   e.target.style.borderColor = '#e9ecef';
                   e.target.style.color = '#495057';
                 }}
                 onMouseLeave={e => {
                   e.target.style.background = 'transparent';
                   e.target.style.borderColor = 'transparent';
                   e.target.style.color = '#495057';
                 }}
               >
                 {cat}
               </a>
             </div>
           ))}
         </div>
        <hr style={{ margin: '24px 0 12px 0', border: 'none', borderTop: '1px solid #eee' }} />
        {/* Lien Contact supprimé */}
      </div>
      {menuOpen && <div className="navbar__backdrop" onClick={() => setMenuOpen(false)} />}
      
      {/* Composant CartDrawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
} 