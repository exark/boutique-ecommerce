import Navbar from './components/Navbar';
import { CartProvider } from './cartContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProduitDetail from './views/ProduitDetail';
import Home from './views/Home';
import Produits from './views/Produits';
import Cart from './views/Cart';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import Categories from './views/Categories';

function App() {
  return (
    <CartProvider>
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
      </Router>
    </CartProvider>
  );
}

export default App;
