#!/usr/bin/env node

/**
 * Test rapide pour vérifier que les images multiples fonctionnent
 */

import { parseImagesFromSheet } from '../src/utils/imageParser.js';

console.log('🧪 Test des images multiples avec vos données réelles\n');

// Test avec le format exact de votre Google Sheet
const testData = "https://imgur.com/sA8yYui https://imgur.com/3LYnlYV https://imgur.com/bbqurwk";

console.log('📝 Données d\'entrée:');
console.log(`"${testData}"`);

console.log('\n🔍 Parsing...');
const result = parseImagesFromSheet(testData);

console.log('\n✅ Résultat:');
console.log(`Nombre d'images détectées: ${result.length}`);
console.log(`IDs Imgur extraits: [${result.join(', ')}]`);

console.log('\n🌐 URLs générées:');
result.forEach((id, index) => {
  console.log(`${index + 1}. https://i.imgur.com/${id}.jpg`);
});

console.log('\n📊 Structure produit générée:');
const productStructure = {
  image: result[0], // Image principale
  images: result    // Toutes les images
};
console.log(JSON.stringify(productStructure, null, 2));

if (result.length > 1) {
  console.log('\n🎉 SUCCESS: Les images multiples sont maintenant détectées !');
  console.log('✅ Vous pouvez maintenant lancer: npm run update-products');
} else {
  console.log('\n❌ PROBLÈME: Une seule image détectée');
  console.log('Vérifiez le format de vos données dans Google Sheets');
}
