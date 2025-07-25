import Navbar from './components/Navbar';
import { CartProvider } from './cartContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProduitDetail from './views/ProduitDetail';
import Home from './views/Home';

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <div style={{ paddingTop: '80px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/produit/:id" element={<ProduitDetail />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
