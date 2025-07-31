import Navbar from './components/Navbar';
import { CartProvider, useCart } from './cartContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProduitDetail from './views/ProduitDetail';
import Home from './views/Home';
import Produits from './views/Produits';
import Cart from './views/Cart';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import Categories from './views/Categories';
import CartNotification from './components/CartNotification';
import { SpeedInsights } from "@vercel/speed-insights/react"

function AppContent() {
  const { notification, closeNotification } = useCart();
  
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/produits" element={<Produits />} />
          <Route path="/produit/:id" element={<ProduitDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </div>
      <ScrollToTopButton />
      <CartNotification 
        open={notification.open}
        onClose={closeNotification}
        productName={notification.productName}
        selectedSize={notification.selectedSize}
      />
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
