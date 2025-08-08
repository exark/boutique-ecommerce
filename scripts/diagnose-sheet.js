#!/usr/bin/env node

/**
 * Script de diagnostic pour analyser le Google Sheet et identifier les problèmes d'images multiples
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DEFAULT_SHEET_ID = '1u1bwB9FOHAXW3xMyAyfYlF4jcHS7LvMIRFQLp1rJHto';
const IMAGE_COLUMNS = ['image_produit', 'images', 'image_urls', 'photos', 'Pictures', 'Images'];

function downloadGoogleSheet(sheetId) {
  return new Promise((resolve, reject) => {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    console.log(`📥 Téléchargement depuis: ${url}`);
    
    const makeRequest = (url, redirectCount = 0) => {
      if (redirectCount > 5) {
        reject(new Error('Trop de redirections'));
        return;
      }
      
      https.get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
          const location = res.headers.location;
          makeRequest(location, redirectCount + 1);
          return;
        }
        
        if (res.statusCode !== 200) {
          reject(new Error(`Échec du téléchargement: ${res.statusCode}`));
          return;
        }
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve(data);
        });
      }).on('error', reject);
    };
    
    makeRequest(url);
  });
}

function parseCsv(content) {
  const lines = content.trim().split('\n');
  const header = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.replace(/"/g, '').trim());
    const row = {};
    header.forEach((h, i) => {
      row[h] = values[i] || '';
    });
    return row;
  });
  
  return { header, rows };
}

async function diagnoseSheet() {
  const args = process.argv.slice(2);
  const sheetId = args[0] || DEFAULT_SHEET_ID;
  
  console.log('🔍 DIAGNOSTIC DU GOOGLE SHEET POUR IMAGES MULTIPLES');
  console.log('=' .repeat(60));
  console.log(`Sheet ID: ${sheetId}\n`);
  
  try {
    // Télécharger le sheet
    const csvContent = await downloadGoogleSheet(sheetId);
    const { header, rows } = parseCsv(csvContent);
    
    console.log('📋 ANALYSE DES COLONNES');
    console.log('-'.repeat(30));
    console.log(`Colonnes trouvées (${header.length}): ${header.join(', ')}\n`);
    
    // Vérifier les colonnes d'images
    console.log('🖼️  COLONNES D\'IMAGES');
    console.log('-'.repeat(30));
    const foundImageColumns = header.filter(h => 
      IMAGE_COLUMNS.some(ic => ic.toLowerCase() === h.toLowerCase())
    );
    
    if (foundImageColumns.length === 0) {
      console.log('❌ PROBLÈME IDENTIFIÉ: Aucune colonne d\'images trouvée !');
      console.log('\nColonnes recherchées:', IMAGE_COLUMNS.join(', '));
      console.log('\nSOLUTION: Renommez une de vos colonnes avec un de ces noms:');
      IMAGE_COLUMNS.forEach(col => console.log(`  - ${col}`));
      console.log('\n💡 Recommandation: Utilisez "images" (simple et clair)');
    } else {
      console.log(`✅ Colonne(s) d'images trouvée(s): ${foundImageColumns.join(', ')}`);
      
      // Analyser le contenu des colonnes d'images
      const imageColumn = foundImageColumns[0];
      console.log(`\n📊 ANALYSE DU CONTENU DE LA COLONNE "${imageColumn}"`);
      console.log('-'.repeat(50));
      
      let emptyCount = 0;
      let singleImageCount = 0;
      let multiImageCount = 0;
      const samples = [];
      
      rows.forEach((row, index) => {
        const imageData = row[imageColumn];
        if (!imageData || imageData.trim() === '') {
          emptyCount++;
        } else {
          // Compter les images (approximatif)
          const imageCount = imageData.split(/[,;\n]/).filter(img => img.trim().length > 0).length;
          if (imageCount === 1) {
            singleImageCount++;
          } else {
            multiImageCount++;
          }
          
          // Garder quelques échantillons
          if (samples.length < 5) {
            samples.push({
              row: index + 1,
              content: imageData,
              count: imageCount
            });
          }
        }
      });
      
      console.log(`Total des lignes: ${rows.length}`);
      console.log(`Lignes vides: ${emptyCount}`);
      console.log(`Lignes avec 1 image: ${singleImageCount}`);
      console.log(`Lignes avec plusieurs images: ${multiImageCount}`);
      
      if (multiImageCount === 0) {
        console.log('\n⚠️  PROBLÈME POTENTIEL: Aucune ligne avec plusieurs images détectée');
        console.log('Vérifiez que vos données sont au bon format (séparées par virgules)');
      }
      
      console.log('\n📝 ÉCHANTILLONS DE DONNÉES:');
      samples.forEach(sample => {
        console.log(`Ligne ${sample.row}: "${sample.content}" (${sample.count} image(s))`);
      });
    }
    
    // Vérifier les autres colonnes importantes
    console.log('\n🔧 AUTRES COLONNES IMPORTANTES');
    console.log('-'.repeat(30));
    const requiredColumns = ['id', 'nom', 'categorie', 'prix'];
    const stockColumns = header.filter(h => h.toLowerCase().startsWith('stock_'));
    
    requiredColumns.forEach(col => {
      const found = header.find(h => h.toLowerCase() === col.toLowerCase());
      console.log(`${found ? '✅' : '❌'} ${col}: ${found || 'MANQUANT'}`);
    });
    
    console.log(`\n📦 Colonnes de stock trouvées (${stockColumns.length}): ${stockColumns.join(', ')}`);
    
    // Résumé et recommandations
    console.log('\n🎯 RÉSUMÉ ET RECOMMANDATIONS');
    console.log('='.repeat(40));
    
    if (foundImageColumns.length === 0) {
      console.log('🚨 ACTION REQUISE: Ajoutez une colonne "images" à votre Google Sheet');
      console.log('📝 Format recommandé: XKg6kvm, 9bar64w, k6PYyLn');
    } else if (multiImageCount === 0) {
      console.log('🚨 ACTION REQUISE: Ajoutez plusieurs images par produit');
      console.log('📝 Séparez les IDs/URLs par des virgules dans la colonne images');
    } else {
      console.log('✅ Configuration correcte détectée !');
      console.log('🔄 Lancez le workflow de mise à jour pour voir les changements');
    }
    
    console.log('\n🛠️  COMMANDES UTILES:');
    console.log('npm run update-products  # Mettre à jour les produits');
    console.log('node scripts/debug-images.js "vos,images,ici"  # Tester le parsing');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('\n💡 Vérifiez que votre Google Sheet est public et accessible');
  }
}

diagnoseSheet();
