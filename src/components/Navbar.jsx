import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logo from '../assets/logo-solene.webp';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Remplacé par SVG personnalisé
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../cartContext';
import { Link, useNavigate } from 'react-router-dom';
import CartDrawer from './CartDrawer';
import produits from '../data/produits';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const navigate = useNavigate();
  const [categoriesOpen, setCategoriesOpen] = useState(() => {
    // Persister l'état du mega menu dans sessionStorage
    try {
      const saved = sessionStorage.getItem('categoriesMenuOpen');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const categoriesRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Extraire dynamiquement les catégories uniques
  const categories = Array.from(new Set(produits.map(p => p.categorie))).sort();

  // Hook pour détecter les changements de taille d'écran
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Persister l'état du mega menu dans sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('categoriesMenuOpen', JSON.stringify(categoriesOpen));
    } catch (error) {
      console.error('Error saving categoriesOpen to sessionStorage:', error);
    }
  }, [categoriesOpen]);

  // Synchroniser les catégories sélectionnées avec localStorage
  useEffect(() => {
    const updateSelectedCategories = (event) => {
      try {
        let categories = [];
        
        if (event?.detail?.categories) {
          // Événement custom avec données
          categories = event.detail.categories;
        } else {
          // Charger depuis localStorage
          const stored = localStorage.getItem('selectedCategories');
          categories = stored ? JSON.parse(stored) : [];
        }
        
        console.log('Navbar: Updating selected categories:', categories);
        setSelectedCategories(categories);
      } catch (error) {
        console.error('Error reading selectedCategories from localStorage:', error);
        setSelectedCategories([]);
      }
    };

    // Charger initial
    updateSelectedCategories();

    // Écouter les changements depuis Produits
    window.addEventListener('selectedCategoriesChanged', updateSelectedCategories);
    
    return () => {
      window.removeEventListener('selectedCategoriesChanged', updateSelectedCategories);
    };
  }, []);

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

  // État pour contrôler si on doit fermer le menu au clic extérieur
  const [allowClickOutside, setAllowClickOutside] = useState(true);

  // Fermer le mega menu en cliquant en dehors (desktop uniquement)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Vérifier si on clique vraiment en dehors de la navbar ET du mega menu
      const navbar = document.querySelector('.navbar');
      const megaMenu = categoriesRef.current;
      
      // Ne fermer que si :
      // 1. allowClickOutside est true
      // 2. On ne clique ni sur la navbar ni sur le mega menu
      // 3. On ne clique pas sur un élément enfant du mega menu
      if (allowClickOutside && 
          navbar && !navbar.contains(event.target) &&
          megaMenu && !megaMenu.contains(event.target)) {
        console.log('Closing mega menu - clicked outside');
        setCategoriesOpen(false);
      }
    };

    if (categoriesOpen && !isMobile) {
      // Délai pour éviter la fermeture immédiate après ouverture
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [categoriesOpen, allowClickOutside, isMobile]);

  // Fermer avec la touche Echap sur mobile
  useEffect(() => {
    if (!isMobile || !categoriesOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') setCategoriesOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isMobile, categoriesOpen]);

  // Gestion du scroll pour masquer/afficher la navbar sur mobile
  // useEffect supprimé car la navbar doit toujours être visible

  // Handler pour le logo : navigation SPA vers /home + scroll vers le haut
  function handleLogoClick() {
    navigate('/home');
    // Scroll vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Fermer les menus ouverts
    setMenuOpen(false);
    setCategoriesOpen(false);
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
  const handleSelectCategory = (cat) => {
    console.log('Navbar: Selecting category', cat);
    
    // Empêcher la fermeture du menu pendant la sélection
    setAllowClickOutside(false);
    
    // Mettre à jour l'état local des catégories sélectionnées
    let newSelectedCategories = [...selectedCategories];
    
    if (newSelectedCategories.includes(cat)) {
      // Retirer la catégorie si elle est déjà sélectionnée
      newSelectedCategories = newSelectedCategories.filter(c => c !== cat);
    } else {
      // Ajouter la catégorie (max 5)
      if (newSelectedCategories.length >= 5) {
        newSelectedCategories = newSelectedCategories.slice(1); // Retirer la première
      }
      newSelectedCategories.push(cat);
    }
    
    console.log('Navbar: New selected categories:', newSelectedCategories);
    
    // Mettre à jour l'état local immédiatement pour l'affichage
    setSelectedCategories(newSelectedCategories);
    
    // Mettre à jour localStorage (source de vérité unique)
    localStorage.setItem('selectedCategories', JSON.stringify(newSelectedCategories));
    
    // Déclencher l'événement custom pour synchronisation immédiate
    window.dispatchEvent(new CustomEvent('selectedCategoriesChanged', { 
      detail: { categories: newSelectedCategories } 
    }));
    
    // Naviguer vers /produits seulement si on n'y est pas déjà (SANS state)
    if (window.location.pathname !== '/produits') {
      navigate('/produits');
    }
    
    // Réactiver la fermeture après un délai pour permettre la sélection multiple
    setTimeout(() => {
      setAllowClickOutside(true);
    }, 300);
    
    // LE MEGA MENU RESTE OUVERT - ne pas appeler setCategoriesOpen(false)
  };

  // Handler pour la sélection d'une catégorie (mobile)
  function handleMobileSelectCategory(cat) {
    console.log('Navbar Mobile: Selecting category', cat);
    
    // Utiliser la même logique que pour desktop SANS fermer le menu mobile
    handleSelectCategory(cat);
    
    // Le menu mobile reste ouvert pour permettre la sélection multiple
    // setMenuOpen(false); // <- NE PAS FERMER LE MENU
    // setCategoriesOpen reste true pour permettre la sélection multiple
  }

  return (
    <nav className={`navbar${menuOpen ? ' navbar--menu-open' : ''}${categoriesOpen && !isMobile ? ' navbar--categories-open' : ''}`}>
      <div className="navbar__left">
        <div href="/home" className="navbar__logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img  src={logo} alt="Logo Solène" />
        </div>
        <ul className="navbar__menu">
          <li ref={categoriesRef}>
            <a href="#" onClick={(e) => { e.preventDefault(); setCategoriesOpen(!categoriesOpen); }}>Catégories</a>
          </li>
        </ul>
      </div>
      <div className="navbar__right">
        <div className="navbar__cart" onClick={() => setCartOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" role="img" aria-label="Panier boutique"
               viewBox="0 0 24 24" fill="none" stroke="#c2185b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <title>Panier boutique</title>
            <path d="M3 9h18l-1.6 8.2A2.5 2.5 0 0 1 16.9 20H7.1a2.5 2.5 0 0 1-2.5-2.1L3 9Z"/>
            <path d="M8 9V6a4 4 0 0 1 8 0v3"/>
            <circle cx="9" cy="20.5" r="1.2"/>
            <circle cx="15" cy="20.5" r="1.2"/>
          </svg>
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
          <li>
            <a 
              style={{
                display: 'block',
                padding: '12px 16px',
                color: '#333',
                fontWeight: 600,
                textDecoration: 'none',
                borderRadius: 12,
                transition: 'all 0.2s ease',
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #ffe4ef 0%, #f8d1e0 100%)',
                border: '1px solid #ffe4ef',
                boxShadow: '0 2px 4px rgba(247,86,124,0.08)',
                marginBottom: '8px'
              }}
            >
              Notre collection
            </a>
          </li>
        </ul>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '8px',
          padding: '0 4px'
        }}>
          {categories.map(cat => {
            const isSelected = selectedCategories.includes(cat);
            return (
              <div key={cat}>
                <button
                  type="button"
                  style={{ 
                    display: 'block', 
                    width: '100%',
                    padding: '8px 12px', 
                    color: isSelected ? '#e91e63' : '#495057', 
                    fontWeight: isSelected ? 600 : 400, 
                    textDecoration: 'none', 
                    borderRadius: 8, 
                    transition: 'all 0.2s ease',
                    fontSize: '0.85rem',
                    background: isSelected ? 'rgba(233, 30, 99, 0.1)' : 'transparent',
                    border: isSelected ? '1px solid rgba(233, 30, 99, 0.3)' : '1px solid transparent',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                  onClick={e => { 
                    e.preventDefault(); 
                    e.stopPropagation();
                    handleMobileSelectCategory(cat);
                  }}
                  onKeyDown={e => { 
                    if (e.key === 'Enter') { 
                      handleMobileSelectCategory(cat);
                    } 
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.target.style.background = '#f8f9fa';
                      e.target.style.borderColor = '#e9ecef';
                      e.target.style.color = '#495057';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.target.style.background = 'transparent';
                      e.target.style.borderColor = 'transparent';
                      e.target.style.color = '#495057';
                    }
                  }}
                >
                  {cat}
                </button>
              </div>
            );
          })}
        </div>
        <hr style={{ margin: '24px 0 12px 0', border: 'none', borderTop: '1px solid #eee' }} />
      </div>
      
      {/* Mega menu catégories intégré dans la navbar desktop */}
      <AnimatePresence>
        {categoriesOpen && (
          <>
            {/* Overlay pour mobile */}
            {isMobile && (
              <motion.div
                className="navbar-categories-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setCategoriesOpen(false)}
              />
            )}
            <motion.div
              ref={categoriesRef}
              className={`navbar-categories${isMobile ? ' navbar-categories--mobile' : ''}`}
              initial={isMobile ? { x: '-100%', opacity: 1 } : { height: 0, opacity: 0 }}
              animate={isMobile ? { x: 0, opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={isMobile ? { x: '-100%', opacity: 0 } : { height: 0, opacity: 0 }}
              transition={isMobile ? 
                { type: 'spring', stiffness: 300, damping: 30, opacity: { duration: 0.2 } } : 
                { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
              }
              style={{
                overflow: 'hidden',
                transformOrigin: 'top center',
                willChange: 'height, opacity, transform'
              }}
              onClick={(e) => {
                // Empêcher la propagation pour éviter la fermeture
                e.stopPropagation();
              }}
            >
              <h3 className="navbar-categories__title">Catégories</h3>
              {isMobile && (
                <button className="navbar-categories__close" onClick={() => setCategoriesOpen(false)} aria-label="Fermer">
                  ×
                </button>
              )}
              <ul className="navbar-categories__list">
                {categories.map(cat => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <motion.li
                      key={cat}
                      className={`navbar-categories__item ${isSelected ? 'selected' : ''}`}
                      whileHover={isMobile ? { scale: 1.05, backgroundColor: '#ffe4ef' } : {}}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelectCategory(cat);
                      }}
                      style={{ 
                        cursor: 'pointer',
                        color: isSelected ? '#e91e63' : 'inherit',
                        fontWeight: isSelected ? 600 : 'inherit',
                        backgroundColor: isSelected ? 'rgba(233, 30, 99, 0.1)' : 'transparent',
                        border: isSelected ? '1px solid rgba(233, 30, 99, 0.3)' : '1px solid transparent',
                        borderRadius: '6px',
                        position: 'relative'
                      }}
                    >
                      {cat}
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {menuOpen && <div className="navbar__backdrop" onClick={() => setMenuOpen(false)} />}
      
      {/* Composant CartDrawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
} 