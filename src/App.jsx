import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Produits from './views/Produits.jsx';

function App() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <Hero />
        <Produits />
      </div>
    </>
  );
}

export default App;
