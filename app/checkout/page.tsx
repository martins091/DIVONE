'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Shield, Truck, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useCart } from '@/lib/CartContext';
import { displayNaira } from '@/lib/currency';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missingField = requiredFields.find(field => !formData[field as keyof typeof formData]);
    
    if (missingField) {
      setError(`Please fill in your ${missingField.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items,
          subtotal,
          tax,
          shipping,
          total,
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          paymentMethod: 'bank_transfer',
          status: 'pending_payment',
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order');
      }

      // Clear cart and redirect to payment page
      await clearCart();
      const guestToken = result.order.userId ? null : result.order.guestAccessToken;
      router.push(`/payment?orderId=${result.order.id}${guestToken ? `&token=${guestToken}` : ''}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal > 150000 ? 0 : items.length ? 2500 : 0;
  const total = subtotal + tax + shipping;

  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-border">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Cart is Empty</h2>
            <p className="text-foreground/60 mb-8">Add some beautiful pieces to your cart before checking out.</p>
            <Link
              href="/shop"
              className="inline-block px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Checkout
          </h1>
          <div className="w-20 h-0.5 bg-accent mx-auto mb-6" />
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Complete your order with just a few steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <span className="font-semibold text-foreground">Shipping</span>
                </div>
                <div className="flex-1 h-0.5 bg-accent/30 mx-4" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">
                    2
                  </div>
                  <span className="text-foreground/60">Payment</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-4" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">
                    3
                  </div>
                  <span className="text-foreground/60">Confirmation</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Shipping Address
                </h2>

                <form onSubmit={handleSubmitOrder} className="space-y-6">
                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-foreground"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-foreground"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-foreground"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-foreground"
                      placeholder="+234 800 000 0000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-foreground"
                      placeholder="123 Main Street"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-foreground"
                        placeholder="Lagos"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-foreground"
                        placeholder="Lagos"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Zip Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-foreground"
                        placeholder="100001"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-foreground"
                        required
                      >
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Kenya">Kenya</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Summary for Mobile */}
                  <div className="lg:hidden bg-gray-50 rounded-lg p-6 mt-6">
                    <h3 className="font-serif text-lg font-bold text-foreground mb-4">Order Summary</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-foreground/70">
                        <span>Subtotal ({items.length} items)</span>
                        <span>{displayNaira(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-foreground/70">
                        <span>Tax</span>
                        <span>{displayNaira(tax)}</span>
                      </div>
                      <div className="flex justify-between text-foreground/70">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : displayNaira(shipping)}</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="text-xl font-bold text-accent">{displayNaira(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Order...
                      </>
                    ) : (
                      <>
                        Proceed to Payment
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-6 text-xs text-foreground/50">
                    <div className="flex items-center gap-1">
                      <Shield size={14} />
                      Secure Checkout
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck size={14} />
                      Free Shipping over ₦150,000
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      24/7 Support
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Order Summary - Desktop */}
          <motion.div
            className="hidden lg:block lg:sticky lg:top-32 h-fit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
              <h3 className="font-serif text-xl font-bold text-foreground mb-6">
                Order Summary
              </h3>

              {/* Items Preview */}
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-foreground/60">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {displayNaira(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-xs text-foreground/60 text-center">
                    +{items.length - 3} more items
                  </p>
                )}
              </div>

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
                  <span className={shipping === 0 ? 'text-accent font-medium' : ''}>
                    {shipping === 0 ? 'Free' : displayNaira(shipping)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-serif text-lg font-bold text-foreground">Total</span>
                <span className="font-serif text-2xl font-bold text-accent">
                  {displayNaira(total)}
                </span>
              </div>

              <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-foreground/70">
                    <p className="font-semibold text-foreground">Secure Payment</p>
                    <p>Your payment information is encrypted and secure.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Import missing icons
import { ShoppingBag, AlertCircle } from 'lucide-react';
