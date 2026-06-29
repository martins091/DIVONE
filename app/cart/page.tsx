'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, ArrowLeft } from 'lucide-react';
import { displayNaira } from '@/lib/currency';
import { useCart } from '@/lib/CartContext';

export default function CartPage() {
  const { items: cartItems, isLoading, updateQuantity, removeFromCart } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // REMOVED: tax and shipping calculations
  // const tax = subtotal * 0.1;
  // const shipping = subtotal > 150000 ? 0 : cartItems.length ? 2500 : 0;
  const total = subtotal; // Now total is just the subtotal

  return (
    <div className="pt-32 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {isLoading ? (
          <div className="text-center py-20 text-foreground/60">Loading cart...</div>
        ) : cartItems.length === 0 ? (
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
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex gap-6 bg-white rounded-lg p-6 border border-border"
                >
                  <div className="w-32 h-32 rounded-lg flex-shrink-0 overflow-hidden bg-secondary">
                    {item.image?.startsWith('http') ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full" style={{ background: item.image || 'linear-gradient(135deg, #D4AF37 0%, #E8C4C4 100%)' }} />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                      {item.name}
                    </h3>
                    <p className="text-foreground/60 text-sm mb-3">
                      {item.color || 'Default'} • Size {item.size || 'One Size'}
                    </p>
                    <p className="font-bold text-foreground">{displayNaira(item.price)}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 hover:bg-red-50 rounded transition-colors text-red-500"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="flex items-center gap-2 border border-border rounded">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-secondary/50 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-semibold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
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
                {/* REMOVED: Tax and Shipping sections */}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-serif text-lg font-bold text-foreground">Total</span>
                <span className="font-serif text-2xl font-bold text-accent">{displayNaira(total)}</span>
              </div>

              {/* Added delivery fee note */}
              <p className="text-sm text-gray-500 text-center mb-4">
                * Delivery fee will be paid to the delivery person upon arrival
              </p>

              <Link
                href="/checkout"
                className="w-full block text-center py-4 bg-accent text-accent-foreground font-semibold rounded hover:bg-accent/90 transition-colors mb-3"
              >
                Proceed to Checkout
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}