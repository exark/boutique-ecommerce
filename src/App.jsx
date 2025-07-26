import Navbar from './components/Navbar';
import { CartProvider } from './cartContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProduitDetail from './views/ProduitDetail';
import Home from './views/Home';
import Produits from './views/Produits';
import Cart from './views/Cart';

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <div style={{ paddingTop: '80px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/produits" element={<Produits />} />
            <Route path="/produit/:id" element={<ProduitDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
