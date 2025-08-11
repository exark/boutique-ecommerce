import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuration
const SHEET_ID = '1u1bwB9FOHAXW3xMyAyfYlF4jcHS7LvMIRFQLp1rJHto';

async function deployWithUpdate() {
  try {
    console.log('🚀 Démarrage du déploiement avec mise à jour automatique...');
    
    // 1. Mettre à jour les produits
    console.log('📊 Mise à jour des produits depuis Google Sheet...');
    const { stdout: updateOutput, stderr: updateError } = await execAsync(
      `node scripts/convertSheetToJson.js ${SHEET_ID}`
    );
    
    if (updateError) {
      console.error('❌ Erreur lors de la mise à jour des produits:', updateError);
      process.exit(1);
    }
    
    console.log('✅ Produits mis à jour avec succès !');
    console.log(updateOutput);
    
    // 2. Construire le projet
    console.log('🔨 Construction du projet...');
    const { stdout: buildOutput, stderr: buildError } = await execAsync('npm run build');
    
    if (buildError) {
      console.error('❌ Erreur lors de la construction:', buildError);
      process.exit(1);
    }
    
    console.log('✅ Construction réussie !');
    console.log(buildOutput);
    
    // 3. Déployer (si vous utilisez Vercel, Netlify, etc.)
    console.log('🚀 Déploiement...');
    console.log('💡 Ajoutez votre commande de déploiement ici');
    console.log('   Exemple: vercel --prod');
    
    console.log('🎉 Déploiement terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du déploiement:', error.message);
    process.exit(1);
  }
}

deployWithUpdate(); 