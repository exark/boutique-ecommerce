# Système de Conversion Google Sheet → JSON

Ce système permet de convertir automatiquement votre inventaire Google Sheet en JSON compatible avec votre site e-commerce.

## 🚀 Utilisation Rapide

### Mise à jour automatique avec votre Google Sheet
```bash
npm run update-products
```

### Mise à jour avec un Google Sheet personnalisé
```bash
npm run update-products:custom [SHEET_ID] [OUTPUT_FILE]
```

## 📋 Format Requis pour le Google Sheet

Votre Google Sheet doit contenir les colonnes suivantes :

| Colonne | Obligatoire | Description | Exemple |
|---------|-------------|-------------|---------|
| `id` | ✅ | Identifiant unique du produit | `1` |
| `nom` | ✅ | Nom du produit | `"Blouse légère"` |
| `categorie` | ✅ | Catégorie du produit | `"Blouses"` |
| `prix` | ✅ | Prix en euros | `29.99` |
| `taille` | ✅ | Taille du produit | `"M"` |
| `stock` | ✅ | Quantité en stock | `5` |
| `matiere` | ❌ | Matériau du produit | `"Coton"` |
| `couleur` | ❌ | Couleur du produit | `"Blanc"` |
| `disponibilite` | ❌ | Statut de disponibilité | `"En stock"` |
| `nouveaute` | ❌ | Si c'est un nouveau produit | `true` ou `false` |

## 📊 Exemple de Structure Google Sheet

| id | nom | categorie | prix | taille | stock | matiere | couleur | disponibilite | nouveaute |
|----|-----|-----------|------|--------|-------|---------|---------|---------------|-----------|
| 1 | Blouse légère | Blouses | 29.99 | S | 5 | Viscose | Blanc | En stock | false |
| 1 | Blouse légère | Blouses | 29.99 | M | 3 | Viscose | Blanc | En stock | false |
| 2 | Jean taille haute | Pantalons | 59.99 | M | 7 | Denim | Bleu | En stock | true |

## 🔧 Fonctionnalités

### ✅ Automatique
- **Téléchargement direct** depuis Google Sheets
- **Conversion intelligente** vers le format JSON de votre site
- **Préservation** des images et descriptions existantes
- **Mapping automatique** des catégories vers les images

### 🎨 Images et Descriptions
Le système utilise automatiquement :
- **Images par défaut** selon la catégorie
- **Descriptions par défaut** selon la catégorie
- **Structure identique** à votre site actuel

### 📁 Fichiers Générés
- `src/data/produits.js` - Fichier principal des produits
- Format compatible avec votre React app

## 🛠️ Configuration Avancée

### Changer l'ID du Google Sheet
```bash
node scripts/convertSheetToJson.js [VOTRE_SHEET_ID]
```

### Changer le fichier de sortie
```bash
node scripts/convertSheetToJson.js [SHEET_ID] [FICHIER_SORTIE]
```

### Exemple complet
```bash
node scripts/convertSheetToJson.js 1u1bwB9FOHAXW3xMyAyfYlF4jcHS7LvMIRFQLp1rJHto src/data/produits.js
```

## 🔄 Workflow Recommandé

1. **Modifiez** votre Google Sheet avec les nouveaux produits
2. **Exécutez** `npm run update-products`
3. **Vérifiez** que le fichier `src/data/produits.js` est mis à jour
4. **Testez** votre site avec `npm run dev`

## ⚠️ Notes Importantes

- Assurez-vous que votre Google Sheet est **public** ou **partagé en lecture**
- Les colonnes peuvent être en **majuscules** ou **minuscules**
- Les valeurs `nouveaute` acceptent : `true`, `false`, `oui`, `non`, `1`, `0`
- Les produits sans stock > 0 ne seront pas inclus

## 🆘 Dépannage

### Erreur de téléchargement
- Vérifiez que le Google Sheet est accessible publiquement
- Vérifiez l'ID du Google Sheet dans l'URL

### Erreur de conversion
- Vérifiez que les colonnes obligatoires sont présentes
- Vérifiez le format des données (prix en nombres, etc.)

### Produits manquants
- Vérifiez que les IDs sont uniques
- Vérifiez que le stock > 0 pour les tailles 