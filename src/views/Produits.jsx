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
  const theme = useTheme();
  const [hoveredProductId, setHoveredProductId] = useState(null);
  
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
    ? { default: columns === 1 ? 1 : columns } // Si "liste", forcer 1 colonne sur mobile
    : { default: columns === 1 ? 2 : columns === 2 ? 4 : columns, 1100: 2, 700: 1 }; // columns 2 = 4 colonnes

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
      {/* Ligne titre + boutons d'ajustement - Desktop uniquement */}
      <div style={{ display: isMobileOrTablet ? 'none' : 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 1400, margin: '0 auto', padding: '0 2rem' }}>
        <h2 className="produits-title" style={{ marginBottom: 0 }}>Nos produits</h2>
        <div className="display-toggle-buttons" style={{ gap: 18 }}>
          {[1, 2].map((col, idx) => (
            <button
              key={col}
              onClick={() => setColumns(col)}
              aria-label={`Afficher ${col === 1 ? 2 : 4} produits par ligne`}
              className={columns === col ? 'toggle-btn-active' : ''}
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
                opacity: columns === col ? 1 : 0.7,
                transition: 'opacity 0.2s',
                height: 38,
                width: 38,
                position: 'relative',
              }}
            >
              {/* Icônes SVG personnalisées */}
              {col === 1 && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="#222" strokeWidth="2" fill="none" />
                </svg>
              )}
              {col === 2 && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="7.5" height="16" rx="2" stroke="#222" strokeWidth="2" fill="none" />
                  <rect x="12.5" y="4" width="7.5" height="16" rx="2" stroke="#222" strokeWidth="2" fill="none" />
                </svg>
              )}
              {/* Underline effet actif */}
              <span style={{
                display: 'block',
                height: columns === col ? 4 : 0,
                width: 28,
                marginTop: 2,
                background: columns === col ? '#222' : 'transparent',
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
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
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
                className={columns === col ? 'toggle-btn-active' : ''}
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
                  opacity: columns === col ? 1 : 0.7,
                  transition: 'opacity 0.2s',
                  height: 32,
                  width: 32,
                  position: 'relative',
                }}
              >
                {/* Icônes SVG personnalisées */}
                {col === 1 && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#e91e63" strokeWidth="2" fill="none" />
                  </svg>
                )}
                {col === 2 && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="7.5" height="16" rx="2" stroke="#e91e63" strokeWidth="2" fill="none" />
                    <rect x="12.5" y="4" width="7.5" height="16" rx="2" stroke="#e91e63" strokeWidth="2" fill="none" />
                  </svg>
                )}
                {/* Underline effet actif */}
                <span style={{
                  display: 'block',
                  height: columns === col ? 3 : 0,
                  width: 20,
                  marginTop: 2,
                  background: columns === col ? '#e91e63' : 'transparent',
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
          />
        </div>
        {/* Zone des produits */}
        <div className="products-section" style={{ transition: 'all 0.4s cubic-bezier(0.4,0.2,0.2,1)', padding: 0, margin: 0 }}>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className={`masonry-grid${columns === 2 ? ' masonry-grid-left' : ''}`}
            columnClassName="masonry-grid_column masonry-grid_column-tight"
          >
            {filteredProducts.map((produit, i) => {
              const availableSizes = produit.tailles ? produit.tailles.filter(t => t.stock > 0) : [];
              return (
                <Card
                  key={`${produit.id}-${isFiltering}-${columns}`}
                  elevation={0}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    width: '100%',
                    maxWidth: columns === 1 ? 400 : columns === 2 ? '99%' : 320, // Card prend presque toute la colonne en mode 4 par ligne
                    height: columns === 1 ? 600 : columns === 2 ? 540 : 370, // Card plus haute en mode 4 par ligne
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
                        height: columns === 1 ? 440 : columns === 2 ? 390 : 220, // Image plus haute en mode 4 par ligne
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
                          {columns === 2 && (
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
                        {columns === 1 && (
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