'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Check } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Stay Connected
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive updates, early access to collections, and special offers reserved for our VIP members.
          </p>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-foreground/50" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-primary-foreground/10 text-primary-foreground placeholder-primary-foreground/60 rounded border border-primary-foreground/30 focus:outline-none focus:border-primary-foreground transition-colors"
                />
              </div>
              <button
                type="submit"
                className={`px-8 py-4 font-semibold rounded transition-all flex items-center justify-center gap-2 ${
                  submitted
                    ? 'bg-green-500 text-white'
                    : 'bg-accent text-accent-foreground hover:bg-accent/90'
                }`}
              >
                {submitted ? (
                  <>
                    <Check size={20} />
                    Subscribed!
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
          </motion.form>

          <p className="text-sm text-primary-foreground/60 mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
