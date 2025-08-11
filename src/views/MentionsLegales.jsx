import React from 'react';
import { Container, Typography, Box } from '@mui/material';

export default function MentionsLegales() {
  return (
    <div style={{ paddingTop: '24px', paddingBottom: '48px' }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Mentions légales
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Dernière mise à jour : {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              1. Éditeur du site
            </Typography>
            <Typography variant="body1">
              Solène Boutique — Site e-commerce de vêtements et accessoires.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              2. Contact
            </Typography>
            <Typography variant="body1">
              Email : <strong>solene.handmade.crochet@gmail.com</strong>
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              3. Hébergement
            </Typography>
            <Typography variant="body1">
              Ce site est hébergé par un prestataire cloud.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              4. Propriété intellectuelle
            </Typography>
            <Typography variant="body1">
              L'ensemble des contenus (textes, images, logos, etc.) est protégé par le droit d'auteur et ne peut être réutilisé sans
              autorisation préalable.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              5. Données personnelles
            </Typography>
            <Typography variant="body1">
              Le traitement des données est détaillé dans notre <strong>Politique de confidentialité</strong>.
            </Typography>
          </section>
        </Box>
      </Container>
    </div>
  );
}
