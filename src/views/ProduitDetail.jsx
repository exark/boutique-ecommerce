import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, CircularProgress, IconButton } from '@mui/material';
import { useCart } from '../cartContext';
import './ProduitDetail.css';
import produits from '../data/produits';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import StraightenIcon from '@mui/icons-material/Straighten';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SizeSelectionModal from '../components/SizeSelectionModal';

export default function ProduitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const produit = produits.find(p => p.id === parseInt(id));

  const handleRetour = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleAddToCartClick = () => {
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
      setSizeModalOpen(true);
    }
  };

  const handleSizeModalClose = () => {
    setSizeModalOpen(false);
  };

  const handleSizeModalAddToCart = (productWithSize) => {
    addToCart(productWithSize);
    handleSizeModalClose();
  };

  const hasAvailableSizes = (produit) => {
    return produit.tailles.some(t => t.stock > 0);
  };

  const getAvailableSizesCount = (produit) => {
    return produit.tailles.filter(t => t.stock > 0).length;
  };

  if (!produit) {
    return <div style={{ textAlign: 'center', marginTop: 80 }}>Produit introuvable.</div>;
  }

  return (
    <div className="produit-detail-global">
      {/* Bouton retour en haut à gauche, hors de la carte */}
      <IconButton
        onClick={handleRetour}
        className="produit-detail-retour-haut"
        disabled={loading}
      >
        <ArrowBackIcon />
      </IconButton>
      {loading && (
        <div className="produit-detail-loading-overlay">
          <CircularProgress size={60} thickness={4} style={{ color: '#e91e63' }} />
        </div>
      )}
      <div className="produit-detail-page">
        <div className="produit-detail-center">
          <motion.div
            className="produit-detail-container"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6, ease: [0.4, 0.2, 0.2, 1] }}
          >
            <div className="produit-detail-content-flex">
              <motion.img
                src={produit.image}
                alt={produit.nom}
                className="produit-detail-image"
                whileHover={{ scale: 1.04, rotate: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              />
              <div className="produit-detail-content-texte">
                {produit.nouveaute && (
                  <div className="produit-detail-nouveau">
                    <FiberNewIcon style={{ color: '#e91e63', marginRight: 6 }} /> Nouveauté
                  </div>
                )}
                <motion.h2
                  className="produit-detail-title"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {produit.nom}
                </motion.h2>
                <motion.p
                  className="produit-detail-desc"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {produit.description || 'Un produit tendance et féminin, parfait pour toutes les occasions.'}
                </motion.p>
                <div className="produit-detail-infos">
                  <div className="produit-detail-info"><Inventory2Icon sx={{ color: '#e91e63', mr: 1 }} /> <b>Matière :</b> {produit.matiere}</div>
                  <div className="produit-detail-info"><ColorLensIcon sx={{ color: '#e91e63', mr: 1 }} /> <b>Couleur :</b> {produit.couleur}</div>
                  <div className="produit-detail-info">
                    <StraightenIcon sx={{ color: '#e91e63', mr: 1 }} /> 
                    <b>Tailles disponibles :</b> {getAvailableSizesCount(produit)} taille{getAvailableSizesCount(produit) > 1 ? 's' : ''}
                  </div>
                  <div className="produit-detail-info">
                    <CheckCircleIcon sx={{ color: '#e91e63', mr: 1 }} /> 
                    <b>Disponibilité :</b> {hasAvailableSizes(produit) ? 'En stock' : 'Rupture de stock'}
                  </div>
                </div>
                <motion.div
                  className="produit-detail-price"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {produit.prix.toFixed(2)} €
                </motion.div>
                <Button
                  variant="contained"
                  color="primary"
                  className={`produit-detail-btn ${!hasAvailableSizes(produit) ? 'produit-detail-btn-disabled' : ''}`}
                  onClick={handleAddToCartClick}
                  disabled={!hasAvailableSizes(produit)}
                  size="large"
                >
                  {hasAvailableSizes(produit) ? 'Ajouter au panier' : 'Rupture de stock'}
                </Button>
                <Button
                  variant="text"
                  className="produit-detail-retour"
                  onClick={() => navigate(-1)}
                >
                  Retour à la boutique
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <SizeSelectionModal
        open={sizeModalOpen}
        onClose={handleSizeModalClose}
        produit={produit}
        onAddToCart={handleSizeModalAddToCart}
      />
    </div>
  );
} 