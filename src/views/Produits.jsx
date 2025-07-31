import React, { useState, useEffect, useRef } from 'react';
import Masonry from 'react-masonry-css';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Drawer, IconButton, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { FilterList as FilterIcon, Close as CloseIcon } from '@mui/icons-material';
import './Produits.css';
import { useCart } from '../cartContext';
import { Link, useLocation } from 'react-router-dom';
import produits from '../data/produits';
import SearchFilters from '../components/SearchFilters';
import SizeSelectionModal from '../components/SizeSelectionModal';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';

export default function Produits() {
  const { addToCart } = useCart();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(location.state?.categorie || null);
  const [filteredProducts, setFilteredProducts] = useState(produits);
  const [isFiltering, setIsFiltering] = useState(false);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const filtersBarRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const isMobileOrTablet = useMediaQuery('(max-width:1024px)');
  const [columns, setColumns] = useState(isMobileOrTablet ? 1 : 2); // 1 colonne par défaut sur mobile, 2 (4 colonnes) sur desktop
  
  // Forcer l'affichage en mode liste si il n'y a qu'un seul produit ou seulement 2 produits
  const effectiveColumns = (filteredProducts.length === 1 || filteredProducts.length === 2) ? 1 : columns;
  const theme = useTheme();
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [isNavbarMenuOpen, setIsNavbarMenuOpen] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  
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
  
  // Filtrage par catégorie si sélectionnée
  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(produits.filter(p => p.categorie === selectedCategory));
    } else {
      setFilteredProducts(produits);
    }
  }, [selectedCategory]);

  // Si navigation avec state (depuis la navbar)
  useEffect(() => {
    if (location.state?.categorie) {
      setSelectedCategory(location.state.categorie);
    }
  }, [location.state]);

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
        setIsSticky(!entry.isIntersecting);
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

  // Breakpoints pour le responsive masonry
  const breakpointColumnsObj = isMobileOrTablet
    ? { default: effectiveColumns === 1 ? 1 : effectiveColumns } // Si "liste", forcer 1 colonne sur mobile
    : { default: effectiveColumns === 1 ? 2 : effectiveColumns === 2 ? 4 : effectiveColumns, 1100: 2, 700: 1 }; // columns 2 = 4 colonnes

  const handleFiltersChange = (filteredProducts) => {
    setIsFiltering(true);
    // Si une catégorie est sélectionnée, on filtre d'abord par catégorie
    if (selectedCategory) {
      setFilteredProducts(filteredProducts.filter(p => p.categorie === selectedCategory));
    } else {
      setFilteredProducts(filteredProducts);
    }
    
    // Reset l'état de filtrage après l'animation
    setTimeout(() => setIsFiltering(false), 100);
  };

  const resetAllFilters = () => {
    setIsFiltering(true);
    // Réinitialiser complètement tous les filtres et afficher tous les produits
    setFilteredProducts(produits);
    setSelectedCategory(null);
    // Déclencher la réinitialisation des filtres dans SearchFilters
    setResetTrigger(prev => prev + 1);
    
    // Reset l'état de filtrage après l'animation
    setTimeout(() => setIsFiltering(false), 100);
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

  const handleMobileFiltersToggle = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const handleMobileFiltersClose = () => {
    setMobileFiltersOpen(false);
  };

  return (
    <div className="produits-container">
             {/* Boutons d'ajustement - Desktop uniquement */}
       <div style={{ display: (isMobileOrTablet || isNavbarMenuOpen) ? 'none' : 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%', maxWidth: 1400, margin: '0 auto', padding: '0 2rem' }}>
         <div className="display-toggle-buttons" style={{ gap: 18 }}>
          {[1, 2].map((col, idx) => (
            <button
              key={col}
              onClick={() => setColumns(col)}
              aria-label={`Afficher ${col === 1 ? 2 : 4} produits par ligne`}
              className={effectiveColumns === col ? 'toggle-btn-active' : ''}
                             disabled={filteredProducts.length === 1 || filteredProducts.length === 2}
                              style={{
                  background: 'none',
                  border: 'none',
                  borderRadius: 0,
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                  outline: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: (effectiveColumns === col && filteredProducts.length > 2) ? 1 : 0.3,
                  transition: 'all 0.2s ease',
                  height: 38,
                  width: 38,
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (effectiveColumns !== col && filteredProducts.length > 2) {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
            >
              {/* Icônes SVG personnalisées */}
              {col === 1 && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="1.5" stroke="#222" strokeWidth="1.5" fill="none" />
                </svg>
              )}
              {col === 2 && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="8" height="18" rx="1.5" stroke="#222" strokeWidth="1.5" fill="none" />
                  <rect x="13" y="3" width="8" height="18" rx="1.5" stroke="#222" strokeWidth="1.5" fill="none" />
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
          ))}
        </div>
      </div>
      {selectedCategory && (
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 600, color: '#e91e63' }}>Catégorie : {selectedCategory}</span>
          <button
            style={{ background: '#eee', border: 'none', borderRadius: 16, padding: '4px 14px', cursor: 'pointer', color: '#e91e63', fontWeight: 500 }}
            onClick={() => setSelectedCategory(null)}
          >
            Réinitialiser
          </button>
        </div>
      )}
      {/* Barre sticky avec texte filtre/trier pour mobile/tablette */}
      <div
        className={`filters-sticky-mobile-bar${isSticky ? ' sticky-glass' : ''}`}
        ref={filtersBarRef}
        style={{ 
          display: (mobileFiltersOpen || isNavbarMenuOpen) ? 'none' : 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}
      >
        <span className="filters-open-text" onClick={() => setMobileFiltersOpen(true)}>
          Filtrer et trier
        </span>
        {isMobileOrTablet && (
          <div className="display-toggle-buttons" style={{ gap: 12 }}>
            {[1, 2].map((col) => (
              <button
                key={col}
                onClick={() => setColumns(col)}
                aria-label={`Afficher ${col === 1 ? 1 : 2} produits par ligne`}
                className={effectiveColumns === col ? 'toggle-btn-active' : ''}
                disabled={filteredProducts.length === 1 || filteredProducts.length === 2}
                style={{
                  background: 'none',
                  border: 'none',
                  borderRadius: 0,
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                  outline: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: (effectiveColumns === col && filteredProducts.length > 2) ? 1 : 0.3,
                  transition: 'all 0.2s ease',
                  height: 32,
                  width: 32,
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (effectiveColumns !== col && filteredProducts.length > 2) {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {/* Icônes SVG personnalisées */}
                {col === 1 && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="1.5" stroke="#e91e63" strokeWidth="1.5" fill="none" />
                  </svg>
                )}
                {col === 2 && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="8" height="18" rx="1.5" stroke="#e91e63" strokeWidth="1.5" fill="none" />
                    <rect x="13" y="3" width="8" height="18" rx="1.5" stroke="#e91e63" strokeWidth="1.5" fill="none" />
                  </svg>
                )}
                {/* Underline effet actif */}
                <span style={{
                  display: 'block',
                  height: effectiveColumns === col ? 3 : 0,
                  width: 20,
                  marginTop: 2,
                  background: effectiveColumns === col ? '#e91e63' : 'transparent',
                  borderRadius: 2,
                  transition: 'all 0.18s',
                }} />
              </button>
            ))}
          </div>
        )}
      </div>
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
             resetTrigger={resetTrigger}
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
             resetTrigger={resetTrigger}
           />
         </div>
                          {/* Zone des produits */}
         <div className="products-section" style={{ transition: 'all 0.4s cubic-bezier(0.4,0.2,0.2,1)', padding: 0, margin: 0 }}>
           {filteredProducts.length === 0 ? (
             // Affichage quand aucun produit ne correspond aux filtres
             <div style={{ 
               display: 'flex', 
               flexDirection: 'column', 
               alignItems: 'center', 
               justifyContent: 'center',
               padding: '4rem 2rem',
               textAlign: 'center',
               minHeight: '400px'
             }}>
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
             </div>
           ) : (filteredProducts.length === 1 || filteredProducts.length === 2) ? (
                           // Affichage spécial pour un seul produit ou 2 produits - centré et plus large
                           <div style={{ 
                display: 'flex', 
                justifyContent: filteredProducts.length === 1 ? 'center' : 'flex-start',
                alignItems: 'flex-start',
                width: '100%',
                padding: '0 2rem',
                gap: filteredProducts.length === 2 ? '2rem' : '0'
              }}>
                <div style={{ 
                  maxWidth: filteredProducts.length === 1 ? '400px' : '100%', 
                  width: filteredProducts.length === 1 ? '100%' : 'auto',
                  display: filteredProducts.length === 2 ? 'flex' : 'block',
                  gap: filteredProducts.length === 2 ? '2rem' : '0'
                }}>
                 {filteredProducts.map((produit, i) => {
                   const availableSizes = produit.tailles ? produit.tailles.filter(t => t.stock > 0) : [];
                   return (
                     <Card
                                               key={`${produit.id}-${isFiltering}-${filteredProducts.length === 1 ? 'single' : 'double'}`}
                       elevation={0}
                       sx={{
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'stretch',
                         width: '100%',
                                                   maxWidth: filteredProducts.length === 1 ? '400px' : 'calc(50% - 1rem)',
                                                   height: filteredProducts.length === 1 ? 600 : 540,
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
                       <Link to={`/produit/${produit.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                         <CardMedia
                           component="img"
                           image={produit.image}
                           alt={produit.nom}
                           sx={{
                             width: '100%',
                                                           height: filteredProducts.length === 1 ? 440 : 390,
                             objectFit: 'cover',
                             display: 'block',
                             border: 'none',
                             margin: 0,
                             padding: 0,
                             cursor: 'pointer',
                             transition: 'transform 0.2s ease',
                             '&:hover': {
                               transform: 'scale(1.02)',
                             },
                           }}
                         />
                       </Link>
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
                             <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
                               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                                 <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '1.08rem', mb: 0.5, wordBreak: 'break-word' }}>{produit.nom}</Typography>
                                 <Typography variant="body2" sx={{ color: '#888', fontSize: '0.98rem', mb: 1 }}>{produit.prix.toFixed(2)} €</Typography>
                               </div>
                             </div>
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
                           </div>
                         ) : (
                           <>
                             <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '1.08rem', mb: 0.5 }}>{produit.nom}</Typography>
                             <Typography variant="body2" sx={{ color: '#888', fontSize: '0.98rem', mb: 1 }}>{produit.prix.toFixed(2)} €</Typography>
                           </>
                         )}
                       </CardContent>
                       {/* OVERLAY GLASS DESKTOP : tailles au hover, collé en bas de l'image */}
                       {!isMobileOrTablet && hoveredProductId === produit.id && (
                         <div
                           style={{
                             position: 'absolute',
                             left: 0,
                             right: 0,
                             bottom: '140px',
                             height: 60,
                             width: '100%',
                             background: 'rgba(255,255,255,0.85)',
                             backdropFilter: 'blur(8px)',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             zIndex: 2,
                             boxShadow: '0 -2px 16px rgba(0,0,0,0.07)',
                             transition: 'all 0.18s',
                             borderBottomLeftRadius: 0,
                             borderBottomRightRadius: 0,
                             borderTopLeftRadius: 0,
                             borderTopRightRadius: 0,
                           }}
                         >
                           {availableSizes.length > 0 ? (
                             <div style={{ display: 'flex', gap: 28, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                               {availableSizes.map((t) => (
                                 <span
                                   key={t.taille}
                                   style={{
                                     fontWeight: 500,
                                     fontSize: '1.18rem',
                                     color: '#222',
                                     cursor: 'pointer',
                                     padding: '2px 8px',
                                     borderRadius: 4,
                                     transition: 'color 0.15s, text-decoration 0.15s',
                                     userSelect: 'none',
                                   }}
                                   onClick={() => {
                                     addToCart({ ...produit, selectedSize: t.taille, stock: t.stock });
                                     setHoveredProductId(null);
                                   }}
                                   onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
                                   onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
                                 >
                                   {t.taille}
                                 </span>
                               ))}
                             </div>
                           ) : (
                             <span style={{ color: '#b71c47', fontWeight: 600 }}>Rupture de stock</span>
                           )}
                         </div>
                       )}
                     </Card>
                   );
                 })}
               </div>
             </div>
           ) : (
                           // Affichage normal avec Masonry pour 3 produits ou plus
             <Masonry
               breakpointCols={breakpointColumnsObj}
               className={`masonry-grid${effectiveColumns === 2 ? ' masonry-grid-left' : ''}`}
               columnClassName="masonry-grid_column masonry-grid_column-tight"
             >
                         {filteredProducts.map((produit, i) => {
               const availableSizes = produit.tailles ? produit.tailles.filter(t => t.stock > 0) : [];
               return (
                 <Card
                   key={`${produit.id}-${isFiltering}-${effectiveColumns}`}
                   elevation={0}
                   sx={{
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'stretch',
                     width: '100%',
                     maxWidth: effectiveColumns === 1 ? (filteredProducts.length === 1 ? 800 : 400) : effectiveColumns === 2 ? '99%' : 320, // Card plus large si un seul produit
                     height: effectiveColumns === 1 ? 600 : effectiveColumns === 2 ? 540 : 370, // Card plus haute en mode 4 par ligne
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
                   <Link to={`/produit/${produit.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                     <CardMedia
                       component="img"
                       image={produit.image}
                       alt={produit.nom}
                       sx={{
                         width: '100%',
                         height: effectiveColumns === 1 ? 440 : effectiveColumns === 2 ? 390 : 220, // Image plus haute en mode 4 par ligne
                         objectFit: 'cover',
                         display: 'block',
                         border: 'none',
                         margin: 0,
                         padding: 0,
                         cursor: 'pointer',
                         transition: 'transform 0.2s ease',
                         '&:hover': {
                           transform: 'scale(1.02)',
                         },
                       }}
                     />
                   </Link>
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
                   {/* OVERLAY GLASS DESKTOP : tailles au hover, collé en bas de l'image */}
                   {!isMobileOrTablet && hoveredProductId === produit.id && (
                     <div
                       style={{
                         position: 'absolute',
                         left: 0,
                         right: 0,
                         bottom: '140px', // 200px (img) - 60px (overlay)
                         height: 60,
                         width: '100%',
                         background: 'rgba(255,255,255,0.85)',
                         backdropFilter: 'blur(8px)',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         zIndex: 2,
                         boxShadow: '0 -2px 16px rgba(0,0,0,0.07)',
                         transition: 'all 0.18s',
                         borderBottomLeftRadius: 0,
                         borderBottomRightRadius: 0,
                         borderTopLeftRadius: 0,
                         borderTopRightRadius: 0,
                       }}
                     >
                       {availableSizes.length > 0 ? (
                         <div style={{ display: 'flex', gap: 28, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                           {availableSizes.map((t) => (
                             <span
                               key={t.taille}
                               style={{
                                 fontWeight: 500,
                                 fontSize: '1.18rem',
                                 color: '#222',
                                 cursor: 'pointer',
                                 padding: '2px 8px',
                                 borderRadius: 4,
                                 transition: 'color 0.15s, text-decoration 0.15s',
                                 userSelect: 'none',
                               }}
                               onClick={() => {
                                 addToCart({ ...produit, selectedSize: t.taille, stock: t.stock });
                                 setHoveredProductId(null);
                               }}
                               onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
                               onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
                             >
                               {t.taille}
                             </span>
                           ))}
                         </div>
                       ) : (
                         <span style={{ color: '#b71c47', fontWeight: 600 }}>Rupture de stock</span>
                       )}
                     </div>
                   )}
                 </Card>
               );
             })}
           </Masonry>
           )}
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