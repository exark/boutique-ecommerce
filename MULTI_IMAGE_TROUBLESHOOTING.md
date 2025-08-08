# 🔧 Guide de Dépannage : Images Multiples Google Sheets

## Problème Identifié
Le workflow de mise à jour des produits ne récupère qu'une seule image par produit, même si plusieurs liens sont présents dans le Google Sheet.

## Causes Possibles

### 1. Nom de Colonne Incorrect
Le script recherche ces noms de colonnes (sensible à la casse) :
- `image_produit`
- `images` 
- `image_urls`
- `photos`
- `Pictures`
- `Images`

**✅ Solution :** Renommez votre colonne d'images avec un de ces noms exacts.

### 2. Format des Données Incorrect
Le script supporte ces formats dans la colonne images :

#### URLs Imgur complètes :
```
https://i.imgur.com/XKg6kvm.jpg, https://i.imgur.com/9bar64w.jpg, https://i.imgur.com/k6PYyLn.jpg
```

#### IDs Imgur (recommandé) :
```
XKg6kvm, 9bar64w, k6PYyLn
```

#### Avec retours à la ligne :
```
XKg6kvm
9bar64w
k6PYyLn
```

#### Avec points-virgules :
```
XKg6kvm; 9bar64w; k6PYyLn
```

### 3. Colonne Vide ou Manquante
Si la colonne n'existe pas ou est vide, le script utilise le mapping par catégorie (une seule image).

## Comment Vérifier et Corriger

### Étape 1 : Vérifier le Google Sheet
1. Ouvrez votre Google Sheet
2. Vérifiez qu'il y a une colonne nommée exactement `images` ou `Pictures`
3. Vérifiez que cette colonne contient des données au bon format

### Étape 2 : Tester Localement
```bash
# Tester le script de conversion
npm run update-products

# Vérifier les logs dans la console
# Vous devriez voir : "Colonne d'images détectée: images"
# Et non : "Aucune - utilisation du mapping par catégorie"
```

### Étape 3 : Exemple de Structure Google Sheet

| id | nom | categorie | prix | images | stock_S | stock_M | stock_L |
|----|-----|-----------|------|--------|---------|---------|---------|
| 1 | Blouse Rose | Blouses | 29.99 | XKg6kvm, 9bar64w, k6PYyLn | 5 | 3 | 2 |
| 2 | Jean Bleu | Pantalons | 49.99 | abc123, def456 | 4 | 6 | 1 |

## Script de Debug

Créez ce fichier pour tester le parsing des images :
