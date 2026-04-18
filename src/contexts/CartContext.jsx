import { useState } from 'react';
import { CartContext } from './CartContextInstance';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add Item
  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  // Remove Item
  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Update Qty
  const updateQuantity = (itemId, newQty) => {
    if (newQty <= 0) return removeFromCart(itemId);
    setCartItems(prev => prev.map(i => i.id === itemId ? { ...i, qty: newQty } : i))
  };

  // Total
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.qty), 0);

  // Add multiple items (for reordering)
  const addMultipleToCart = (items) => {
    setCartItems(prev => {
      let next = [...prev];
      items.forEach(item => {
        const existing = next.find(i => i.id === item.id);
        if (existing) {
          next = next.map(i => i.id === item.id ? { ...i, qty: i.qty + item.qty } : i);
        } else {
          next.push({ ...item });
        }
      });
      return next;
    });
  };

  // Clear 
  const clearCart = () => setCartItems([]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    addMultipleToCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
