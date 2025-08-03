import React, { useState } from 'react';
import { useCart } from '../cartContext';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  TextField,
  Divider,
  Box,
  Alert,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import './Commande.css';

export default function Commande() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    ville: '',
    codePostal: '',
    commentaires: ''
  });

  const [livraison, setLivraison] = useState('domicile');
  const [paiement, setPaiement] = useState('especes');
  const [errors, setErrors] = useState({});

  // Calculs du panier
  const subtotal = cart.reduce((acc, item) => acc + item.prix * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Supprimer l'erreur si le champ est rempli
    if (errors[name] && value.trim()) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (livraison === 'domicile') {
      if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est requise';
      if (!formData.ville.trim()) newErrors.ville = 'La ville est requise';
      if (!formData.codePostal.trim()) newErrors.codePostal = 'Le code postal est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = () => {
    if (!validateForm()) {
      return;
    }

    // Génération du message WhatsApp
    let msg = '🛍️ *NOUVELLE COMMANDE* 🛍️%0A%0A';
    
    // Informations client
    msg += `👤 *INFORMATIONS CLIENT*%0A`;
    msg += `Nom: ${formData.nom} ${formData.prenom}%0A`;
    msg += `Téléphone: ${formData.telephone}%0A`;
    msg += `Email: ${formData.email}%0A`;
    
    if (livraison === 'domicile') {
      msg += `Adresse: ${formData.adresse}, ${formData.ville} ${formData.codePostal}%0A`;
    }
    msg += `%0A`;

    // Détails de la commande
    msg += `📦 *DÉTAILS DE LA COMMANDE*%0A`;
    cart.forEach(item => {
      const sizeInfo = item.selectedSize ? ` (Taille: ${item.selectedSize})` : '';
      msg += `• ${item.nom}${sizeInfo} x${item.quantity} : ${(item.prix * item.quantity).toFixed(2)} €%0A`;
    });
    
    msg += `%0A💰 *RÉSUMÉ FINANCIER*%0A`;
    msg += `Sous-total: ${subtotal.toFixed(2)} €%0A`;
    if (shipping > 0) msg += `Livraison: ${shipping.toFixed(2)} €%0A`;
    msg += `*Total: ${total.toFixed(2)} €*%0A%0A`;
    
    msg += `🚚 *LIVRAISON*%0A`;
    msg += `Mode: ${livraison === 'domicile' ? 'Livraison à domicile' : 'Retrait en magasin'}%0A%0A`;
    
    msg += `💳 *PAIEMENT*%0A`;
    msg += `Mode: ${paiement === 'especes' ? 'Espèces' : paiement === 'carte' ? 'Carte bancaire' : 'Virement bancaire'}%0A`;
    
    if (formData.commentaires) {
      msg += `%0A📝 *COMMENTAIRES*%0A${formData.commentaires}%0A`;
    }
    
    const whatsappNumber = '21695495874';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${msg}`;
    window.open(whatsappUrl, '_blank');
    
    // Vider le panier après la commande
    clearCart();
    
    // Rediriger vers la page d'accueil avec un message de succès
    navigate('/', { state: { orderSuccess: true } });
  };

  if (cart.length === 0) {
    return (
      <div className="commande-page">
        <div className="commande-empty">
          <Typography variant="h4" className="commande-empty__title">
            Aucun article dans votre panier
          </Typography>
          <Typography variant="body1" className="commande-empty__subtitle">
            Ajoutez des produits à votre panier pour passer commande
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            className="commande-empty__btn"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="commande-page">
      <div className="commande-header">
        <IconButton onClick={() => navigate('/cart')} className="commande-back-btn">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" className="commande-title">
          Finaliser ma commande
        </Typography>
      </div>

      <div className="commande-content">
        <div className="commande-form">
          {/* Informations personnelles */}
          <Card className="form-section">
            <CardContent>
              <div className="section-header">
                <PersonIcon className="section-icon" />
                <Typography variant="h6" className="section-title">
                  Informations personnelles
                </Typography>
              </div>
              
              <div className="form-grid">
                <TextField
                  name="nom"
                  label="Nom *"
                  value={formData.nom}
                  onChange={handleInputChange}
                  error={!!errors.nom}
                  helperText={errors.nom}
                  fullWidth
                  className="form-field"
                />
                <TextField
                  name="prenom"
                  label="Prénom *"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  error={!!errors.prenom}
                  helperText={errors.prenom}
                  fullWidth
                  className="form-field"
                />
                <TextField
                  name="telephone"
                  label="Téléphone *"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  error={!!errors.telephone}
                  helperText={errors.telephone}
                  fullWidth
                  className="form-field"
                />
                <TextField
                  name="email"
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  className="form-field"
                />
              </div>
            </CardContent>
          </Card>

          {/* Livraison */}
          <Card className="form-section">
            <CardContent>
              <div className="section-header">
                <LocalShippingIcon className="section-icon" />
                <Typography variant="h6" className="section-title">
                  Mode de livraison
                </Typography>
              </div>
              
              <FormControl fullWidth className="form-field">
                <InputLabel>Mode de livraison</InputLabel>
                <Select
                  value={livraison}
                  onChange={(e) => setLivraison(e.target.value)}
                  label="Mode de livraison"
                >
                  <MenuItem value="domicile">Livraison à domicile ({shipping > 0 ? `${shipping.toFixed(2)} €` : 'Gratuite'})</MenuItem>
                  <MenuItem value="magasin">Retrait en magasin (Gratuit)</MenuItem>
                </Select>
              </FormControl>

              {livraison === 'domicile' && (
                <div className="form-grid">
                  <TextField
                    name="adresse"
                    label="Adresse *"
                    value={formData.adresse}
                    onChange={handleInputChange}
                    error={!!errors.adresse}
                    helperText={errors.adresse}
                    fullWidth
                    className="form-field"
                    multiline
                    rows={2}
                  />
                  <TextField
                    name="ville"
                    label="Ville *"
                    value={formData.ville}
                    onChange={handleInputChange}
                    error={!!errors.ville}
                    helperText={errors.ville}
                    fullWidth
                    className="form-field"
                  />
                  <TextField
                    name="codePostal"
                    label="Code postal *"
                    value={formData.codePostal}
                    onChange={handleInputChange}
                    error={!!errors.codePostal}
                    helperText={errors.codePostal}
                    fullWidth
                    className="form-field"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Paiement */}
          <Card className="form-section">
            <CardContent>
              <div className="section-header">
                <Typography variant="h6" className="section-title">
                  💳 Mode de paiement
                </Typography>
              </div>
              
              <FormControl fullWidth className="form-field">
                <InputLabel>Mode de paiement</InputLabel>
                <Select
                  value={paiement}
                  onChange={(e) => setPaiement(e.target.value)}
                  label="Mode de paiement"
                >
                  <MenuItem value="especes">Espèces à la livraison</MenuItem>
                  <MenuItem value="carte">Carte bancaire à la livraison</MenuItem>
                  <MenuItem value="virement">Virement bancaire</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {/* Commentaires */}
          <Card className="form-section">
            <CardContent>
              <Typography variant="h6" className="section-title">
                📝 Commentaires (optionnel)
              </Typography>
              <TextField
                name="commentaires"
                label="Commentaires ou instructions spéciales"
                value={formData.commentaires}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
                className="form-field"
              />
            </CardContent>
          </Card>
        </div>

        {/* Résumé de commande */}
        <div className="commande-summary">
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h6" className="summary-title">
                📋 Résumé de la commande
              </Typography>

              <div className="summary-items">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="summary-item">
                    <img 
                      src={item.image} 
                      alt={item.nom} 
                      className="summary-item__image" 
                    />
                    <div className="summary-item__details">
                      <Typography variant="body2" className="summary-item__name">
                        {item.nom}
                      </Typography>
                      {item.selectedSize && (
                        <Chip 
                          label={`Taille: ${item.selectedSize}`}
                          size="small"
                          className="summary-item__size"
                        />
                      )}
                      <Typography variant="body2" className="summary-item__quantity">
                        Quantité: {item.quantity}
                      </Typography>
                    </div>
                    <Typography variant="body1" className="summary-item__price">
                      {(item.prix * item.quantity).toFixed(2)} €
                    </Typography>
                  </div>
                ))}
              </div>

              <Divider className="summary-divider" />

              <div className="summary-details">
                <div className="summary-row">
                  <Typography>Sous-total</Typography>
                  <Typography>{subtotal.toFixed(2)} €</Typography>
                </div>
                
                <div className="summary-row">
                  <Typography>Livraison</Typography>
                  <Typography>
                    {livraison === 'magasin' ? 'Gratuit' : shipping === 0 ? 'Gratuit' : `${shipping.toFixed(2)} €`}
                  </Typography>
                </div>

                <Divider className="summary-divider" />

                <div className="summary-row total">
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">
                    {livraison === 'magasin' ? subtotal.toFixed(2) : total.toFixed(2)} €
                  </Typography>
                </div>
              </div>

              <Button 
                variant="contained" 
                onClick={handleSubmitOrder}
                className="order-btn"
                fullWidth
                startIcon={<WhatsAppIcon />}
              >
                Confirmer la commande
              </Button>
              
              <Typography variant="caption" className="order-note">
                Votre commande sera envoyée via WhatsApp pour confirmation
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
