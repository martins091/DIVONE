'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, PackageSearch, ReceiptText } from 'lucide-react';

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderReference, setOrderReference] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderReference, contact }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Could not find that order');
      }

      const accessToken = result.order.guestAccessToken;
      router.push(`/order-tracking/${result.order.id}${accessToken ? `?token=${accessToken}` : ''}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not find that order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8"
        >
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-5">
              <PackageSearch className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-medium tracking-wide">ORDER TRACKING</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Track your order
            </h1>
            <p className="text-foreground/60 leading-relaxed">
              Enter your order number and the email address or phone number used at checkout.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="orderReference" className="block text-sm font-medium text-gray-700 mb-2">
                Order number
              </label>
              <div className="relative">
                <ReceiptText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="orderReference"
                  type="text"
                  value={orderReference}
                  onChange={(event) => setOrderReference(event.target.value)}
                  placeholder="DIV-123456ABCD"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-foreground"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                Email address or phone number
              </label>
              <input
                id="contact"
                type="text"
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder="you@example.com or 080..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-foreground"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Finding Order...' : 'Track Order'}
              {!isSubmitting && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
