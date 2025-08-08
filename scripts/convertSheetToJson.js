/* eslint-env node */
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import sharp from 'sharp';
import { parseImagesFromSheet } from '../src/utils/imageParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DEFAULT_SHEET_ID = '1u1bwB9FOHAXW3xMyAyfYlF4jcHS7LvMIRFQLp1rJHto';
const DEFAULT_OUTPUT_FILE = 'src/data/produits.json';

const IMAGE_OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Colonnes attendues pour les images
const IMAGE_COLUMNS = ['image_produit', 'images', 'image_urls', 'photos', 'Pictures', 'Images'];

// Mapping des images existantes par catégorie
const IMAGE_MAPPING = {
  'Blouses': '/images/pexels-polina-tankilevitch-4725105.jpg',
  'Pantalons': '/images/pexels-payamrafiei56-6567927.jpg',
  'Vestes': '/images/denim-jacket-6240825.jpg',
  'T-shirts': '/images/pexels-david-manzyk-253085053-20426347.jpg',
  'Jupes': '/images/pexels-miyatavictor-19327673.jpg',
  'Pulls': '/images/pexels-vlada-karpovich-9968525.jpg',
  'Chemises': '/images/pexels-28488111-7945745.jpg',
  'Cardigans': '/images/pexels-valeriya-31747192.jpg',
  'Shorts': '/images/pexels-nai-de-vogue-2150938492-31410215.jpg',
  'Manteaux': '/images/woman-4290853.jpg',
  'Débardeurs': '/images/woman-4390055.jpg',
  'Combinaisons': '/images/woman-6540891.jpg',
  'Sweats': '/images/fashion-3555648.jpg',
  'Robes': '/images/fashion-1283863.jpg',
  'Blazers': '/images/pexels-cottonbro-9861655.jpg',
  'default': '/images/pexels-polina-tankilevitch-4725105.jpg'
};

// Descriptions par défaut par catégorie
const DESCRIPTION_MAPPING = {
  'Blouses': 'Blouse élégante et confortable, parfaite pour toutes les occasions.',
  'Pantalons': 'Pantalon moderne et stylé, pour un look tendance.',
  'Vestes': 'Veste intemporelle, idéale pour compléter vos tenues.',
  'T-shirts': 'T-shirt basique et confortable, un indispensable du dressing.',
  'Jupes': 'Jupe élégante et féminine, pour toutes les occasions.',
  'Pulls': 'Pull doux et chaud, parfait pour la mi-saison.',
  'Chemises': 'Chemise élégante, à porter au bureau ou en sortie.',
  'Cardigans': 'Cardigan doux et élégant, facile à assortir.',
  'Shorts': 'Short léger et confortable, parfait pour l\'été.',
  'Manteaux': 'Manteau chaud et élégant, pour un hiver stylé.',
  'Débardeurs': 'Débardeur tendance, à porter seul ou sous une veste.',
  'Combinaisons': 'Combinaison élégante, idéale pour les soirées.',
  'Sweats': 'Sweat confortable et stylé, pour un look décontracté.',
  'Robes': 'Robe élégante et féminine, pour toutes les occasions.',
  'Blazers': 'Blazer élégant et structuré, parfait pour le bureau.',
  'default': 'Produit élégant et confortable, parfait pour toutes les occasions.'
};

function downloadGoogleSheet(sheetId) {
  return new Promise((resolve, reject) => {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    console.log(`Téléchargement depuis: ${url}`);
    
    const makeRequest = (url, redirectCount = 0) => {
      if (redirectCount > 5) {
        reject(new Error('Trop de redirections'));
        return;
      }
      
      https.get(url, (res) => {
        console.log(`Statut de la réponse: ${res.statusCode}`);
        
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
          const location = res.headers.location;
          console.log(`Redirection vers: ${location}`);
          makeRequest(location, redirectCount + 1);
          return;
        }
        
        if (res.statusCode !== 200) {
          reject(new Error(`Échec du téléchargement: ${res.statusCode} - ${res.statusMessage}`));
          return;
        }
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
          console.log(`Données reçues: ${chunk.length} bytes`);
        });
        
        res.on('end', () => {
          console.log(`Téléchargement terminé. Taille totale: ${data.length} bytes`);
          if (data.length === 0) {
            reject(new Error('Aucune donnée reçue du Google Sheet'));
            return;
          }
          resolve(data);
        });
      }).on('error', (err) => {
        console.error(`Erreur de téléchargement:`, err.message);
        reject(err);
      });
    };
    
    makeRequest(url);
  });
}

