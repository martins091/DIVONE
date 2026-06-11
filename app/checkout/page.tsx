'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function CheckoutPage() {
  const [formStep, setFormStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [orderNumber] = useState('ORD-2024-' + Math.random().toString(36).substr(2, 9).toUpperCase());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (formStep === 'shipping') {
      setFormStep('payment');
    } else if (formStep === 'payment') {
      setFormStep('confirmation');
    }
  };

  const subtotal = 810;
  const tax = 81;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="pt-32 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="flex items-center gap-4 mb-12">
              {['shipping', 'payment', 'confirmation'].map((step, index) => (
                <div key={step} className="flex items-center gap-4">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      formStep === step
                        ? 'bg-accent text-accent-foreground'
                        : ['shipping', 'payment'].includes(step) && formStep === 'confirmation'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    {['shipping', 'payment'].includes(step) && formStep === 'confirmation' ? (
                      <Check size={20} />
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                  <span className={formStep === step ? 'font-semibold text-foreground' : 'text-foreground/60'}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </span>
                  {index < 2 && <div className="w-8 h-0.5 bg-border" />}
                </div>
              ))}
            </div>

            {/* Shipping Information */}
            {formStep === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Shipping Address</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                    />
                  </div>

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="Zip Code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                    />
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full py-4 bg-accent text-accent-foreground font-semibold rounded hover:bg-accent/90 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {/* Payment Information */}
            {formStep === 'payment' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Payment Information</h2>

                <div className="space-y-6">
                  <input
                    type="text"
                    name="cardName"
                    placeholder="Cardholder Name"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                  />

                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                    />
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="px-4 py-3 bg-white border border-border rounded focus:outline-none focus:border-accent text-foreground"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setFormStep('shipping')}
                      className="flex-1 py-4 border-2 border-foreground text-foreground font-semibold rounded hover:bg-foreground hover:text-background transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 py-4 bg-accent text-accent-foreground font-semibold rounded hover:bg-accent/90 transition-colors"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Order Confirmation */}
            {formStep === 'confirmation' && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-6"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <Check size={32} className="text-accent-foreground" />
                </motion.div>

                <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                  Order Confirmed!
                </h2>
                <p className="text-foreground/60 mb-8">
                  Thank you for your purchase. Your order has been placed successfully.
                </p>

                <div className="bg-secondary rounded-lg p-6 mb-8">
                  <p className="text-foreground/60 mb-2">Order Number</p>
                  <p className="font-serif text-2xl font-bold text-foreground">{orderNumber}</p>
                </div>

                <p className="text-foreground/60 mb-8">
                  A confirmation email has been sent to <span className="font-semibold">{formData.email}</span>
                </p>

                <Link
                  href="/shop"
                  className="inline-block px-8 py-4 bg-accent text-accent-foreground font-semibold rounded hover:bg-accent/90 transition-colors"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <motion.div
            className="lg:sticky lg:top-32 h-fit bg-white rounded-lg p-8 border border-border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-serif text-xl font-bold text-foreground mb-6">Order Summary</h3>

            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-foreground/70">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-foreground/70">
                <span>Tax</span>
                <span>${tax}</span>
              </div>
              <div className="flex justify-between text-foreground/70">
                <span>Shipping</span>
                <span className="text-accent">Free</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-serif text-lg font-bold text-foreground">Total</span>
              <span className="font-serif text-2xl font-bold text-accent">${total}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
