import { spawn } from 'child_process';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuration
const SHEET_ID = '1u1bwB9FOHAXW3xMyAyfYlF4jcHS7LvMIRFQLp1rJHto';
const UPDATE_INTERVAL = 2 * 60 * 1000; // 2 minutes
const CONVERT_SCRIPT = './scripts/convertSheetToJson.js';

let isUpdating = false;

async function updateProducts() {
  if (isUpdating) return;
  
  try {
    isUpdating = true;
    console.log('🔄 Mise à jour automatique des produits...');
    
    const { stdout, stderr } = await execAsync(`node ${CONVERT_SCRIPT} ${SHEET_ID}`);
    
    if (stderr) {
      console.error('❌ Erreur de mise à jour:', stderr);
    } else {
      console.log('✅ Produits mis à jour automatiquement !');
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    isUpdating = false;
  }
}

function startDevServer() {
  console.log('🚀 Démarrage du serveur de développement avec mise à jour automatique...');
  console.log('📊 Mise à jour automatique toutes les 2 minutes');
  console.log('🌐 Serveur de développement sur http://localhost:5173');
  
  // Démarrer le serveur de développement
  const devProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });
  
  // Première mise à jour immédiate
  updateProducts();
  
  // Mises à jour périodiques
  const updateInterval = setInterval(updateProducts, UPDATE_INTERVAL);
  
  // Gestion de l'arrêt
  process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du serveur...');
    clearInterval(updateInterval);
    devProcess.kill('SIGINT');
    process.exit(0);
  });
  
  devProcess.on('close', (code) => {
    console.log(`\n🛑 Serveur arrêté avec le code: ${code}`);
    clearInterval(updateInterval);
    process.exit(code);
  });
}

startDevServer(); 