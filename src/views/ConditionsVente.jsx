import React from 'react';
import { Container, Typography, Box } from '@mui/material';

export default function ConditionsVente() {
  return (
    <div style={{ paddingTop: '24px', paddingBottom: '48px' }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Conditions générales de vente
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Dernière mise à jour : {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              1. Objet
            </Typography>
            <Typography variant="body1">
              Les présentes conditions régissent les ventes de produits réalisées sur ce site. En passant commande, vous acceptez
              sans réserve ces conditions générales de vente (CGV).
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              2. Produits
            </Typography>
            <Typography variant="body1">
              Les caractéristiques essentielles des produits sont présentées sur les fiches produits. Les photos sont non
              contractuelles; de légères variations peuvent exister, notamment pour les articles faits main.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              3. Prix
            </Typography>
            <Typography variant="body1">
              Les prix sont indiqués en euros, toutes taxes comprises le cas échéant. Les frais de livraison sont précisés lors du
              passage de commande et avant validation.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              4. Commande et paiement
            </Typography>
            <Typography variant="body1" component="div">
              <ul>
                <li>La commande est validée après confirmation du paiement.</li>
                <li>Les moyens de paiement acceptés sont indiqués au moment du checkout.</li>
                <li>Vous recevrez un e-mail de confirmation récapitulant votre commande.</li>
              </ul>
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              5. Livraison
            </Typography>
            <Typography variant="body1">
              Les délais de livraison sont donnés à titre indicatif. Un numéro de suivi peut être communiqué lorsque disponible. En
              cas de retard, contactez-nous pour toute assistance.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              6. Droit de rétractation et retours
            </Typography>
            <Typography variant="body1">
              Vous disposez d'un délai légal pour exercer votre droit de rétractation, sauf exceptions prévues par la loi (articles
              personnalisés, hygiène, etc.). Les modalités de retour et d'échange seront communiquées sur demande.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              7. Garanties
            </Typography>
            <Typography variant="body1">
              Les produits bénéficient des garanties légales de conformité et contre les vices cachés dans les conditions prévues
              par la loi.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              8. Données personnelles
            </Typography>
            <Typography variant="body1">
              Vos données sont traitées conformément à notre Politique de confidentialité. Consultez la page dédiée pour plus
              d'informations.
            </Typography>
          </section>

          <section>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              9. Contact
            </Typography>
            <Typography variant="body1">
              Pour toute question concernant ces conditions, contactez-nous à :
              <br />
              <strong>solene.handmade.crochet@gmail.com</strong>
            </Typography>
          </section>
        </Box>
      </Container>
    </div>
  );
}
