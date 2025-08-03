import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);

// Configuration
const SHEET_ID = '1u1bwB9FOHAXW3xMyAyfYlF4jcHS7LvMIRFQLp1rJHto';
const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes
const CONVERT_SCRIPT = path.join(__dirname, 'convertSheetToJson.js');

let lastUpdate = Date.now();
let isUpdating = false;

async function checkForUpdates() {
  if (isUpdating) {
    console.log('⏳ Mise à jour déjà en cours, attente...');
    return;
  }

  try {
    console.log('🔍 Vérification des mises à jour...');
    isUpdating = true;

    // Exécuter le script de conversion
    const { stdout, stderr } = await execAsync(`node ${CONVERT_SCRIPT} ${SHEET_ID}`);
    
    if (stderr) {
      console.error('❌ Erreur lors de la mise à jour:', stderr);
    } else {
      console.log('✅ Mise à jour automatique réussie !');
      console.log(stdout);
      lastUpdate = Date.now();
    }
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour automatique:', error.message);
  } finally {
    isUpdating = false;
  }
}

function startWatcher() {
  console.log('🚀 Démarrage du surveillant automatique...');
  console.log(`📊 Surveillance du Google Sheet: ${SHEET_ID}`);
  console.log(`⏰ Intervalle de vérification: ${UPDATE_INTERVAL / 1000 / 60} minutes`);
  console.log('🔄 Appuyez sur Ctrl+C pour arrêter');
  
  // Première vérification immédiate
  checkForUpdates();
  
  // Vérifications périodiques
  setInterval(checkForUpdates, UPDATE_INTERVAL);
}

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du surveillant automatique...');
  process.exit(0);
});

startWatcher(); 