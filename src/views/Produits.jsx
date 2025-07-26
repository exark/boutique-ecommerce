import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Drawer, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { FilterList as FilterIcon, Close as CloseIcon } from '@mui/icons-material';
import './Produits.css';
import { useCart } from '../cartContext';
import { Link } from 'react-router-dom';
import produits from '../data/produits';
import SearchFilters from '../components/SearchFilters';
import SizeSelectionModal from '../components/SizeSelectionModal';

export default function Produits() {
  const { addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState(produits);
  const [isFiltering, setIsFiltering] = useState(false);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Breakpoints pour le responsive masonry
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  const handleFiltersChange = (filteredProducts) => {
    setIsFiltering(true);
    setFilteredProducts(filteredProducts);
    
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
      <h2 className="produits-title">Nos produits</h2>
      
      {/* Bouton flottant pour mobile */}
      <div className="mobile-filters-button">
        <IconButton
          onClick={handleMobileFiltersToggle}
          className="mobile-filter-toggle"
          aria-label="Ouvrir les filtres"
        >
          <FilterIcon />
        </IconButton>
      </div>

      <div className="produits-layout">
        {/* Sidebar des filtres - Desktop/Tablette */}
        <div className="filters-sidebar">
          <SearchFilters 
            onFiltersChange={handleFiltersChange}
            produits={produits}
          />
        </div>
        
        {/* Zone des produits */}
        <div className="products-section">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {filteredProducts.map((produit, i) => (
              <motion.div
                key={`${produit.id}-${isFiltering}`}
                initial={isFiltering ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: isFiltering ? i * 0.03 : 0,
                  ease: [0.4, 0.2, 0.2, 1] 
                }}
                style={{ marginBottom: 24 }}
              >
                <Link to={`/produit/${produit.id}`} style={{ textDecoration: 'none' }}>
                  <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <CardMedia
                      component="img"
                      image={produit.image}
                      alt={produit.nom}
                      sx={{ objectFit: 'cover' }}
                      className="object-cover rounded-t-2xl"
                    />
                    <CardContent className="bg-white" style={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="div" className="font-semibold text-lg">
                        {produit.nom}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" className="mb-2">
                        {produit.prix.toFixed(2)} €
                      </Typography>
                    </CardContent>
                    <CardActions className="bg-white pb-3" style={{ justifyContent: 'center' }}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        className={`!bg-pink-500 hover:!bg-pink-600 rounded-full px-6 shadow-none ${
                          !hasAvailableSizes(produit) ? '!bg-gray-400 !cursor-not-allowed' : ''
                        }`}
                        onClick={(e) => handleAddToCartClick(e, produit)}
                        disabled={!hasAvailableSizes(produit)}
                      >
                        {hasAvailableSizes(produit) ? 'Ajouter au panier' : 'Rupture de stock'}
                      </Button>
                    </CardActions>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </Masonry>
        </div>
      </div>

      {/* Drawer mobile pour les filtres */}
      <Drawer
        anchor="left"
        open={mobileFiltersOpen}
        onClose={handleMobileFiltersClose}
        className="mobile-filters-drawer"
        PaperProps={{
          className: 'mobile-filters-paper'
        }}
      >
        <div className="mobile-filters-header">
          <Typography variant="h6" className="mobile-filters-title">
            Filtres
          </Typography>
          <IconButton
            onClick={handleMobileFiltersClose}
            className="mobile-filters-close"
            aria-label="Fermer les filtres"
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className="mobile-filters-content">
          <SearchFilters 
            onFiltersChange={handleFiltersChange}
            produits={produits}
          />
        </div>
      </Drawer>

      <SizeSelectionModal
        open={sizeModalOpen}
        onClose={handleSizeModalClose}
        produit={selectedProduct}
        onAddToCart={handleSizeModalAddToCart}
      />
    </div>
  );
} 