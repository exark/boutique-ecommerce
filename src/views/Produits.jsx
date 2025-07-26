import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { motion } from 'framer-motion';
import './Produits.css';
import { useCart } from '../cartContext';
import { Link } from 'react-router-dom';
import produits from '../data/produits';
import SearchFilters from '../components/SearchFilters';

export default function Produits() {
  const { addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState(produits);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Breakpoints pour le responsive masonry
  const breakpointColumnsObj = {
    default: 4,
    1100: 2,
    700: 1
  };

  const handleFiltersChange = (filteredProducts) => {
    setIsFiltering(true);
    setFilteredProducts(filteredProducts);
    
    // Reset l'état de filtrage après l'animation
    setTimeout(() => setIsFiltering(false), 100);
  };

  return (
    <div className="produits-container">
      <h2 className="produits-title">Nos produits</h2>
      
      <SearchFilters 
        onFiltersChange={handleFiltersChange}
        produits={produits}
      />
      
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
                  <Button variant="contained" color="primary" className="!bg-pink-500 hover:!bg-pink-600 rounded-full px-6 shadow-none" onClick={(e) => { e.preventDefault(); addToCart(produit); }}>
                    Ajouter au panier
                  </Button>
                </CardActions>
              </Card>
            </Link>
          </motion.div>
        ))}
      </Masonry>
    </div>
  );
} 