# Configuration Multi-Images pour Google Sheets

## 🎯 Objectif
Ce guide explique comment configurer votre Google Sheet pour supporter plusieurs images par produit avec effet hover et galerie.

## 📋 Configuration Google Sheets

### 1. Ajouter une colonne d'images
Ajoutez une nouvelle colonne dans votre Google Sheet avec l'un de ces noms :
- `images`
- `image_urls` 
- `photos`
- `Pictures`
- `Images`

### 2. Format des données images
Dans cette colonne, vous pouvez saisir :

#### **URLs Imgur complètes :**
```
https://i.imgur.com/XKg6kvm.jpg, https://i.imgur.com/9bar64w.jpg, https://i.imgur.com/k6PYyLn.jpg
```

#### **IDs Imgur (recommandé) :**
```
XKg6kvm, 9bar64w, k6PYyLn
```

#### **Mélange URLs et IDs :**
```
XKg6kvm
https://i.imgur.com/9bar64w.jpg
k6PYyLn
```

### 3. Séparateurs supportés
- **Virgules :** `XKg6kvm, 9bar64w, k6PYyLn`
- **Point-virgules :** `XKg6kvm; 9bar64w; k6PYyLn`
- **Retours à la ligne :** 
  ```
  XKg6kvm
  9bar64w
  k6PYyLn
  ```

## 🔧 Utilisation du script de conversion

### 1. Exécuter la conversion
```bash
cd scripts
node convertSheetToJson.js [SHEET_ID] [OUTPUT_FILE]
```

### 2. Exemple avec votre Sheet ID
```bash
node convertSheetToJson.js 1u1bwB9FOHAXW3xMyAyfYlF4jcHS7LvMIRFQLp1rJHto
```

### 3. Le script va automatiquement :
- ✅ Détecter la colonne d'images
- ✅ Parser les URLs/IDs multiples
- ✅ Générer les URLs responsives Imgur
- ✅ Créer le fichier `produits.js` avec support multi-images
- ✅ Fallback sur les images par catégorie si aucune image fournie

## 📊 Structure de données générée

Chaque produit aura maintenant :
```javascript
{
  id: 1,
  nom: "Blouse Élégante",
  categorie: "Blouses",
  prix: 45,
  image: "XKg6kvm",           // Image principale (première de la liste)
  images: [                   // Toutes les images pour la galerie
    "XKg6kvm",
    "9bar64w", 
    "k6PYyLn"
  ],
  // ... autres propriétés
}
```

## 🎨 Fonctionnalités UI

### 1. Effet Hover sur les cartes produits
- **Survol :** Affiche la 2ème image
- **Sortie :** Retour à l'image principale

### 2. Galerie sur la page produit
- **Navigation :** Clic pour changer d'image
- **Indicateurs :** Points de navigation
- **Compteur :** "2/5" pour indiquer la position

### 3. Badge multi-images
- **Icône :** Symbole "photos multiples"
- **Compteur :** Nombre total d'images

## 🔄 Migration depuis l'ancien système

### Produits sans colonne images
- ✅ **Automatique :** Utilise l'image par catégorie existante
- ✅ **Compatibilité :** Aucune modification requise
- ✅ **Fallback :** `images: [image_principale]`

### Produits avec colonne images
- ✅ **Multi-images :** Support complet des galeries
- ✅ **Responsive :** URLs Imgur optimisées
- ✅ **Performance :** Lazy loading et fallbacks

## 📝 Exemple de Google Sheet

| id | nom | categorie | prix | images | stock_S | stock_M | stock_L |
|----|-----|-----------|------|--------|---------|---------|---------|
| 1 | Blouse Rouge | Blouses | 45 | XKg6kvm, 9bar64w, k6PYyLn | 5 | 3 | 2 |
| 2 | Pantalon Noir | Pantalons | 65 | https://i.imgur.com/abc123.jpg | 0 | 4 | 1 |
| 3 | Robe Été | Robes | 85 | def456<br>ghi789<br>jkl012 | 2 | 2 | 0 |

## 🚀 Avantages

### Performance
- **CDN Imgur :** Livraison rapide mondiale
- **Images responsives :** Tailles automatiques (s/m/l)
- **Lazy loading :** Chargement à la demande

### UX
- **Hover preview :** Aperçu rapide des variantes
- **Galerie complète :** Navigation fluide
- **Fallbacks :** Toujours une image affichée

### Maintenance
- **Google Sheets :** Gestion centralisée
- **Automatisation :** Script de conversion
- **Flexibilité :** Formats multiples supportés

## 🔧 Dépannage

### Aucune image détectée
- Vérifiez le nom de la colonne (`images`, `image_urls`, etc.)
- Assurez-vous que la colonne contient des données

### Images ne s'affichent pas
- Vérifiez que les URLs Imgur sont publiques
- Testez les IDs dans le navigateur : `https://i.imgur.com/ID.jpg`

### Script d'erreur
- Vérifiez que le Google Sheet est public
- Assurez-vous que `imageParser.js` existe dans `src/utils/`

## 📞 Support
Pour toute question ou problème, vérifiez :
1. La structure de votre Google Sheet
2. Les permissions publiques
3. Les logs de la console du script
