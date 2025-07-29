import React from 'react';
import { useNavigate } from 'react-router-dom';
import produits from '../data/produits';
import './Categories.css';

export default function Categories() {
  const navigate = useNavigate();
  // Pour chaque catégorie, trouver le premier produit pour l'image
  const categories = Array.from(new Set(produits.map(p => p.categorie))).sort();
  const catImages = {};
  categories.forEach(cat => {
    const prod = produits.find(p => p.categorie === cat);
    catImages[cat] = prod ? prod.image : '';
  });

  function handleCategoryClick(cat) {
    navigate('/produits', { state: { categorie: cat } });
  }

  return (
    <div className="categories-centered-container">
      <div className="categories-grid">
        {categories.map(cat => (
          <div
            key={cat}
            className="category-card"
            tabIndex={0}
            onClick={() => handleCategoryClick(cat)}
            onKeyDown={e => { if (e.key === 'Enter') handleCategoryClick(cat); }}
            role="button"
            aria-label={`Voir les produits de la catégorie ${cat}`}
          >
            <div className="category-image-wrapper">
              <img src={catImages[cat]} alt={cat} className="category-image" />
            </div>
            <div className="category-info">
              <span className="category-name">{cat}</span>
              <button className="category-btn" onClick={e => { e.stopPropagation(); handleCategoryClick(cat); }}>Voir tout</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 