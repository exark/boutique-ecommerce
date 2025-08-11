import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider, useCart } from './cartContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import CartNotification from './components/CartNotification';
import PerformanceMonitor from './components/PerformanceMonitor';
import { SpeedInsights } from "@vercel/speed-insights/react";

// Direct imports for immediate loading
import Home from './views/Home';
import Produits from './views/Produits';
import ProduitDetail from './views/ProduitDetail';
import Cart from './views/Cart';
import Commande from './views/Commande';
import PolitiqueConfidentialite from './views/PolitiqueConfidentialite';
import ConditionsVente from './views/ConditionsVente';
import MentionsLegales from './views/MentionsLegales';

function AppContent() {
  const { notification, closeNotification } = useCart();
  
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <div style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px - 400px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/produits" element={<Produits />} />
          <Route path="/produit/:id" element={<ProduitDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/commande" element={<Commande />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/conditions-vente" element={<ConditionsVente />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
        </Routes>
      </div>
      <Footer />
      <ScrollToTopButton />
      <CartNotification 
        open={notification.open}
        onClose={closeNotification}
        productName={notification.productName}
        selectedSize={notification.selectedSize}
      />
      <PerformanceMonitor />
      <SpeedInsights />
    </Router>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
