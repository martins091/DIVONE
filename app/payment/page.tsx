'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, Upload, AlertCircle, ArrowRight, Clock, Banknote, User, Mail, Phone, MapPin, Truck } from 'lucide-react';
import { displayNaira } from '@/lib/currency';
import { supabase } from '@/lib/supabase/client';

const BANK_DETAILS = {
  accountName: 'Ogbaegbe Onyinyechi',
  bankName: 'Fidelity Bank',
  accountNumber: '6150341483',
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const guestAccessToken = searchParams.get('token');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStep, setPaymentStep] = useState<'details' | 'confirm' | 'processing'>('details');
  const total = orderData ? orderData.total : 0;

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        const response = await fetch(`/api/orders/${orderId}${guestAccessToken ? `?token=${guestAccessToken}` : ''}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const result = await response.json();

        if (response.ok) {
          setOrderData(result.order);
          // Check if payment was already confirmed
          if (result.order.status === 'confirmed' ||
              result.order.status === 'processing' ||
              result.order.status === 'shipped' ||
              result.order.status === 'delivered') {
            setPaymentStep('processing');
          }
        } else {
          setErrorMessage('Failed to load order details');
        }
      } catch (error) {
        console.error('Error loading order:', error);
        setErrorMessage('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [orderId, router]);

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentMade = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      const response = await fetch(`/api/orders/${orderId}/payment-confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          guestAccessToken,
          paymentMethod: 'bank_transfer',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to confirm payment');
      }

      setSuccessMessage('Payment confirmed successfully! Redirecting to order tracking...');
      setPaymentStep('processing');
      
      // Wait a moment before redirecting
      setTimeout(() => {
        router.push(`/order-tracking/${orderId}?status=pending${guestAccessToken ? `&token=${guestAccessToken}` : ''}`);
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to confirm payment. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">No Order Found</h1>
          <p className="text-foreground/60 mb-8">We couldn't find the order you're looking for.</p>
          <Link
            href="/shop"
            className="inline-block px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  // If payment is already processing or confirmed
  if (paymentStep === 'processing') {
    return (
      <div className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Payment Confirmed!
            </h1>
            <p className="text-lg text-foreground/70 mb-2">
              Your payment is being verified by our team.
            </p>
            <p className="text-foreground/60 mb-8">
              You'll receive a confirmation email within 24 hours.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  Redirecting to order tracking...
                </p>
              </div>
            </div>
            <Link
              href={`/order-tracking/${orderId}?status=pending${guestAccessToken ? `&token=${guestAccessToken}` : ''}`}
              className="inline-block px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Track Your Order
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Complete Your Payment
          </h1>
          <div className="w-20 h-0.5 bg-accent mx-auto mb-6" />
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Transfer the exact amount to the account below to complete your order
          </p>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800">{successMessage}</p>
          </motion.div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{errorMessage}</p>
          </motion.div>
        )}

        {/* Order Summary */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-border p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-serif text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Banknote className="w-5 h-5 text-accent" />
            Order Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between text-foreground/70">
                <span>Order ID:</span>
                <span className="font-mono font-semibold text-foreground">
                  {orderData?.orderNumber || orderId}
                </span>
              </div>
              <div className="flex justify-between text-foreground/70">
                <span>Items:</span>
                <span className="text-foreground">
                  {orderData?.items?.length || 0} items
                </span>
              </div>
              <div className="flex justify-between text-foreground/70">
                <span>Payment Method:</span>
                <span className="text-foreground">Bank Transfer</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-foreground/70">
                <span>Subtotal:</span>
                <span className="text-foreground">{displayNaira(orderData?.subtotal || 0)}</span>
              </div>
              {/* Tax row REMOVED */}
            </div>
          </div>
          
          <div className="border-t border-border mt-6 pt-6">
            <div className="flex justify-between items-center">
              <span className="font-serif text-lg font-bold text-foreground">Total to Pay Online</span>
              <span className="font-serif text-3xl font-bold text-accent">
                {displayNaira(total)}
              </span>
            </div>
            {/* Delivery payment notice */}
            <div className="mt-3 flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <Truck className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800">
                <span className="font-semibold">📦 Delivery Fee:</span> The delivery fee will be paid in cash 
                directly to the delivery person upon arrival. This fee is not included in your online payment.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Shipping Address */}
        {orderData?.shippingAddress && (
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-border p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="font-serif text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground/60">
                  <User className="w-4 h-4" />
                  <span>
                    {orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-foreground/60">
                  <Mail className="w-4 h-4" />
                  <span>{orderData.shippingAddress.email}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/60">
                  <Phone className="w-4 h-4" />
                  <span>{orderData.shippingAddress.phone}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-foreground/60">
                  {orderData.shippingAddress.street}
                </p>
                <p className="text-foreground/60">
                  {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
                </p>
                <p className="text-foreground/60">
                  {orderData.shippingAddress.country}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bank Details */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-border p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-serif text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Banknote className="w-5 h-5 text-accent" />
            Bank Transfer Details
          </h2>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-8 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-foreground/60">Account Name</span>
              <span className="font-semibold text-foreground">{BANK_DETAILS.accountName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-foreground/60">Bank Name</span>
              <span className="font-semibold text-foreground">{BANK_DETAILS.bankName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/60">Account Number</span>
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono font-bold text-accent">
                  {BANK_DETAILS.accountNumber}
                </span>
                <motion.button
                  onClick={copyAccountNumber}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <Copy size={20} className="text-foreground/60 hover:text-foreground" />
                </motion.button>
              </div>
            </div>
          </div>

          {copied && (
            <motion.div
              className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-sm text-green-700">Account number copied successfully</span>
            </motion.div>
          )}

          {/* Important Notice */}
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-6 mb-6">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm text-foreground/80">
                <p className="font-semibold text-foreground mb-3">⚠️ Important Instructions:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">1.</span>
                    <span>Transfer the <strong>exact amount</strong> shown above (<strong>{displayNaira(total)}</strong>)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">2.</span>
                    <span>Use your <strong>Order ID</strong> ({orderData?.orderNumber || orderId}) as payment reference</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">3.</span>
                    <span>After transfer, click the <strong>"I Have Made Payment"</strong> button below</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">4.</span>
                    <span>You'll be redirected to track your order status</span>
                  </li>
                  <li className="flex items-start gap-2 text-yellow-700">
                    <span className="text-accent font-bold">5.</span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      <strong>Remember:</strong> Delivery fee is paid in cash upon arrival
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Payment Button */}
          <motion.button
            onClick={handlePaymentMade}
            disabled={isSubmitting}
            className="w-full bg-accent text-accent-foreground py-4 rounded-xl font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle size={24} />
                I Have Made Payment
              </>
            )}
          </motion.button>

          <p className="text-xs text-foreground/50 text-center mt-4">
            By clicking this button, you confirm that you have made the transfer to the account above.
            Our team will verify your payment within 24 hours.
          </p>
        </motion.div>

        {/* Need Help */}
        <motion.div
          className="bg-gray-50 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
          <p className="text-sm text-foreground/60 mb-4">
            If you encounter any issues with your payment, please contact our support team.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:support@yourstore.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              Email Support
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Contact Form
            </Link>
          </div>
        </motion.div>

        {/* Back to Shop Link */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium"
          >
            ← Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="pt-32 pb-20 text-center text-foreground/60">Loading payment...</div>}>
      <PaymentContent />
    </Suspense>
  );
}