'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface CartItem {
  id?: string;
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  isLoading: boolean;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const LOCAL_CART_KEY = 'divone_guest_cart';

const readLocalCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_CART_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeLocalCart = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    setCartCount(items.reduce((total, item) => total + item.quantity, 0));
  }, [items]);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setItems(readLocalCart());
        setIsLoading(false);
        return;
      }

      const res = await fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        // Extract items from the cart object
        const cartItems = data.cart?.items || [];
        setItems(cartItems);
      }
    } catch (error) {
      console.log('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (item: CartItem) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setItems((current) => {
          const existingIndex = current.findIndex((cartItem) => cartItem._id === item._id);
          const nextItems = [...current];

          if (existingIndex >= 0) {
            nextItems[existingIndex] = {
              ...nextItems[existingIndex],
              quantity: nextItems[existingIndex].quantity + item.quantity,
            };
          } else {
            nextItems.push(item);
          }

          writeLocalCart(nextItems);
          return nextItems;
        });
        return;
      }

      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: item.productId,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
        })
      });

      if (res.ok) {
        await fetchCart(); // Refresh cart from server
      } else {
        const error = await res.json();
        console.error('Failed to add to cart:', error);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setItems((current) => {
          const nextItems = current.filter((item) => item._id !== itemId);
          writeLocalCart(nextItems);
          return nextItems;
        });
        return;
      }

      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        await fetchCart(); // Refresh cart from server
      } else {
        const error = await res.json();
        console.error('Failed to remove from cart:', error);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setItems((current) => {
          const nextItems = current.map((item) =>
            item._id === itemId ? { ...item, quantity } : item
          );
          writeLocalCart(nextItems);
          return nextItems;
        });
        return;
      }

      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      if (res.ok) {
        await fetchCart(); // Refresh cart from server
      } else {
        const error = await res.json();
        console.error('Failed to update quantity:', error);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      writeLocalCart([]);
      setItems([]);
      return;
    }

    // Optional: Implement batch delete if needed
    for (const item of items) {
      await removeFromCart(item._id);
    }
  };

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        cartCount, 
        isLoading,
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        fetchCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
