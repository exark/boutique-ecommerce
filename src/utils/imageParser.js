/**
 * Utilitaire pour parser les images depuis Google Sheets
 * Supporte plusieurs formats d'entrée dans la colonne Images
 */

/**
 * Parse une chaîne d'images depuis Google Sheets
 * Formats supportés :
 * - URL unique: "https://i.imgur.com/XKg6kvm.jpg"
 * - ID unique: "XKg6kvm"
 * - Plusieurs URLs: "https://i.imgur.com/XKg6kvm.jpg, https://i.imgur.com/9bar64w.jpg"
 * - Plusieurs IDs: "XKg6kvm, 9bar64w, k6PYyLn"
 * - URLs avec retours à la ligne: "https://i.imgur.com/XKg6kvm.jpg\nhttps://i.imgur.com/9bar64w.jpg"
 */
export function parseImagesFromSheet(imageString) {
  if (!imageString || typeof imageString !== 'string') {
    return [];
  }

  return imageString
    .split(/\s+/)
    .map(part => part.trim())
    .filter(part => part.length > 0 && part.startsWith('http'));
}

/**
 * Convertit les données brutes de Google Sheets en format produit
 * avec support multi-images
 */
export function processProductFromSheet(sheetRow) {
  const images = parseImagesFromSheet(sheetRow.images || sheetRow.image);
  
  return {
    ...sheetRow,
    images: images,
    image: images[0] || 'placeholder', // Image principale = première image
    hasMultipleImages: images.length > 1
  };
}

/**
 * Génère l'URL complète Imgur à partir d'un ID ou URL
 */
export function getImgurUrl(imageId, size = '') {
  if (!imageId) return '';
  
  // Si c'est déjà une URL complète, la retourner
  if (imageId.startsWith('http')) {
    return imageId;
  }
  
  // Si c'est un ID Imgur, générer l'URL
  if (/^[a-zA-Z0-9]{7}$/.test(imageId)) {
    return `https://i.imgur.com/${imageId}${size}.jpg`;
  }
  
  // Fallback pour les images locales
  return imageId.startsWith('/') ? imageId : `/images/${imageId}`;
}

/**
 * Exemple d'utilisation avec Google Sheets API
 */
export function convertSheetDataToProducts(sheetData) {
  return sheetData.map(row => processProductFromSheet(row));
}

export default {
  parseImagesFromSheet,
  processProductFromSheet,
  getImgurUrl,
  convertSheetDataToProducts
};