function parseCsv(content) {
  console.log('Parsing du CSV...');
  const lines = content.trim().split(/\r?\n/);
  console.log(`Nombre de lignes: ${lines.length}`);
  
  if (lines.length < 2) {
    throw new Error('Le CSV doit contenir au moins une ligne d\'en-tête et une ligne de données');
  }
  
  const header = lines[0].split(',').map(h => h.trim());
  console.log(`En-têtes détectées: ${header.join(', ')}`);
  
  const rows = lines.slice(1).map((line, index) => {
    const values = line.split(',').map(v => v.trim());
    const obj = {};
    header.forEach((key, idx) => {
      obj[key] = values[idx] || '';
    });
    return obj;
  });
  
  console.log(`Nombre de lignes de données: ${rows.length}`);
  return { header, rows };
}

function convertWideFormatToProducts(header, rows) {
  console.log('Conversion du format wide vers le format produits...');
  
  // Détecter les colonnes de stock
  const stockColumns = header.filter(h => h.toLowerCase().startsWith('stock_'));
  console.log(`Colonnes de stock détectées: ${stockColumns.join(', ')}`);
  
  // Détecter la colonne d'images
  const imageColumn = IMAGE_COLUMNS.find(col => header.includes(col));
  console.log(`Colonne d'images détectée: ${imageColumn || 'Aucune - utilisation du mapping par catégorie'}`);
  
  const products = [];
  
  rows.forEach((row, index) => {
    const id = Number(row.id || row.ID);
    if (!id || isNaN(id)) {
      console.log(`Ligne ${index + 1}: ID manquant ou invalide, ignorée`);
      return;
    }
    
    const categorie = row.categorie || row.Categorie || row.category || row.Category || 'Autres';
    const nom = row.nom || row.Nom || row.name || row.Name || 'Produit sans nom';
    
    // Vérifier si le produit a du stock
    let hasStock = false;
    const tailles = [];
    
    stockColumns.forEach(col => {
      const stock = Number(row[col] || 0);
      if (stock > 0) {
        hasStock = true;
        const taille = col.replace('stock_', '').toUpperCase();
        tailles.push({
          taille: taille,
          stock: stock
        });
        console.log(`Taille ${taille} ajoutée avec stock ${stock}`);
      }
    });
    
    if (!hasStock) {
      console.log(`Produit ${nom} (ID: ${id}) ignoré car pas de stock`);
      return;
    }
    
    // Traitement des images multiples
    let imageData;
    if (imageColumn && row[imageColumn]) {
      // Utiliser les images depuis Google Sheets
      const rawImages = row[imageColumn];
      const parsedImages = parseImagesFromSheet(rawImages);
      imageData = {
        image: parsedImages[0] || (IMAGE_MAPPING[categorie] || IMAGE_MAPPING.default),
        images: parsedImages.length > 0 ? parsedImages : [IMAGE_MAPPING[categorie] || IMAGE_MAPPING.default]
      };
      console.log(`Images trouvées pour ${nom}: ${imageData.images.length} images`);
    } else {
      // Fallback sur le mapping par catégorie
      const fallbackImage = IMAGE_MAPPING[categorie] || IMAGE_MAPPING.default;
      imageData = {
        image: fallbackImage,
        images: [fallbackImage]
      };
      console.log(`Utilisation image par défaut pour ${nom}: ${fallbackImage}`);
    }
    
    const product = {
      id,
      nom: nom,
      categorie: categorie,
      prix: Number(row.prix || row.Prix || row.price || row.Price || 0),
      image: imageData.image,
      images: imageData.images,
      description: row.description || row.Description || 
                 DESCRIPTION_MAPPING[categorie] || 
                 DESCRIPTION_MAPPING.default,
      matiere: row.matiere || row.Matiere || row.material || row.Material || 'Coton',
      couleur: row.couleur || row.Couleur || row.color || row.Color || 'Multicolore',
      tailles: tailles,
      disponibilite: row.disponibilite || row.Disponibilite || 'En stock',
      nouveaute: /^(true|oui|yes|1|vrai)$/i.test((row.nouveaute || row.Nouveaute || 'false').trim())
    };
    
    products.push(product);
    console.log(`Produit créé: ${product.nom} (ID: ${id}) avec ${tailles.length} tailles`);
  });
  
  const result = products.sort((a, b) => a.id - b.id);
  console.log(`Conversion terminée: ${result.length} produits créés`);
  return result;
}

