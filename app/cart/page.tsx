'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, ArrowLeft } from 'lucide-react';
import { displayNaira } from '@/lib/currency';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Silk Evening Gown',
      price: 450,
      quantity: 1,
      size: 'M',
      color: 'Black',
      image: 'linear-gradient(135deg, #D4AF37 0%, #E8C4C4 100%)',
    },
    {
      id: '2',
      name: 'Premium Cashmere Scarf',
      price: 180,
      quantity: 2,
      size: 'One Size',
      color: 'Ivory',
      image: 'linear-gradient(135deg, #F8F5F0 0%, #E8C4C4 100%)',
    },
  ]);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal > 150 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <div className="pt-32 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/shop" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 mb-4">
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
          <h1 className="font-serif text-5xl font-bold text-foreground">Your Cart</h1>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-foreground/60 text-lg mb-8">Your cart is empty</p>
            <Link href="/shop" className="inline-block px-8 py-3 bg-accent text-accent-foreground font-medium rounded hover:bg-accent/90 transition-colors">
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex gap-6 bg-white rounded-lg p-6 border border-border"
                >
                  {/* Product Image */}
                  <div
                    className="w-32 h-32 rounded-lg flex-shrink-0"
                    style={{ background: item.image }}
                  />

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                      {item.name}
                    </h3>
                    <p className="text-foreground/60 text-sm mb-3">
                      {item.color} • Size {item.size}
                    </p>
                    <p className="font-bold text-foreground">{displayNaira(item.price)}</p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-red-50 rounded transition-colors text-red-500"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="flex items-center gap-2 border border-border rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-secondary/50 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-semibold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-secondary/50 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-bold text-foreground">
                      {displayNaira(item.price * item.quantity)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div
              className="lg:sticky lg:top-32 h-fit bg-white rounded-lg p-8 border border-border"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="font-serif text-xl font-bold text-foreground mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-foreground/70">
                  <span>Subtotal</span>
                  <span>{displayNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>Tax (10%)</span>
                  <span>{displayNaira(tax)}</span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : displayNaira(shipping)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-serif text-lg font-bold text-foreground">Total</span>
                <span className="font-serif text-2xl font-bold text-accent">{displayNaira(total)}</span>
              </div>

              <Link
                href="/payment"
                className="w-full block text-center py-4 bg-accent text-accent-foreground font-semibold rounded hover:bg-accent/90 transition-colors mb-3"
              >
                Buy Now
              </Link>

              <button className="w-full py-4 border-2 border-foreground text-foreground font-semibold rounded hover:bg-foreground hover:text-background transition-all">
                Continue Shopping
              </button>

              {shipping === 0 && (
                <p className="text-sm text-accent text-center mt-4">Free shipping applied!</p>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
