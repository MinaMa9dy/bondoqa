import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize from localStorage
    const savedCart = localStorage.getItem('bondoqa_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Automatically save to localStorage whenever the cart changes
  useEffect(() => {
    localStorage.setItem('bondoqa_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart logic
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === product.id && item.selectedWeight === product.selectedWeight
      );
      if (existingItem) {
        return prevItems.map(item =>
          (item.id === product.id && item.selectedWeight === product.selectedWeight)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId, weight, type) => {
    setCartItems(prevItems => prevItems.filter(item => 
      !(item.id === productId && item.selectedWeight === weight && item.selectedType === type)
    ));
  };

  const updateQuantity = (productId, weight, type, delta) => {
    setCartItems(prevItems => prevItems.map(item => {
      if (item.id === productId && item.selectedWeight === weight && item.selectedType === type) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      cartCount, 
      cartSubtotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};
