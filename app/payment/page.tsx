'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, Upload, AlertCircle } from 'lucide-react';
import { displayNaira } from '@/lib/currency';

const BANK_DETAILS = {
  accountName: 'Ogbaegbe Onyinyechi ',
  bankName: 'Fidelity Bank',
  accountNumber: '6150341483',
};

export default function PaymentPage() {
  const [copied, setCopied] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    transactionReference: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Mock order data - in production, this would come from URL params or session
  const orderData = {
    orderId: 'ORD-2024-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    subtotal: 125000,
    tax: 12500,
    shipping: 2500,
  };

  const total = orderData.subtotal + orderData.tax + orderData.shipping;

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!uploadedFile) {
        setErrorMessage('Please upload a payment screenshot');
        setIsSubmitting(false);
        return;
      }

      // In a real app, you would upload the file first and get a URL
      // For now, we'll use a placeholder
      const screenshotUrl = `https://example.com/screenshots/${Date.now()}-${uploadedFile.name}`;

      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderData.orderId,
          userId: 'user-123', // This would come from session
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          transactionReference: formData.transactionReference,
          screenshotUrl,
          amount: total,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit payment confirmation');
      }

      setSuccessMessage(
        'Payment confirmation submitted successfully! Our team will verify your payment within 24 hours.'
      );
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        transactionReference: '',
      });
      setUploadedFile(null);
      setTimeout(() => {
        window.location.href = '/account';
      }, 3000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to submit payment'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-foreground mb-4">
            Complete Your Payment
          </h1>
          <p className="text-lg text-foreground/70">
            Transfer to the account below to complete your order
          </p>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          className="bg-card rounded-lg border border-border p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-playfair font-bold text-foreground mb-6">
            Order Summary
          </h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-foreground/70">
              <span>Subtotal:</span>
              <span>{displayNaira(orderData.subtotal)}</span>
            </div>
            <div className="flex justify-between text-foreground/70">
              <span>Tax:</span>
              <span>{displayNaira(orderData.tax)}</span>
            </div>
            <div className="flex justify-between text-foreground/70">
              <span>Shipping:</span>
              <span>{displayNaira(orderData.shipping)}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-bold text-foreground">Total Amount:</span>
              <span className="text-2xl font-bold text-accent">
                {displayNaira(total)}
              </span>
            </div>
          </div>
          <p className="text-sm text-foreground/60">
            Order ID: <span className="font-mono font-semibold">{orderData.orderId}</span>
          </p>
        </motion.div>

        {/* Bank Details */}
        <motion.div
          className="bg-card rounded-lg border border-border p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-playfair font-bold text-foreground mb-6">
            Bank Transfer Details
          </h2>
          <div className="space-y-4 mb-8">
            <div>
              <p className="text-sm text-foreground/60 mb-2">Account Name</p>
              <p className="text-lg font-semibold text-foreground">
                {BANK_DETAILS.accountName}
              </p>
            </div>
            <div>
              <p className="text-sm text-foreground/60 mb-2">Bank Name</p>
              <p className="text-lg font-semibold text-foreground">
                {BANK_DETAILS.bankName}
              </p>
            </div>
            <div>
              <p className="text-sm text-foreground/60 mb-2">Account Number</p>
              <div className="flex items-center gap-3">
                <p className="text-lg font-mono font-bold text-accent">
                  {BANK_DETAILS.accountNumber}
                </p>
                <motion.button
                  onClick={copyAccountNumber}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <Copy size={20} className="text-foreground" />
                </motion.button>
              </div>
              {copied && (
                <motion.p
                  className="text-sm text-green-600 mt-2 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <CheckCircle size={16} />
                  Account number copied successfully
                </motion.p>
              )}
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm text-foreground">
                <p className="font-semibold mb-1">Important:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Transfer the exact amount shown above</li>
                  <li>After transfer, please wait 2-3 minutes</li>
                  <li>Then submit the payment confirmation below</li>
                  <li>We will verify your payment within 24 hours</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Confirmation Button */}
          <motion.button
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            whileTap={{ scale: 0.98 }}
          >
            {showPaymentForm ? 'Hide Payment Form' : 'I HAVE MADE PAYMENT'}
          </motion.button>
        </motion.div>

        {/* Payment Confirmation Form */}
        {showPaymentForm && (
          <motion.div
            className="bg-card rounded-lg border border-border p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-playfair font-bold text-foreground mb-6">
              Payment Confirmation
            </h2>

            {successMessage && (
              <motion.div
                className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-800">{successMessage}</p>
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800">{errorMessage}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmitPayment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="+234..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Transaction Reference Number
                </label>
                <input
                  type="text"
                  name="transactionReference"
                  value={formData.transactionReference}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Reference from your bank"
                />
                <p className="text-xs text-foreground/60 mt-2">
                  You can find this on your bank receipt or transfer confirmation
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Payment Screenshot
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-secondary/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label htmlFor="screenshot-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-accent" />
                    <p className="text-sm font-semibold text-foreground">
                      {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-foreground/60">PNG, JPG up to 10MB</p>
                  </label>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Payment Confirmation'}
              </motion.button>
            </form>

            <p className="text-xs text-foreground/60 text-center mt-6">
              Our team will verify your payment and update your order status within 24 hours.
            </p>
          </motion.div>
        )}

        {/* Back to Shop Link */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-semibold"
          >
            ← Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
