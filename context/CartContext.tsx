"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Cart Item ka Type
type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

// Context ka Type
type CartContextType = {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // LocalStorage se cart load karo (Agar pehle se kuch hai)
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Cart save karo jab bhi change ho
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 1. Add to Cart Function
  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // Agar pehle se hai, to quantity badhao
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Naya item add karo
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.images[0], 
        quantity: 1 
      }];
    });
    alert("Item Added to Cart! 🛒");
  };

  // 2. Remove Item Function
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Total items count
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};