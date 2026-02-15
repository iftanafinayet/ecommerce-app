import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types/product';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  countInStock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const addToCart = (product: Product, quantity: number) => {
    const existingItem = cartItems.find(item => item._id === product._id);

    if (existingItem) {
      const newItems = cartItems.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCartItems(newItems);
      localStorage.setItem('cart', JSON.stringify(newItems));
    } else {
      const newItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        countInStock: product.countInStock,
      };
      const newItems = [...cartItems, newItem];
      setCartItems(newItems);
      localStorage.setItem('cart', JSON.stringify(newItems));
    }
  };

  const removeFromCart = (productId: string) => {
    const newItems = cartItems.filter(item => item._id !== productId);
    setCartItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      const newItems = cartItems.map(item =>
        item._id === productId ? { ...item, quantity } : item
      );
      setCartItems(newItems);
      localStorage.setItem('cart', JSON.stringify(newItems));
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}