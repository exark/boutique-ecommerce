import React, { Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider, useCart } from './cartContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import CartNotification from './components/CartNotification';
import PerformanceMonitor from './components/PerformanceMonitor';
import { SpeedInsights } from "@vercel/speed-insights/react";

// Lazy load components for code splitting
const Home = React.lazy(() => import('./views/Home'));
const Produits = React.lazy(() => import('./views/Produits'));
const ProduitDetail = React.lazy(() => import('./views/ProduitDetail'));
const Cart = React.lazy(() => import('./views/Cart'));
const Commande = React.lazy(() => import('./views/Commande'));
const Categories = React.lazy(() => import('./views/Categories'));

// Loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    flexDirection: 'column'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #333',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <p style={{ marginTop: '16px', color: '#666' }}>Chargement...</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function AppContent() {
  const { notification, closeNotification } = useCart();
  
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <div style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px - 400px)' }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/produits" element={<Produits />} />
            <Route path="/produit/:id" element={<ProduitDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/commande" element={<Commande />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </Suspense>
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
