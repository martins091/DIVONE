'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, PackageSearch, ReceiptText, ShieldCheck } from 'lucide-react';

export default function TrackOrderCta() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center border border-gray-100 rounded-2xl p-6 sm:p-8 bg-gray-50"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-5">
              <PackageSearch className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-medium tracking-wide">TRACK YOUR ORDER</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Check your delivery status anytime
            </h2>
            <p className="text-foreground/60 leading-relaxed max-w-2xl">
              Use your order number with the email or phone number from checkout to reopen your tracking page.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ReceiptText className="w-5 h-5 text-accent" />
              <span>Order number required</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <span>Email or phone verification</span>
            </div>
            <Link
              href="/track-order"
              className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Track your order
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
