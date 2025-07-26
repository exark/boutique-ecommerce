import React from 'react';
import Hero from '../components/Hero';
import Produits from './Produits';

export default function Home() {
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
      <Produits />
    </>
  );
} 