import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Produits from './Produits';

export default function Home() {
  const location = useLocation();
  const produitsRef = useRef(null);

  // Scroll vers les produits si une catégorie est sélectionnée
  useEffect(() => {
    if (location.state?.categorie && produitsRef.current) {
      // Petit délai pour s'assurer que le composant Produits est rendu
      setTimeout(() => {
        produitsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [location.state?.categorie]);

  return (
    <>
      <Hero />
      <div style={{
        width: '80%',
        height: '1px',
        background: '#333',
        margin: '0 auto',
        marginTop: '2rem',
        marginBottom: '2rem'
      }} />
      <div ref={produitsRef}>
        <Produits />
      </div>
    </>
  );
} 