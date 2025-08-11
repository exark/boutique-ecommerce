import React, { useState, useEffect, useRef, useMemo } from 'react';
import Masonry from 'react-masonry-css';
import { Card, CardContent, Typography, CardActions, Button, Drawer, IconButton, Grid, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterList as FilterIcon, Close as CloseIcon } from '@mui/icons-material';
import './Produits.css';
import { useCart } from '../cartContext';
import { Link, useLocation } from 'react-router-dom';
import produits from '../data/produits';
import SearchFilters from '../components/SearchFilters';
import SizeSelectionModal from '../components/SizeSelectionModal';
import MultiImageCard from '../components/MultiImageCard';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';

export default function Produits() {
  const { addToCart } = useCart();
  const location = useLocation();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(produits);
  const [isFiltering, setIsFiltering] = useState(false);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const filtersBarRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const isMobile = useMediaQuery('(max-width:767px)');
  const isTablet = useMediaQuery('(min-width:768px) and (max-width:1024px)');
  const isMobileOrTablet = useMediaQuery('(max-width:1024px)');
  const [columns, setColumns] = useState(() => {
    if (isMobile) return 1; // Mobile: 2 produits par ligne
    if (isTablet) return 2; // Tablette: 4 produits par ligne
    return 2; // Desktop: 4 produits par ligne par défaut
  }); // 1=2cols, 2=4cols, 3=mosaïque
  
  // Utiliser les colonnes sélectionnées par l'utilisateur, sans forcer de changement
  const effectiveColumns = columns;
  
  // Mettre à jour les colonnes quand on change de device (mobile/tablette/desktop)
  useEffect(() => {
    setColumns(prevColumns => {
      if (isMobile && prevColumns > 3) {
        // Mobile: limiter au mode 3 max (mosaïque)
        return 3;
      } else if (isTablet && prevColumns > 3) {
        // Tablette: limiter au mode 3 max (mosaïque)
        return 3;
      } else if (!isMobileOrTablet && prevColumns === 1) {
        // Desktop: si on était en mode mobile, passer au mode 2 (4 colonnes)
        return 2;
      }
      return prevColumns; // Pas de changement
    });
  }, [isMobile, isTablet, isMobileOrTablet]); // Pas de columns dans les dépendances
  
  // Désactiver les boutons d'ajustement quand il n'y a que 1 produit
  const shouldDisableToggleButtons = filteredProducts.length === 1;
  
  const theme = useTheme();
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [isNavbarMenuOpen, setIsNavbarMenuOpen] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [showAdaptiveNotification, setShowAdaptiveNotification] = useState(false);
  
  // Pagination states
  const [displayedCount, setDisplayedCount] = useState(3); // Commencer avec 3 produits
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const INITIAL_LOAD = 3; // Nombre initial de produits
  const LOAD_MORE_COUNT = 5; // Nombre de produits à charger à chaque "Voir plus"
  
  // Fonction pour calculer le nombre optimal de colonnes selon le nombre de produits (pure function)
  const getAdaptiveColumns = (productCount, selectedColumns) => {
    let adaptedColumns = selectedColumns;
    
    // Si très peu de produits (1-2), forcer un affichage plus large
    if (productCount <= 2) {
      if (isMobileOrTablet) {
        adaptedColumns = 1; // 1 colonne sur mobile pour 1-2 produits
      } else {
        adaptedColumns = 2; // Max 2 colonnes desktop pour 1-2 produits
      }
    }
    // Si peu de produits (3-6), adapter selon le mode
    else if (productCount <= 6) {
      if (isMobileOrTablet && selectedColumns === 3) {
        adaptedColumns = 2; // Limiter mosaïque à 2 colonnes
      }
    }
    
    return adaptedColumns;
  };

  // Produits à afficher avec pagination
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayedCount);
  }, [filteredProducts, displayedCount]);
  
  // Colonnes adaptatives basées sur le nombre de produits affichés (mémorisé pour éviter les re-rendus)
  const adaptiveColumns = useMemo(() => {
    return getAdaptiveColumns(displayedProducts.length, effectiveColumns);
  }, [displayedProducts.length, effectiveColumns, isMobileOrTablet]);
  
  // Gérer la notification d'adaptation dans un useEffect séparé
  useEffect(() => {
    const wasAdapted = adaptiveColumns !== effectiveColumns;
    if (wasAdapted && displayedProducts.length > 0) {
      setShowAdaptiveNotification(true);
      const timer = setTimeout(() => setShowAdaptiveNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [adaptiveColumns, effectiveColumns, displayedProducts.length]);
  
  // Reset displayedCount when filters change
  useEffect(() => {
    setDisplayedCount(INITIAL_LOAD);
  }, [filteredProducts]);
  
  // Fonction pour charger plus de produits
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simuler un petit délai pour l'UX
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + LOAD_MORE_COUNT, filteredProducts.length));
      setIsLoadingMore(false);
    }, 300);
  };
  
  // Vérifier s'il y a plus de produits à charger
  const hasMoreProducts = displayedCount < filteredProducts.length;
  const productsSectionRef = useRef(null);
  
  // Calculer la largeur du conteneur pour l'espacement optimal
  useEffect(() => {
    const updateContainerWidth = () => {
      if (productsSectionRef.current) {
        const width = productsSectionRef.current.offsetWidth;
        setContainerWidth(width);
      }
    };
    
    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);
  
  // Détecter si le menu navbar est ouvert
  useEffect(() => {
    const checkNavbarMenu = () => {
      const navbar = document.querySelector('.navbar');
      setIsNavbarMenuOpen(navbar?.classList.contains('navbar--menu-open') || false);
    };
    
    // Vérifier immédiatement
    checkNavbarMenu();
    
    // Observer les changements de classe sur la navbar
    const observer = new MutationObserver(checkNavbarMenu);
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
      observer.observe(navbar, { attributes: true, attributeFilter: ['class'] });
    }
    
    return () => observer.disconnect();
  }, []);
  
  // Filtrage par catégories sélectionnées
  useEffect(() => {
    if (selectedCategories.length > 0) {
      setFilteredProducts(produits.filter(p => selectedCategories.includes(p.categorie)));
    } else {
      setFilteredProducts(produits);
    }
  }, [selectedCategories]);

  // Charger et synchroniser les catégories sélectionnées depuis localStorage
  useEffect(() => {
    const loadSelectedCategories = () => {
      try {
        const stored = localStorage.getItem('selectedCategories');
        const categories = stored ? JSON.parse(stored) : [];
        console.log('Produits: Loading categories from localStorage:', categories);
        setSelectedCategories(categories);
      } catch (error) {
        console.error('Error reading selectedCategories from localStorage:', error);
        setSelectedCategories([]);
      }
    };

    // Charger au montage
    loadSelectedCategories();

    // Écouter les changements depuis la navbar
    const handleCategoriesChanged = (event) => {
      console.log('Produits: Categories changed event received:', event.detail);
      loadSelectedCategories(); // Recharger depuis localStorage
      // Déclencher un re-filtrage immédiat pour appliquer les nouvelles catégories
      setResetTrigger(prev => prev + 1);
    };

    window.addEventListener('selectedCategoriesChanged', handleCategoriesChanged);
    
    return () => {
      window.removeEventListener('selectedCategoriesChanged', handleCategoriesChanged);
    };
  }, []);

  // Fonction pour supprimer une catégorie de la sélection
  const removeSelectedCategory = (categoryToRemove) => {
    const newCategories = selectedCategories.filter(cat => cat !== categoryToRemove);
    console.log('Produits: Removing category:', categoryToRemove, 'New categories:', newCategories);
    
    // Mettre à jour l'état local immédiatement
    setSelectedCategories(newCategories);
    
    // Mettre à jour localStorage
    localStorage.setItem('selectedCategories', JSON.stringify(newCategories));
    
    // Déclencher l'événement pour synchroniser la navbar
    window.dispatchEvent(new CustomEvent('selectedCategoriesChanged', { 
      detail: { categories: newCategories } 
    }));
    
    // Déclencher un re-filtrage
    setResetTrigger(prev => prev + 1);
  };

  // Fonction pour effacer toutes les catégories
  const clearAllCategories = () => {
    console.log('Produits: Clearing all categories');
    
    // Mettre à jour l'état local immédiatement
    setSelectedCategories([]);
    
    // Mettre à jour localStorage
    localStorage.setItem('selectedCategories', JSON.stringify([]));
    
    // Déclencher l'événement pour synchroniser la navbar
    window.dispatchEvent(new CustomEvent('selectedCategoriesChanged', { 
      detail: { categories: [] } 
    }));
    
    // Déclencher un re-filtrage immédiat
    setResetTrigger(prev => prev + 1);
  };



  useEffect(() => {
    const ref = filtersBarRef.current;
    if (!ref) return;

    // On crée un élément sentinelle juste avant la barre
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0px';
    sentinel.style.width = '1px';
    sentinel.style.height = '1px';
    ref.parentNode.insertBefore(sentinel, ref);

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        // Si la sentinelle n'est plus visible, la barre est sticky
        const newStickyState = !entry.isIntersecting;
        console.log('Sticky state changed:', newStickyState);
        setIsSticky(newStickyState);
      },
      {
        root: null,
        threshold: 0,
      }
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      if (sentinel.parentNode) sentinel.parentNode.removeChild(sentinel);
    };
  }, []);

  // Breakpoints pour le responsive masonry avec espacement intelligent (adaptatif)
  const breakpointColumnsObj = isMobileOrTablet
    ? { 
        default: adaptiveColumns === 1 ? 1 : adaptiveColumns === 2 ? 2 : 3, // 1, 2 ou 3 colonnes sur mobile/tablette
        768: adaptiveColumns === 1 ? 1 : adaptiveColumns === 2 ? 2 : 3, // Tablette
        480: adaptiveColumns === 1 ? 1 : adaptiveColumns === 2 ? 2 : 3 // Mobile petit écran - respecter le choix utilisateur
      }
    : { 
        // Desktop: 1=2cols, 2=4cols, 3=mosaïque (6 colonnes) - adaptatif
        default: adaptiveColumns === 1 ? 2 : adaptiveColumns === 2 ? 4 : 6,
        1200: adaptiveColumns === 1 ? 2 : adaptiveColumns === 2 ? 4 : 5,
        900: adaptiveColumns === 1 ? 2 : adaptiveColumns === 2 ? 3 : 4, // Écran moyen
        600: 2 // Écran petit
      };

  const handleFiltersChange = (filteredProducts) => {
    setIsFiltering(true);
    console.log('Produits: Applying filtered products:', filteredProducts.length, 'products');
    
    // Les produits sont déjà filtrés par catégories dans SearchFilters
    setFilteredProducts(filteredProducts);
    
    // Reset la pagination quand les filtres changent
    setDisplayedCount(INITIAL_LOAD);
    
    // Reset l'état de filtrage après l'animation
    setTimeout(() => setIsFiltering(false), 150);
  };

  const resetAllFilters = () => {
    setIsFiltering(true);
    // Réinitialiser complètement tous les filtres et afficher tous les produits
    setFilteredProducts(produits);
    setSelectedCategory(null);
    // Déclencher la réinitialisation des filtres dans SearchFilters
    setResetTrigger(prev => prev + 1);
    
    // Reset l'état de filtrage après l'animation
    setTimeout(() => setIsFiltering(false), 150);
  };

  const handleAddToCartClick = (e, produit) => {
    e.preventDefault();
    
    // Vérifier si le produit a des tailles disponibles
    const availableSizes = produit.tailles.filter(t => t.stock > 0);
    
    if (availableSizes.length === 0) {
      // Aucune taille disponible
      return;
    } else if (availableSizes.length === 1) {
      // Une seule taille disponible, ajouter directement
      const sizeData = availableSizes[0];
      addToCart({
        ...produit,
        selectedSize: sizeData.taille,
        stock: sizeData.stock
      });
    } else {
      // Plusieurs tailles, ouvrir le modal
      setSelectedProduct(produit);
      setSizeModalOpen(true);
    }
  };

  const handleSizeModalClose = () => {
    setSizeModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSizeModalAddToCart = (productWithSize) => {
    addToCart(productWithSize);
    handleSizeModalClose();
  };

  const hasAvailableSizes = (produit) => {
    return produit.tailles.some(t => t.stock > 0);
  };

  // Calculer l'espacement optimal basé sur la largeur disponible
  const calculateOptimalSpacing = () => {
    if (!containerWidth) return {};
    
    const isDesktop = !isMobileOrTablet;
    const isTablet = isMobileOrTablet && window.innerWidth > 767;
    const isMobile = isMobileOrTablet && window.innerWidth <= 767;
    
    // Tenir compte des marges et paddings du conteneur
    const containerPadding = 32; // 2rem de chaque côté
    const availableWidth = containerWidth - containerPadding;
    
    if (isDesktop) {
      if (effectiveColumns === 1) {
        // Mode 2 colonnes sur desktop - espacement confortable
        const cardWidth = 350; // Largeur fixe pour 2 colonnes
        const totalCardsWidth = cardWidth * 2;
        const remainingSpace = availableWidth - totalCardsWidth;
        const optimalGap = Math.max(8, Math.min(20, remainingSpace / 3)); // Entre 8px et 20px
        
        return {
          '--optimal-gap': `${optimalGap}px`,
          '--optimal-gap-half': `${optimalGap / 2}px`
        };
      } else if (effectiveColumns === 2) {
        // Mode 4 colonnes sur desktop - espacement serré
        const cardWidth = 280; // Largeur fixe pour 4 colonnes
        const totalCardsWidth = cardWidth * 4;
        const remainingSpace = availableWidth - totalCardsWidth;
        const optimalGap = Math.max(4, Math.min(12, remainingSpace / 5)); // Entre 4px et 12px
        
        return {
          '--optimal-gap': `${optimalGap}px`,
          '--optimal-gap-half': `${optimalGap / 2}px`
        };
      } else {
        // Mode mosaïque (6 colonnes) - espacement minimal
        const cardWidth = 200; // Largeur fixe pour 6 colonnes
        const totalCardsWidth = cardWidth * 6;
        const remainingSpace = availableWidth - totalCardsWidth;
        const optimalGap = Math.max(2, Math.min(6, remainingSpace / 7)); // Entre 2px et 6px (ultra-serré)
        
        return {
          '--optimal-gap': `${optimalGap}px`,
          '--optimal-gap-half': `${optimalGap / 2}px`
        };
      }
    } else if (isTablet) {
      // Tablette - espacement très serré
      const cardWidth = effectiveColumns === 1 ? 350 : 280;
      const totalCardsWidth = cardWidth * (effectiveColumns === 1 ? 1 : 2);
      const remainingSpace = availableWidth - totalCardsWidth;
      const optimalGap = Math.max(3, Math.min(10, remainingSpace / 2)); // Entre 3px et 10px (plus serré)
      
      return {
        '--optimal-gap': `${optimalGap}px`,
        '--optimal-gap-half': `${optimalGap / 2}px`
      };
    } else {
      // Mobile - espacement minimal
      const cardWidth = effectiveColumns === 1 ? 320 : 280;
      const totalCardsWidth = cardWidth * (effectiveColumns === 1 ? 1 : 2);
      const remainingSpace = availableWidth - totalCardsWidth;
      const optimalGap = Math.max(2, Math.min(6, remainingSpace / 2)); // Entre 2px et 6px (très serré)
      
      return {
        '--optimal-gap': `${optimalGap}px`,
        '--optimal-gap-half': `${optimalGap / 2}px`
      };
    }
  };

  const handleMobileFiltersToggle = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const handleMobileFiltersClose = () => {
    setMobileFiltersOpen(false);
  };

  // Animation variants pour les produits
  const productVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <div className="produits-container">
             {/* Boutons d'ajustement - Desktop uniquement */}
       <div style={{ 
         display: (isMobileOrTablet || isNavbarMenuOpen) ? 'none' : 'flex', 
         alignItems: 'center', 
         justifyContent: 'flex-end', 
         width: '100%', 
         maxWidth: 1400, 
         margin: '0 auto', 
         padding: '0 2rem',
         minHeight: '60px',
         willChange: 'auto',
         transform: 'translateZ(0)'
       }}>
         <div className="display-toggle-buttons" style={{ gap: 18, minHeight: '38px' }}>
          {[1, 2, 3].map((col, idx) => {
            const getLabel = (mode) => {
              switch(mode) {
                case 1: return '2 produits par ligne';
                case 2: return '4 produits par ligne';
                case 3: return 'Affichage mosaïque';
                default: return '';
              }
            };
            
            return (
              <button
                key={col}
                onClick={() => setColumns(col)}
                aria-label={getLabel(col)}
                className={effectiveColumns === col ? 'toggle-btn-active' : ''}
                disabled={shouldDisableToggleButtons}
                style={{
                  background: 'none',
                  border: 'none',
                  borderRadius: 0,
                  padding: 0,
                  margin: 0,
                  cursor: shouldDisableToggleButtons ? 'default' : 'pointer',
                  outline: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: shouldDisableToggleButtons ? 0.3 : (effectiveColumns === col ? 1 : 0.6),
                  transition: 'all 0.2s ease',
                  height: 38,
                  width: 38,
                  position: 'relative',
                  willChange: 'auto',
                  transform: 'translateZ(0)',
                }}
                onMouseEnter={(e) => {
                  if (!shouldDisableToggleButtons && effectiveColumns !== col) {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {/* Icônes SVG style Mango */}
                {col === 1 && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="8" height="18" rx="1" stroke="#222" strokeWidth="1.5" fill="none" />
                    <rect x="13" y="3" width="8" height="18" rx="1" stroke="#222" strokeWidth="1.5" fill="none" />
                  </svg>
                )}
                {col === 2 && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="3" width="4.5" height="18" rx="0.5" stroke="#222" strokeWidth="1.5" fill="none" />
                    <rect x="7.75" y="3" width="4.5" height="18" rx="0.5" stroke="#222" strokeWidth="1.5" fill="none" />
                    <rect x="13.5" y="3" width="4.5" height="18" rx="0.5" stroke="#222" strokeWidth="1.5" fill="none" />
                    <rect x="19.25" y="3" width="2.75" height="18" rx="0.5" stroke="#222" strokeWidth="1.5" fill="none" />
                  </svg>
                )}
                {col === 3 && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="8" height="8" rx="1" stroke="#222" strokeWidth="1.5" fill="none" />
                    <rect x="13" y="3" width="8" height="8" rx="1" stroke="#222" strokeWidth="1.5" fill="none" />
                    <rect x="3" y="13" width="8" height="8" rx="1" stroke="#222" strokeWidth="1.5" fill="none" />
                    <rect x="13" y="13" width="8" height="8" rx="1" stroke="#222" strokeWidth="1.5" fill="none" />
                  </svg>
                )}
                {/* Underline effet actif */}
                <span style={{
                  display: 'block',
                  height: effectiveColumns === col ? 4 : 0,
                  width: 28,
                  marginTop: 2,
                  background: effectiveColumns === col ? '#222' : 'transparent',
                  borderRadius: 2,
                  transition: 'all 0.18s',
                }} />
              </button>
            );
          })}
        </div>
      </div>
      {selectedCategories.length > 0 && (
        <div style={{ marginBottom: 16, marginLeft: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, color: '#e91e63' }}>
            Catégorie{selectedCategories.length > 1 ? 's' : ''} ({selectedCategories.length}/5) :
          </span>
          {selectedCategories.map((cat, index) => (
            <div key={index} style={{ 
              background: '#f5f5f5', 
              border: '1px solid #e91e63', 
              borderRadius: 16, 
              padding: '4px 12px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              fontSize: '0.9rem'
            }}>
              <span style={{ color: '#e91e63', fontWeight: 500 }}>{cat}</span>
              <button
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#e91e63', 
                  cursor: 'pointer', 
                  padding: 0,
                  fontSize: '1.1rem',
                  lineHeight: 1
                }}
                onClick={() => removeSelectedCategory(cat)}
                title={`Retirer ${cat}`}
              >
                ×
              </button>
            </div>
          ))}
          <button
            style={{ 
              background: '#e91e63', 
              color: 'white', 
              border: 'none', 
              borderRadius: 16, 
              padding: '6px 16px', 
              cursor: 'pointer', 
              fontWeight: 500,
              fontSize: '0.85rem'
            }}
            onClick={() => clearAllCategories()}
          >
            Tout effacer
          </button>
        </div>
      )}
      {/* Barre sticky avec texte filtre/trier pour mobile/tablette */}
      {isMobileOrTablet && (
        <div
          className={`filters-sticky-mobile-bar${isSticky ? ' sticky-glass' : ''}`}
          ref={filtersBarRef}
          style={{ 
            display: (mobileFiltersOpen || isNavbarMenuOpen) ? 'none' : undefined,
          }}
        >
        <button 
          className="filters-open-text-btn" 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Filter button clicked - sticky mode:', isSticky);
            setMobileFiltersOpen(true);
            return false;
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
        >
          <span>Filtrer et trier</span>
        </button>
        <div className="display-toggle-buttons" style={{ gap: isMobile ? 8 : 12, minHeight: isMobile ? '30px' : '36px' }}>
          {[1, 2, 3].map((col) => (
            <button
              key={col}
              onClick={() => setColumns(col)}
              aria-label={`Afficher ${col === 1 ? '2' : col === 2 ? '4' : 'mosaïque'} produits par ligne`}
              className={effectiveColumns === col ? 'toggle-btn-active' : ''}
              disabled={shouldDisableToggleButtons}
              style={{
                background: 'none',
                border: 'none',
                borderRadius: 0,
                padding: 0,
                margin: 0,
                cursor: shouldDisableToggleButtons ? 'default' : 'pointer',
                outline: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: shouldDisableToggleButtons ? 0.3 : (effectiveColumns === col ? 1 : 0.6),
                transition: 'all 0.2s ease',
                height: isMobile ? 30 : isTablet ? 34 : 32,
                width: isMobile ? 30 : isTablet ? 34 : 32,
                position: 'relative',
                willChange: 'auto',
                transform: 'translateZ(0)',
              }}
              onMouseEnter={(e) => {
                if (!shouldDisableToggleButtons && effectiveColumns !== col) {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {/* Icônes SVG style Mango comme sur desktop */}
              {col === 1 && (
                <svg width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="8" height="18" rx="1" stroke="#222" strokeWidth="1.5" fill="none" />
                  <rect x="13" y="3" width="8" height="18" rx="1" stroke="#222" strokeWidth="1.5" fill="none" />
                </svg>
              )}
              {col === 2 && (
                <svg width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="3" width="4.5" height="18" rx="0.5" stroke="#222" strokeWidth="1.5" fill="none" />
                  <rect x="7.75" y="3" width="4.5" height="18" rx="0.5" stroke="#222" strokeWidth="1.5" fill="none" />
                  <rect x="13.5" y="3" width="4.5" height="18" rx="0.5" stroke="#222" strokeWidth="1.5" fill="none" />
                  <rect x="19.25" y="3" width="2.75" height="18" rx="0.5" stroke="#222" strokeWidth="1.5" fill="none" />
                </svg>
              )}
              {col === 3 && (
                <svg width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="8" height="8" rx="1" stroke="#222" strokeWidth="1.5" fill="none" />
                  <rect x="13" y="3" width="8" height="8" rx="1" stroke="#222" strokeWidth="1.5" fill="none" />
                  <rect x="3" y="13" width="8" height="8" rx="1" stroke="#222" strokeWidth="1.5" fill="none" />
                  <rect x="13" y="13" width="8" height="8" rx="1" stroke="#222" strokeWidth="1.5" fill="none" />
                </svg>
              )}
              {/* Underline effet actif */}
              <span style={{
                display: 'block',
                height: effectiveColumns === col ? 4 : 0,
                width: isMobile ? 20 : 24,
                marginTop: 2,
                background: effectiveColumns === col ? '#222' : 'transparent',
                borderRadius: 2,
                transition: 'all 0.18s',
              }} />
            </button>
          ))}
        </div>
        </div>
      )}
      <Drawer
        anchor="left"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        className="mobile-filters-drawer"
        PaperProps={{ className: 'mobile-filters-paper' }}
      >
        <div className="mobile-filters-header">
          <span className="mobile-filters-title">Filtres & Tri</span>
          <button className="mobile-filters-close" onClick={() => setMobileFiltersOpen(false)} aria-label="Fermer">✕</button>
        </div>
                 <div className="mobile-filters-content">
           <SearchFilters 
             onFiltersChange={handleFiltersChange}
             produits={produits}
             alwaysOpen={true}
             selectedCategories={selectedCategories}
             key={`mobile-filters-${resetTrigger}`}
           />
         </div>
      </Drawer>
      <div className="produits-layout">
        {/* Sidebar des filtres - Desktop uniquement */}
                 <div className="filters-sidebar">
           <SearchFilters 
             onFiltersChange={handleFiltersChange}
             produits={produits}
             alwaysOpen={true}
             selectedCategories={selectedCategories}
             key={`desktop-filters-${resetTrigger}`}
           />
         </div>
          

          <div 
            ref={productsSectionRef}
            className="products-section" 
            style={{ transition: 'all 0.4s cubic-bezier(0.4,0.2,0.2,1)', padding: 0, margin: 0 }}
          >
           <AnimatePresence mode="wait">
             {displayedProducts.length === 0 ? (
               // Affichage quand aucun produit ne correspond aux filtres
                               <motion.div
                  key="no-products"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                 style={{ 
                   display: 'flex', 
                   flexDirection: 'column', 
                   alignItems: 'center', 
                   justifyContent: 'center',
                   padding: '4rem 2rem',
                   textAlign: 'center',
                   minHeight: '400px'
                 }}
               >
                 <div style={{ 
                   maxWidth: '500px',
                   width: '100%'
                 }}>
                   {/* Icône */}
                   <div style={{ 
                     fontSize: '4rem', 
                     marginBottom: '1.5rem',
                     opacity: 0.6
                   }}>
                     👗
                   </div>
                   
                   {/* Titre */}
                   <Typography 
                     variant="h5" 
                     style={{ 
                       fontWeight: 600, 
                       color: '#333', 
                       marginBottom: '1rem',
                       fontSize: '1.5rem'
                     }}
                   >
                     Aucun produit trouvé
                   </Typography>
                   
                   {/* Message */}
                   <Typography 
                     variant="body1" 
                     style={{ 
                       color: '#666', 
                       marginBottom: '2rem',
                       fontSize: '1rem',
                       lineHeight: '1.6'
                     }}
                   >
                     Aucun produit ne correspond à vos critères de recherche. 
                     Essayez d'ajuster vos filtres ou de modifier vos termes de recherche.
                   </Typography>
                   
                   {/* Suggestions */}
                   <div style={{ 
                     display: 'flex', 
                     flexDirection: 'column', 
                     gap: '1rem',
                     alignItems: 'center'
                   }}>
                     <Typography 
                       variant="subtitle2" 
                       style={{ 
                         fontWeight: 600, 
                         color: '#333',
                         marginBottom: '0.5rem',
                         fontSize: '0.9rem',
                         textTransform: 'uppercase',
                         letterSpacing: '0.5px'
                       }}
                     >
                       Suggestions :
                     </Typography>
                     
                     <div style={{ 
                       display: 'flex', 
                       flexDirection: 'column',
                       gap: '1rem', 
                       alignItems: 'center',
                       width: '100%'
                     }}>
                      <Button
                        variant="contained"
                        size="medium"
                                                 onClick={() => {
                           // Réinitialiser tous les filtres
                           resetAllFilters();
                         }}
                        style={{
                          background: '#000',
                          color: '#fff',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          boxShadow: 'none',
                          minWidth: '200px',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: '#333',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                          }
                        }}
                      >
                        Voir tous les produits
                      </Button>
                      
                      <div style={{ 
                        display: 'flex', 
                        gap: '1rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                      }}>
                                                                           <Button
                            variant="outlined"
                            size="medium"
                            onClick={() => {
                              // Réinitialiser tous les filtres
                              resetAllFilters();
                            }}
                            sx={{
                              color: '#e91e63',
                              borderColor: '#e91e63',
                              background: '#fff',
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              padding: '10px 20px',
                              borderRadius: '6px',
                              borderWidth: '2px',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 2px 8px rgba(233, 30, 99, 0.1)',
                              position: 'relative',
                              overflow: 'hidden',
                              '&:hover': {
                                borderColor: '#ff4081',
                                color: '#ff4081',
                                background: '#fff',
                                boxShadow: '0 0 20px rgba(255, 64, 129, 0.6), 0 0 40px rgba(255, 64, 129, 0.4), 0 0 60px rgba(255, 64, 129, 0.2), 0 0 80px rgba(255, 64, 129, 0.1)',
                                transform: 'translateY(-2px) scale(1.02)',
                                textShadow: '0 0 8px rgba(255, 64, 129, 0.8), 0 0 16px rgba(255, 64, 129, 0.4)',
                                '&::before': {
                                  left: '100%'
                                },
                                '&::after': {
                                  opacity: 1,
                                  transform: 'scale(1.1)'
                                }
                              },
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255, 64, 129, 0.3), transparent)',
                                transition: 'left 0.5s ease',
                                zIndex: 1
                              },
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle, rgba(255, 64, 129, 0.1) 0%, transparent 70%)',
                                opacity: 0,
                                transition: 'all 0.3s ease',
                                transform: 'scale(0.8)',
                                pointerEvents: 'none'
                              }
                            }}
                          >
                            Réinitialiser les filtres
                          </Button>
                         
                                                   <Button
                            variant="outlined"
                            size="medium"
                            onClick={() => {
                              // Élargir la recherche
                              setFilteredProducts(produits.filter(p => 
                                p.prix <= 200 && 
                                (selectedCategory ? p.categorie === selectedCategory : true)
                              ));
                            }}
                            sx={{
                              color: '#e91e63',
                              borderColor: '#e91e63',
                              background: '#fff',
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              padding: '10px 20px',
                              borderRadius: '6px',
                              borderWidth: '2px',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 2px 8px rgba(233, 30, 99, 0.1)',
                              position: 'relative',
                              overflow: 'hidden',
                              '&:hover': {
                                borderColor: '#ff4081',
                                color: '#ff4081',
                                background: '#fff',
                                boxShadow: '0 0 20px rgba(255, 64, 129, 0.6), 0 0 40px rgba(255, 64, 129, 0.4), 0 0 60px rgba(255, 64, 129, 0.2), 0 0 80px rgba(255, 64, 129, 0.1)',
                                transform: 'translateY(-2px) scale(1.02)',
                                textShadow: '0 0 8px rgba(255, 64, 129, 0.8), 0 0 16px rgba(255, 64, 129, 0.4)',
                                '&::before': {
                                  left: '100%'
                                },
                                '&::after': {
                                  opacity: 1,
                                  transform: 'scale(1.1)'
                                }
                              },
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255, 64, 129, 0.3), transparent)',
                                transition: 'left 0.5s ease',
                                zIndex: 1
                              },
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle, rgba(255, 64, 129, 0.1) 0%, transparent 70%)',
                                opacity: 0,
                                transition: 'all 0.3s ease',
                                transform: 'scale(0.8)',
                                pointerEvents: 'none'
                              }
                            }}
                          >
                            Élargir la recherche
                          </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
                                                       ) : (
                            // Affichage normal avec Masonry pour tous les produits
                              <motion.div
                  key={`masonry-${displayedProducts.length}-${effectiveColumns}-${isFiltering}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
               >
                 <Masonry
                   breakpointCols={breakpointColumnsObj}
                   className={`masonry-grid masonry-grid-left ${
                     isMobileOrTablet 
                       ? adaptiveColumns === 1 
                         ? 'masonry-grid-1col-mobile' 
                         : adaptiveColumns === 2
                           ? 'masonry-grid-2cols-mobile'
                           : 'masonry-grid-3cols-mobile'
                       : adaptiveColumns === 1 
                         ? 'masonry-grid-2cols' 
                         : adaptiveColumns === 2
                           ? 'masonry-grid-4cols'
                           : 'masonry-grid-mosaic'
                   }`}
                   columnClassName="masonry-grid_column"
                   style={calculateOptimalSpacing()}
                 >
                          {displayedProducts.map((produit, i) => {
                const availableSizes = produit.tailles ? produit.tailles.filter(t => t.stock > 0) : [];
                return (
                                     <motion.div
                     key={`${produit.id}-${isFiltering}-${effectiveColumns}`}
                     variants={productVariants}
                     initial="initial"
                     animate="animate"
                     exit="exit"
                     transition={{ duration: 0.15, delay: i * 0.025 }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        width: '100%',
                        maxWidth: adaptiveColumns === 1 ? 400 : adaptiveColumns === 2 ? 280 : adaptiveColumns === 3 ? (isMobileOrTablet ? 120 : 200) : 280,
                        height: adaptiveColumns === 1 ? 600 : adaptiveColumns === 2 ? 480 : adaptiveColumns === 3 ? (isMobileOrTablet ? 200 : 300) : 350,
                        background: 'none',
                        border: 'none',
                        boxShadow: 'none',
                        margin: 0,
                        padding: 0,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={() => !isMobileOrTablet && setHoveredProductId(produit.id)}
                      onMouseLeave={() => !isMobileOrTablet && setHoveredProductId(null)}
                    >
                      <div style={{ position: 'relative', display: 'block' }}>
                        <Link to={`/produit/${produit.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MultiImageCard
                            product={produit}
                            className="product-image"
                            aspectRatio={adaptiveColumns === 1 ? '1/1.1' : adaptiveColumns === 2 ? '1/1.25' : '1/1.4'}
                            objectFit="cover"
                            showIndicators={!isMobileOrTablet}
                            autoRotate={false}
                            style={{
                              width: '100%',
                              height: adaptiveColumns === 1 ? 440 : adaptiveColumns === 2 ? 350 : adaptiveColumns === 3 ? (isMobileOrTablet ? 140 : 220) : 200,
                              cursor: 'pointer',
                              borderRadius: '8px'
                            }}
                          />
                        </Link>
                        
                        {/* OVERLAY GLASS DESKTOP : tailles au hover, directement dans l'image */}
                        {!isMobileOrTablet && hoveredProductId === produit.id && (
                          <div
                            className="size-overlay-mango"
                            style={{
                              position: 'absolute',
                              left: 0,
                              right: 0,
                              bottom: 0,
                              height: 50,
                              width: '100%',
                              background: 'rgba(255,255,255,0.85)',
                              backdropFilter: 'blur(8px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 10,
                              boxShadow: 'none',
                              transition: 'all 0.2s ease',
                              borderRadius: '0 0 8px 8px',
                              border: 'none',
                            }}
                          >
                            {availableSizes.length > 0 ? (
                              <div style={{ 
                                display: 'flex', 
                                gap: availableSizes.length > 4 ? 20 : 32, 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                width: '100%',
                                padding: '0 20px'
                              }}>
                                {availableSizes.map((t) => (
                                  <button
                                    key={t.taille}
                                    className="size-button-mango"
                                    style={{
                                      fontWeight: 400,
                                      fontSize: '1rem',
                                      color: '#333',
                                      cursor: 'pointer',
                                      padding: '4px 8px',
                                      borderRadius: '0',
                                      transition: 'all 0.15s ease',
                                      userSelect: 'none',
                                      background: 'transparent',
                                      border: 'none',
                                      minWidth: 'auto',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontFamily: 'inherit',
                                      letterSpacing: '0.3px',
                                      position: 'relative',
                                    }}
                                    onClick={() => {
                                      addToCart({ ...produit, selectedSize: t.taille, stock: t.stock });
                                      setHoveredProductId(null);
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#000';
                                      e.currentTarget.style.fontWeight = '500';
                                      e.currentTarget.style.textDecoration = 'underline';
                                      e.currentTarget.style.textUnderlineOffset = '4px';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#333';
                                      e.currentTarget.style.fontWeight = '400';
                                      e.currentTarget.style.textDecoration = 'none';
                                    }}
                                  >
                                    {t.taille}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                color: '#d32f2f',
                                fontWeight: 600,
                                fontSize: '1rem'
                              }}>
                                <span style={{ fontSize: '1.2rem' }}>⚠</span>
                                <span>Rupture de stock</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      
                      <CardContent sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'stretch',
                        background: 'none',
                        border: 'none',
                        margin: 0,
                        padding: '12px 8px 0 8px',
                      }}>
                        {isMobileOrTablet ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
                            {/* Mode mosaïque (3+ colonnes) : nom et prix sur la même ligne */}
                            {effectiveColumns >= 3 ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
                                <Typography 
                                  variant="subtitle1" 
                                  className={isMobile && effectiveColumns === 3 ? 'product-title-mosaic-mobile' : ''}
                                  sx={{ 
                                    fontWeight: 600, 
                                    fontSize: '0.85rem',
                                    wordBreak: 'break-word',
                                    flex: 1,
                                    minWidth: 0,
                                    lineHeight: 1.2
                                  }}>{produit.nom}</Typography>
                                <Typography variant="body2" sx={{ 
                                  color: '#888', 
                                  fontSize: '0.8rem',
                                  fontWeight: 500,
                                  flexShrink: 0
                                }}>{produit.prix.toFixed(2)} €</Typography>
                              </div>
                            ) : (
                              /* Mode 1-2 colonnes : layout classique */
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '1.08rem', mb: 0.5, wordBreak: 'break-word' }}>{produit.nom}</Typography>
                                  <Typography variant="body2" sx={{ color: '#888', fontSize: '0.98rem', mb: 1 }}>{produit.prix.toFixed(2)} €</Typography>
                                </div>
                                {effectiveColumns === 2 && (
                                  <Button
                                    variant="text"
                                    color="inherit"
                                    style={{ 
                                      minWidth: 36, 
                                      height: 36, 
                                      borderRadius: '50%', 
                                      background: 'transparent', 
                                      boxShadow: 'none', 
                                      padding: 0, 
                                      margin: 0,
                                      flexShrink: 0,
                                      marginLeft: 8
                                    }}
                                    onClick={(e) => handleAddToCartClick(e, produit)}
                                    disabled={!hasAvailableSizes(produit)}
                                    aria-label="Ajouter au panier"
                                  >
                                    <AddIcon style={{ color: '#222', fontSize: 28 }} />
                                  </Button>
                                )}
                              </div>
                            )}
                            {effectiveColumns === 1 && (
                              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                                <Button
                                  variant="contained"
                                  style={{ 
                                    background: '#000', 
                                    color: '#fff', 
                                    borderRadius: '8px', 
                                    padding: '8px 16px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    boxShadow: 'none'
                                  }}
                                  onClick={(e) => handleAddToCartClick(e, produit)}
                                  disabled={!hasAvailableSizes(produit)}
                                >
                                  {hasAvailableSizes(produit) ? 'Ajouter au panier' : 'Rupture de stock'}
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '1.08rem', mb: 0.5 }}>{produit.nom}</Typography>
                            <Typography variant="body2" sx={{ color: '#888', fontSize: '0.98rem', mb: 1 }}>{produit.prix.toFixed(2)} €</Typography>
                          </>
                        )}
                       </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </Masonry>
            {/* Bouton "Voir plus" */}
            {hasMoreProducts && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '3rem',
                  marginBottom: '2rem'
                }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  sx={{
                    color: '#333',
                    borderColor: '#333',
                    background: '#fff',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    borderWidth: '2px',
                    minWidth: '200px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      borderColor: '#000',
                      color: '#000',
                      background: '#fff',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      opacity: 0.6,
                      cursor: 'not-allowed'
                    }
                  }}
                >
                  {isLoadingMore ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div 
                        style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #ccc',
                          borderTop: '2px solid #333',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}
                      />
                      <span>Chargement...</span>
                    </div>
                  ) : (
                    `Voir plus (${Math.min(LOAD_MORE_COUNT, filteredProducts.length - displayedCount)} produits)`
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
      <SizeSelectionModal
        open={sizeModalOpen}
        onClose={handleSizeModalClose}
        produit={selectedProduct}
        onAddToCart={handleSizeModalAddToCart}
      />
    </div>
  );
} 