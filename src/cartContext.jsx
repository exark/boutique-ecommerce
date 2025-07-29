import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState({ open: false, productName: '', selectedSize: '' });

  function addToCart(product) {
    setCart((prevCart) => {
      // Vérifier si le produit existe déjà avec la même taille
      const existing = prevCart.find((item) => 
        item.id === product.id && item.selectedSize === product.selectedSize
      );
      
      if (existing) {
        // Augmenter la quantité si même produit et même taille
        return prevCart.map((item) =>
          item.id === product.id && item.selectedSize === product.selectedSize 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Ajouter comme nouvel article avec la taille sélectionnée
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    
    // Afficher la notification
    setNotification({
      open: true,
      productName: product.nom,
      selectedSize: product.selectedSize || ''
    });
  }

  function removeFromCart(id, selectedSize) {
    setCart((prevCart) => 
      prevCart.filter((item) => 
        !(item.id === id && item.selectedSize === selectedSize)
      )
    );
  }

  function updateQuantity(id, selectedSize, newQuantity) {
    setCart((prevCart) => 
      prevCart.map((item) => 
        item.id === id && item.selectedSize === selectedSize 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  }

  function closeNotification() {
    setNotification({ open: false, productName: '', selectedSize: '' });
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, notification, closeNotification }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 