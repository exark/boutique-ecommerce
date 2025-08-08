import { useState, useEffect, useCallback } from 'react';

// Cache en mémoire pour éviter les requêtes répétées
const imageCache = new Map();
const loadingPromises = new Map();

// Fonction pour ajouter un timestamp de cache busting aux URLs Imgur
const addCacheBuster = (url, forceRefresh = false) => {
  if (!url.includes('imgur.com')) return url;
  
  const urlObj = new URL(url);
  
  if (forceRefresh) {
    // Force refresh avec timestamp actuel
    urlObj.searchParams.set('v', Date.now().toString());
  } else {
    // Cache journalier pour les images Imgur
    const dayStamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    urlObj.searchParams.set('v', dayStamp.toString());
  }
  
  return urlObj.href;
};

// Fonction pour précharger une image
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
};

// Hook principal pour la gestion du cache des images
export const useImageCache = (src, options = {}) => {
  const {
    priority = false,
    forceRefresh = false,
    fallbackSrc = null,
    retryAttempts = 3
  } = options;

  const [imageState, setImageState] = useState({
    src: null,
    isLoading: true,
    isLoaded: false,
    hasError: false,
    attempts: 0
  });

  const processedSrc = addCacheBuster(src, forceRefresh);

  const loadImage = useCallback(async (imageSrc, attempt = 0) => {
    // Vérifier le cache en mémoire
    if (imageCache.has(imageSrc)) {
      setImageState({
        src: imageSrc,
        isLoading: false,
        isLoaded: true,
        hasError: false,
        attempts: attempt
      });
      return;
    }

    // Vérifier si l'image est déjà en cours de chargement
    if (loadingPromises.has(imageSrc)) {
      try {
        await loadingPromises.get(imageSrc);
        setImageState({
          src: imageSrc,
          isLoading: false,
          isLoaded: true,
          hasError: false,
          attempts: attempt
        });
      } catch (error) {
        handleLoadError(imageSrc, attempt);
      }
      return;
    }

    setImageState(prev => ({ ...prev, isLoading: true, attempts: attempt }));

    // Créer la promesse de chargement
    const loadPromise = preloadImage(imageSrc);
    loadingPromises.set(imageSrc, loadPromise);

    try {
      await loadPromise;
      
      // Ajouter au cache
      imageCache.set(imageSrc, true);
      
      setImageState({
        src: imageSrc,
        isLoading: false,
        isLoaded: true,
        hasError: false,
        attempts: attempt
      });
    } catch (error) {
      handleLoadError(imageSrc, attempt);
    } finally {
      loadingPromises.delete(imageSrc);
    }
  }, []);

  const handleLoadError = useCallback((imageSrc, attempt) => {
    console.warn(`Failed to load image: ${imageSrc} (attempt ${attempt + 1})`);

    // Essayer les fallbacks pour les images Imgur
    if (imageSrc.includes('imgur.com') && attempt < retryAttempts) {
      let fallbackUrl = imageSrc;
      
      // Essayer différentes tailles
      if (imageSrc.includes('l.jpg')) {
        fallbackUrl = imageSrc.replace('l.jpg', 'm.jpg');
      } else if (imageSrc.includes('m.jpg')) {
        fallbackUrl = imageSrc.replace('m.jpg', 's.jpg');
      } else if (imageSrc.includes('s.jpg')) {
        fallbackUrl = imageSrc.replace('s.jpg', '.jpg');
      } else if (fallbackSrc) {
        fallbackUrl = fallbackSrc;
      }

      if (fallbackUrl !== imageSrc) {
        setTimeout(() => loadImage(fallbackUrl, attempt + 1), 1000);
        return;
      }
    }

    // Si on a un fallback et qu'on n'a pas encore essayé
    if (fallbackSrc && attempt < retryAttempts) {
      setTimeout(() => loadImage(fallbackSrc, attempt + 1), 1000);
      return;
    }

    setImageState({
      src: null,
      isLoading: false,
      isLoaded: false,
      hasError: true,
      attempts: attempt
    });
  }, [fallbackSrc, retryAttempts, loadImage]);

  // Charger l'image au montage ou quand src change
  useEffect(() => {
    if (!processedSrc) return;

    loadImage(processedSrc);
  }, [processedSrc, loadImage]);

  // Fonction pour forcer le rechargement
  const refresh = useCallback(() => {
    const refreshedSrc = addCacheBuster(src, true);
    imageCache.delete(processedSrc);
    imageCache.delete(refreshedSrc);
    loadImage(refreshedSrc);
  }, [src, processedSrc, loadImage]);

  return {
    ...imageState,
    refresh,
    processedSrc
  };
};

// Hook pour précharger plusieurs images
export const useImagePreloader = (urls = [], options = {}) => {
  const [preloadState, setPreloadState] = useState({
    loaded: 0,
    total: urls.length,
    isComplete: false,
    errors: []
  });

  useEffect(() => {
    if (urls.length === 0) {
      setPreloadState({ loaded: 0, total: 0, isComplete: true, errors: [] });
      return;
    }

    let loadedCount = 0;
    const errors = [];

    const preloadPromises = urls.map((url, index) => {
      const processedUrl = addCacheBuster(url, options.forceRefresh);
      
      return preloadImage(processedUrl)
        .then(() => {
          imageCache.set(processedUrl, true);
          loadedCount++;
          setPreloadState(prev => ({
            ...prev,
            loaded: loadedCount,
            isComplete: loadedCount === urls.length
          }));
        })
        .catch((error) => {
          errors.push({ url, error: error.message, index });
          loadedCount++;
          setPreloadState(prev => ({
            ...prev,
            loaded: loadedCount,
            errors: [...errors],
            isComplete: loadedCount === urls.length
          }));
        });
    });

    Promise.allSettled(preloadPromises).then(() => {
      setPreloadState(prev => ({ ...prev, isComplete: true }));
    });

  }, [urls, options.forceRefresh]);

  return preloadState;
};

// Fonction utilitaire pour nettoyer le cache
export const clearImageCache = () => {
  imageCache.clear();
  loadingPromises.clear();
};

// Fonction utilitaire pour obtenir les statistiques du cache
export const getCacheStats = () => {
  return {
    cacheSize: imageCache.size,
    loadingCount: loadingPromises.size,
    cachedUrls: Array.from(imageCache.keys())
  };
};
