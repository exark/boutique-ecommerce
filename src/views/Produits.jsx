import React from 'react';
import Masonry from 'react-masonry-css';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { motion } from 'framer-motion';
import './Produits.css';
import { useCart } from '../cartContext';
import { Link } from 'react-router-dom';
import produits from '../data/produits';

export default function Produits() {
  const { addToCart } = useCart();
  // Breakpoints pour le responsive masonry
  const breakpointColumnsObj = {
    default: 4,
    1100: 2,
    700: 1
  };
  return (
    <div className="produits-container">
      <h2 className="produits-title">Nos produits</h2>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {produits.map((produit, i) => (
          <motion.div
            key={produit.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.3, delay: i * 0.04, ease: [0.4, 0.2, 0.2, 1] }}
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