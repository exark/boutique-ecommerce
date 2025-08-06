# 🎬 Installation de FFmpeg pour l'Optimisation des Médias

## 🚀 Installation Rapide sur Windows

### Option 1 : Installation avec Chocolatey (Recommandée)
```powershell
# 1. Installer Chocolatey (si pas déjà fait)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 2. Installer FFmpeg
choco install ffmpeg

# 3. Vérifier l'installation
ffmpeg -version
```

### Option 2 : Installation Manuelle
1. **Télécharger FFmpeg :**
   - Aller sur https://ffmpeg.org/download.html#build-windows
   - Télécharger "Windows builds by BtbN"
   - Choisir la version "ffmpeg-master-latest-win64-gpl.zip"

2. **Extraire et configurer :**
   ```powershell
   # Extraire dans C:\ffmpeg
   # Ajouter C:\ffmpeg\bin au PATH système
   
   # Ou temporairement pour cette session :
   $env:PATH += ";C:\ffmpeg\bin"
   ```

3. **Vérifier l'installation :**
   ```powershell
   ffmpeg -version
   ```

### Option 3 : Installation avec Winget
```powershell
winget install Gyan.FFmpeg
```

---

## ⚡ Exécution de l'Optimisation

Une fois FFmpeg installé :

```bash
# Naviguer vers le projet
cd c:\Users\exark\boutique-ecommerce

# Exécuter l'optimisation
npm run optimize-media
```

---

## 📊 Résultats Attendus

### Vidéo Hero
- **Avant :** 4782414-uhd_3840_2160_30fps.mp4 (87MB)
- **Après :** 
  - hero-video-720p.webm (~3MB)
  - hero-video-720p.mp4 (~5MB)
  - hero-poster.jpg (~200KB)

### Images Produits (20 images)
- **Avant :** ~44MB total (JPG uniquement)
- **Après :** ~180 fichiers générés
  - WebP : ~8MB total (-80%)
  - AVIF : ~6MB total (-85%)
  - JPEG optimisé : ~12MB total (-70%)

### Gain Total
- **Réduction de taille :** 131MB → 15-20MB (-85%)
- **Temps de chargement :** 5+ minutes → 15-30s
- **Score Lighthouse :** +40-50 points

---

## 🔧 Dépannage

### Erreur "ffmpeg not recognized"
```powershell
# Redémarrer PowerShell après installation
# Ou ajouter manuellement au PATH :
$env:PATH += ";C:\ffmpeg\bin"
```

### Erreur de permissions
```powershell
# Exécuter PowerShell en tant qu'administrateur
Set-ExecutionPolicy RemoteSigned
```

### Vérifier l'installation
```powershell
where ffmpeg
ffmpeg -version
ffprobe -version
```

---

## 🎯 Prochaines Étapes

1. **Installer FFmpeg** (5 minutes)
2. **Exécuter l'optimisation** (10-15 minutes)
3. **Tester les performances** avec Lighthouse
4. **Déployer les optimisations** en production

**Impact attendu :** Amélioration massive des performances (85% de réduction de taille)
