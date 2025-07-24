import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { motion } from 'framer-motion';
import './Produits.css';

// Exemple de données produits
const produits = [
  {
    id: 1,
    nom: 'Robe d’été fleurie',
    prix: 49.99,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    nom: 'Blouse légère',
    prix: 29.99,
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    nom: 'Jean taille haute',
    prix: 59.99,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    nom: 'Veste en jean',
    prix: 69.99,
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 5,
    nom: 'T-shirt basique',
    prix: 19.99,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 6,
    nom: 'Jupe plissée',
    prix: 39.99,
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
  },
];

export default function Produits() {
  return (
    <div className="produits-container">
      <h2 className="produits-title">Nos produits</h2>
      <Grid container spacing={4} justifyContent="center">
        {produits.map((produit, i) => (
          <Grid item key={produit.id} xs={12} sm={6} md={4} lg={3}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.4, 0.2, 0.2, 1] }}
            >
              <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200">
                <CardMedia
                  component="img"
                  height="220"
                  image={produit.image}
                  alt={produit.nom}
                  className="object-cover rounded-t-2xl"
                />
                <CardContent className="bg-white">
                  <Typography gutterBottom variant="h6" component="div" className="font-semibold text-lg">
                    {produit.nom}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="mb-2">
                    {produit.prix.toFixed(2)} €
                  </Typography>
                </CardContent>
                <CardActions className="bg-white pb-3">
                  <Button variant="contained" color="primary" className="!bg-pink-500 hover:!bg-pink-600 rounded-full px-6 shadow-none">
                    Ajouter au panier
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
} 