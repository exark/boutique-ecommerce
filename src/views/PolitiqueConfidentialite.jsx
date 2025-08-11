import React from 'react';
import { Container, Typography, Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function PolitiqueConfidentialite() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: '24px', paddingBottom: '48px' }}>
      <div className="cart-header">
        <IconButton onClick={() => navigate('/')} className="cart-back-btn">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" className="cart-title">
          Politique de confidentialité
        </Typography>
      </div>
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          {/* Heading now shown in header to match Cart design */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Dernière mise à jour : {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              1. Introduction
            </Typography>
            <Typography variant="body1">
              Nous accordons une grande importance à la protection de vos données personnelles. Cette politique explique quelles
              informations nous collectons, comment nous les utilisons et quels sont vos droits.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              2. Données que nous collectons
            </Typography>
            <Typography variant="body1" component="div">
              <ul>
                <li>Informations de contact (nom, e-mail) lors d'un achat ou d'une prise de contact</li>
                <li>Informations de livraison et de facturation</li>
                <li>Données d'utilisation du site (pages visitées, préférences)</li>
              </ul>
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              3. Utilisation de vos données
            </Typography>
            <Typography variant="body1" component="div">
              <ul>
                <li>Traitement et livraison de vos commandes</li>
                <li>Service client et réponses à vos demandes</li>
                <li>Amélioration de l'expérience utilisateur et du site</li>
              </ul>
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              4. Partage de vos données
            </Typography>
            <Typography variant="body1">
              Nous ne vendons pas vos données. Elles peuvent être partagées avec des prestataires (paiement, livraison) strictement
              nécessaires à l'exécution de nos services et soumis à des obligations de confidentialité.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              5. Durée de conservation
            </Typography>
            <Typography variant="body1">
              Vos informations sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées et
              conformément aux obligations légales.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              6. Vos droits
            </Typography>
            <Typography variant="body1" component="div">
              <ul>
                <li>Droit d'accès, de rectification, d'effacement</li>
                <li>Droit d'opposition et de limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
              </ul>
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              7. Contact
            </Typography>
            <Typography variant="body1">
              Pour toute question relative à vos données personnelles, contactez-nous à :
              <br />
              <strong>solene.handmade.crochet@gmail.com</strong>
            </Typography>
          </section>
        </Box>
      </Container>
    </div>
  );
}
