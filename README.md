# Boutique e commerce

Ce dépôt contient un prototype de boutique en ligne développé avec React et Vite.

## État actuel

- Utilisation de [Vite](https://vitejs.dev/) et React pour un chargement rapide et une expérience de développement moderne.
- Page d’accueil avec section « hero » attrayante invitant l’utilisateur à explorer la boutique.
- Liste de produits statiques : les produits sont présentés sous forme de cartes, sans connexion à une base de données.
- Tiroir de panier latéral : l’utilisateur peut ouvrir et fermer le panier ; cependant, l’ajout et la modification d’articles ne sont pas encore implémentés.
- Interface responsive construite avec Tailwind CSS, comprenant un menu, un pied de page et un design cohérent sur desktop et mobile.

## Points d’amélioration et objectifs à venir

- **Pages dynamiques :** Créer des pages pour chaque produit et catégorie avec des informations détaillées (prix, description, images, avis).
- **Fonctionnalité de panier complète :** Permettre d’ajouter, de modifier et de supprimer des articles, calculer le total et persister l’état.
- **Authentification et comptes clients :** Mettre en place l’inscription, la connexion et la gestion du compte (historique des commandes, adresse).
- **Connexion à un back‑end/API :** Intégrer une API pour récupérer les produits et enregistrer les commandes ; structurer l’application côté serveur.
- **Paiement et sécurité :** Ajouter une passerelle de paiement sécurisée et s’assurer du chiffrement des données sensibles.
- **Performance et accessibilité :** Optimiser le chargement (lazy‑loading, images), améliorer l’accessibilité (balises alt, navigation clavier).
- **SEO :** Ajouter des balises meta, titres de page et descriptions pour améliorer le référencement.
- **Tests et CI/CD :** Écrire des tests unitaires et E2E, et configurer un pipeline de déploiement continu.
- **Suivi analytique :** Intégrer des outils d’analyse pour suivre le trafic et les conversions.

## À vérifier / à valider

- Test du panier : vérifier l’ajout, la modification et la suppression d’articles ainsi que l’intégration avec l’API.
- Vérifier la navigation et les liens internes sur toutes les pages.
- Tester la compatibilité mobile et la réactivité sur différents navigateurs.
- Valider le processus d’inscription et de connexion des utilisateurs.
- Contrôler la performance et l’optimisation SEO après chaque mise à jour.
- S’assurer que la passerelle de paiement est sécurisée et fonctionnelle.