async function downloadAndOptimize(url, slug, index) {
  const hash = crypto.createHash('md5').update(url).digest('hex').slice(0, 8);
  const baseName = `${slug}-${hash}-${index}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const sizes = [400, 800, 1200];
    const srcset = {};
    for (const width of sizes) {
      const outPath = path.join(IMAGE_OUTPUT_DIR, `${baseName}-${width}.webp`);
      await sharp(buffer).resize({ width }).webp({ quality: 75 }).toFile(outPath);
      srcset[width] = `/images/products/${baseName}-${width}.webp`;
    }

    const jpgOut = path.join(IMAGE_OUTPUT_DIR, `${baseName}-800.jpg`);
    await sharp(buffer).resize({ width: 800 }).jpeg({ quality: 75 }).toFile(jpgOut);

    return {
      base: srcset[800],
      srcset,
      fallbackJpg: `/images/products/${baseName}-800.jpg`
    };
  } catch (err) {
    console.error(`Erreur traitement image ${url}: ${err.message}`);
    return {
      base: url,
      srcset: {},
      fallbackJpg: url
    };
  }
}

async function processImages(products) {
  if (!fs.existsSync(IMAGE_OUTPUT_DIR)) {
    fs.mkdirSync(IMAGE_OUTPUT_DIR, { recursive: true });
  }

  for (const product of products) {
    const slug = slugify(product.nom);
    const processed = [];
    for (let i = 0; i < product.images.length; i++) {
      const imgUrl = product.images[i];
      const optimized = await downloadAndOptimize(imgUrl, slug, i);
      processed.push(optimized);
    }
    product.images = processed;
    if (processed[0]) {
      product.image = processed[0].fallbackJpg || processed[0].base;
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const sheetId = args[0] || DEFAULT_SHEET_ID;
  const outputFile = args[1] || DEFAULT_OUTPUT_FILE;
  
  console.log('Démarrage de la conversion Google Sheet → JSON');
  console.log(`Sheet ID: ${sheetId}`);
  console.log(`Fichier de sortie: ${outputFile}`);
  
  try {
    console.log('Téléchargement du Google Sheet...');
    const csvContent = await downloadGoogleSheet(sheetId);
    
    console.log('Conversion CSV vers JSON...');
    const { header, rows } = parseCsv(csvContent);
    const products = convertWideFormatToProducts(header, rows);
    
    if (products.length === 0) {
      throw new Error('Aucun produit n\'a été converti. Vérifiez le format de votre Google Sheet.');
    }
    
    console.log('Traitement des images...');
    await processImages(products);

    console.log(`Génération du fichier ${outputFile}...`);

    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(products, null, 2), 'utf8');
    
    console.log(`Conversion terminée avec succès !`);
    console.log(`${products.length} produits convertis`);
    console.log(`Fichier généré: ${outputFile}`);
    console.log(`Votre site est maintenant à jour !`);
    
  } catch (err) {
    console.error('Erreur:', err.message);
    console.error('Vérifiez que votre Google Sheet est public et accessible');
    process.exit(1);
  }
}

main(); 