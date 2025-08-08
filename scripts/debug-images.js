#!/usr/bin/env node

/**
 * Script de debug pour tester le parsing des images multiples
 * Usage: node scripts/debug-images.js
 */

import { parseImagesFromSheet } from '../src/utils/imageParser.js';

console.log('🔍 Test du parsing des images multiples\n');

// Tests avec différents formats
const testCases = [
  {
    name: 'IDs Imgur séparés par virgules',
    input: 'XKg6kvm, 9bar64w, k6PYyLn',
    expected: ['XKg6kvm', '9bar64w', 'k6PYyLn']
  },
  {
    name: 'URLs Imgur complètes',
    input: 'https://i.imgur.com/XKg6kvm.jpg, https://i.imgur.com/9bar64w.jpg',
    expected: ['XKg6kvm', '9bar64w']
  },
  {
    name: 'IDs avec retours à la ligne',
    input: 'XKg6kvm\n9bar64w\nk6PYyLn',
    expected: ['XKg6kvm', '9bar64w', 'k6PYyLn']
  },
  {
    name: 'IDs avec points-virgules',
    input: 'XKg6kvm; 9bar64w; k6PYyLn',
    expected: ['XKg6kvm', '9bar64w', 'k6PYyLn']
  },
  {
    name: 'Mélange URLs et IDs',
    input: 'https://i.imgur.com/XKg6kvm.jpg, 9bar64w, https://i.imgur.com/k6PYyLn.jpg',
    expected: ['XKg6kvm', '9bar64w', 'k6PYyLn']
  },
  {
    name: 'Chaîne vide',
    input: '',
    expected: []
  },
  {
    name: 'Espaces supplémentaires',
    input: '  XKg6kvm  ,   9bar64w   ,  k6PYyLn  ',
    expected: ['XKg6kvm', '9bar64w', 'k6PYyLn']
  }
];

let allTestsPassed = true;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log(`Input: "${testCase.input}"`);
  
  const result = parseImagesFromSheet(testCase.input);
  console.log(`Result: [${result.join(', ')}]`);
  console.log(`Expected: [${testCase.expected.join(', ')}]`);
  
  const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
  console.log(`Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  
  if (!passed) {
    allTestsPassed = false;
  }
  
  console.log('---\n');
});

console.log(`\n🎯 Résultat global: ${allTestsPassed ? '✅ Tous les tests passent' : '❌ Certains tests échouent'}`);

// Test avec des données réelles du Google Sheet
console.log('\n📋 Test avec vos données Google Sheet:');
console.log('Collez ici le contenu de votre colonne images pour tester:');
console.log('Exemple: node scripts/debug-images.js "XKg6kvm, 9bar64w, k6PYyLn"');

// Si un argument est fourni, le tester
if (process.argv[2]) {
  const userInput = process.argv[2];
  console.log(`\n🧪 Test avec votre input: "${userInput}"`);
  const result = parseImagesFromSheet(userInput);
  console.log(`Résultat: [${result.join(', ')}]`);
  console.log(`Nombre d'images détectées: ${result.length}`);
}
