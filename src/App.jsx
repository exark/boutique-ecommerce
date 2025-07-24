import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Produits from './views/Produits.jsx';
import { CartProvider } from './cartContext';

function App() {
  return (
    <CartProvider>
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <Hero />
        <Produits />
      </div>
    </CartProvider>
  );
}

export default App;
