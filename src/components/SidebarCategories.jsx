import React, { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import produits from '../data/produits.json';
import './SidebarCategories.css';

function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

export default function SidebarCategories({ open, onClose, onSelectCategory, selectedCategory }) {
  const isMobile = useIsMobile();
  // Extraire dynamiquement les catégories uniques
  const categories = useMemo(() => {
    const set = new Set(produits.map(p => p.categorie));
    return Array.from(set).sort();
  }, []);

  // Fermer avec la touche Echap sur mobile
  useEffect(() => {
    if (!isMobile || !open) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isMobile, open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay pour mobile */}
          {isMobile && (
            <motion.div
              className="sidebar-categories-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={onClose}
            />
          )}
          <motion.aside
            className={`sidebar-categories${isMobile ? ' sidebar-categories--mobile' : ''}`}
            initial={isMobile ? { x: '-100%' } : { x: -300, opacity: 0 }}
            animate={isMobile ? { x: 0 } : { x: 0, opacity: 1 }}
            exit={isMobile ? { x: '-100%' } : { x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            onMouseLeave={!isMobile ? onClose : undefined}
          >
            <h3 className="sidebar-categories__title">Catégories</h3>
            {isMobile && (
              <button className="sidebar-categories__close" onClick={onClose} aria-label="Fermer">
                ×
              </button>
            )}
            <ul className="sidebar-categories__list">
              {categories.map(cat => (
                <motion.li
                  key={cat}
                  className={`sidebar-categories__item${selectedCategory === cat ? ' selected' : ''}`}
                  whileHover={{ scale: 1.05, backgroundColor: '#ffe4ef' }}
                  onClick={() => onSelectCategory(cat)}
                >
                  {cat}
                </motion.li>
              ))}
            </ul>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
} 