import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

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

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 