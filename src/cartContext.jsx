import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState({ open: false, productName: '', selectedSize: '' });
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger le panier depuis localStorage au montage du composant
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier depuis localStorage:', error);
      // En cas d'erreur, on garde le panier vide
      setCart([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification (seulement après l'initialisation)
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du panier dans localStorage:', error);
      }
    }
  }, [cart, isInitialized]);

  function addToCart(product) {
    if (!product || !product.id) {
      console.error('Produit invalide pour ajout au panier');
      return;
    }

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
      productName: product.nom || 'Produit',
      selectedSize: product.selectedSize || ''
    });
  }

  function removeFromCart(id, selectedSize) {
    if (!id) {
      console.error('ID invalide pour suppression du panier');
      return;
    }

    setCart((prevCart) => 
      prevCart.filter((item) => 
        !(item.id === id && item.selectedSize === selectedSize)
      )
    );
  }

  function updateQuantity(id, selectedSize, newQuantity) {
    if (!id || newQuantity < 0) {
      console.error('Paramètres invalides pour mise à jour de quantité');
      return;
    }

    setCart((prevCart) => 
      prevCart.map((item) => 
        item.id === id && item.selectedSize === selectedSize 
          ? { ...item, quantity: Math.max(0, newQuantity) } 
          : item
      ).filter(item => item.quantity > 0) // Supprimer les articles avec quantité 0
    );
  }

  function closeNotification() {
    setNotification({ open: false, productName: '', selectedSize: '' });
  }

  // Fonction pour vider complètement le panier
  function clearCart() {
    setCart([]);
  }

  // Calculer le total des articles dans le panier
  const cartTotal = cart.reduce((total, item) => total + (item.prix * item.quantity), 0);
  
  // Calculer le nombre total d'articles
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      notification, 
      closeNotification,
      clearCart,
      cartTotal,
      cartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé à l\'intérieur d\'un CartProvider');
  }
  return context;
} 