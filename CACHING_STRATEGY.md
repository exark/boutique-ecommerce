# 🚀 Stratégie de Cache Complète - Solène Boutique

## Vue d'ensemble

Cette documentation décrit la stratégie de cache complète et automatisée mise en place pour optimiser les performances de l'e-commerce Solène, particulièrement pour les images et les assets statiques.

## 🎯 Objectifs

- **LCP < 2.5s** : Largest Contentful Paint optimisé
- **Cache intelligent** : Images hashées avec cache immutable
- **Formats modernes** : WebP/AVIF avec fallbacks
- **Service Worker** : Cache runtime avec Workbox
- **CI/CD intégré** : Lighthouse CI avec budgets performance

## 📁 Architecture du Cache

### 1. Cache Navigateur (Headers HTTP)

**Vercel.json Configuration :**
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

**Durées de cache :**
- **Assets hashés** : 1 an (immutable)
- **Images optimisées** : 1 an (immutable)
- **Fonts** : 1 an
- **API calls** : 5 minutes

### 2. Service Worker (Runtime Cache)

**Stratégies par type de ressource :**

| Ressource | Stratégie | Durée | Max Entries |
|-----------|-----------|-------|-------------|
| Images Imgur | CacheFirst | 30 jours | 200 |
| Images locales | CacheFirst | 1 an | 100 |
| Google Fonts | StaleWhileRevalidate | 1 an | 30 |
| API calls | NetworkFirst | 5 min | 50 |

### 3. Build-time Optimizations

**Vite Configuration :**
- **Hash des assets** : `[name].[hash][extname]`
- **Code splitting** : Vendor, UI, Motion chunks
- **Tree shaking** : Console logs supprimés en prod
- **Minification** : Terser avec compression avancée

## 🖼️ Optimisation des Images

### Formats Supportés

1. **AVIF** : Format le plus moderne (70% quality)
2. **WebP** : Fallback moderne (80% quality)
3. **JPEG/PNG** : Fallback universel (85% quality)

### Tailles Responsives

```javascript
const SIZES = [400, 800, 1200, 1600];
```

### Usage dans les composants

```jsx
<OptimizedImage
  src="/images/product.jpg"
  alt="Product"
  priority={true} // Pour les images critiques
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

## 🔧 Scripts et Commandes

### Build et Déploiement

```bash
# Build avec optimisations
npm run build:optimized

# Génération du Service Worker
npm run build:pwa

# Audit performance
npm run perf:audit
```

### Optimisation des Images

```bash
# Optimisation automatique des images
node scripts/optimize-images-modern.js

# Génération des formats modernes
npm run optimize-media
```

### Gestion du Cache

```bash
# Purger le cache Vercel (manuel)
vercel cache rm https://solene-boutique.vercel.app/assets/images/product.jpg

# Vider le cache local
npm run cache:purge
```

## 📊 Monitoring et CI/CD

### Lighthouse CI

**Budgets de performance :**
- Performance Score : ≥ 85%
- LCP : ≤ 2.5s
- FCP : ≤ 1.8s
- CLS : ≤ 0.1
- Total Bundle : ≤ 1MB

**Workflow GitHub Actions :**
```yaml
# .github/workflows/lighthouse-ci.yml
- name: Run Lighthouse CI
  run: lhci autorun
```

### Métriques Surveillées

1. **Core Web Vitals**
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)

2. **Performance Budgets**
   - Total byte weight < 1MB
   - Unused JavaScript < 20KB
   - Modern image formats enforced

## 🛠️ Configuration Technique

### Service Worker (Workbox)

```javascript
// workbox-config.js
runtimeCaching: [
  {
    urlPattern: /^https:\/\/i\.imgur\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'imgur-images-cache',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
      }
    }
  }
]
```

### Preload des Ressources Critiques

```html
<!-- index.html -->
<link rel="preload" as="image" href="/logo_mobile.png" type="image/png">
<link rel="preconnect" href="https://i.imgur.com" crossorigin>
<link rel="dns-prefetch" href="//fonts.googleapis.com">
```

## 🔄 Stratégies de Cache Busting

### Images Imgur

```javascript
// Cache journalier automatique
const dayStamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
url.searchParams.set('v', dayStamp);
```

### Assets Locaux

- **Hash automatique** par Vite
- **Immutable cache** avec headers HTTP
- **Versioning** intégré au build

## 📈 Résultats Attendus

### Avant Optimisation
- **LCP** : 8-12 secondes
- **Score Performance** : 40-50/100
- **Taille totale** : ~170MB

### Après Optimisation
- **LCP** : < 2.5 secondes
- **Score Performance** : 85-95/100
- **Taille optimisée** : < 1MB initial

## 🚨 Dépannage

### Cache Bloqué

```bash
# Purger le cache Vercel
vercel cache rm <url>

# Forcer le refresh des images
useImageCache(src, { forceRefresh: true })
```

### Images Non Chargées

1. Vérifier les fallbacks Imgur
2. Contrôler les headers CORS
3. Valider les formats supportés

### Performance Dégradée

1. Auditer avec Lighthouse CI
2. Vérifier les budgets dépassés
3. Analyser les chunks JavaScript

## 📚 Ressources

- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Vite Image Optimization](https://github.com/JonasKruckenberg/imagetools)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Vercel Cache Control](https://vercel.com/docs/concepts/edge-network/caching)

---

**Dernière mise à jour** : Janvier 2025  
**Mainteneur** : Équipe Développement Solène
