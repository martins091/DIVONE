'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Check, Sparkles, Gift, Shield, Send, Crown } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Gold Border Effect */}
          <div className="absolute inset-0 rounded-3xl border border-accent/20 pointer-events-none" />
          
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-accent/5" />

          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-accent/20 to-transparent rounded-tr-3xl" />

          <div className="relative p-8 md:p-12 text-center">
            {/* VIP Badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6"
            >
              <Crown className="w-4 h-4 text-accent" />
              <span className="text-accent text-xs font-bold tracking-wider">VIP ACCESS</span>
            </motion.div>

            {/* Title */}
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
              Subscribe & Get <span className="text-accent">20% Off</span>
            </h2>
            
            {/* Subtitle */}
            <p className="text-white/60 text-base md:text-lg mb-8 max-w-md mx-auto">
              Join our community and receive exclusive offers, early access, and style inspiration.
            </p>

            {/* Perks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[
                { text: '20% off first order', icon: Gift },
                { text: 'Early access to sales', icon: Sparkles },
                { text: 'Exclusive VIP events', icon: Crown },
              ].map((perk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center gap-2 text-white/70 text-sm"
                >
                  <perk.icon className="w-4 h-4 text-accent" />
                  <span>{perk.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white/5 text-white placeholder-white/40 rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className={`px-6 py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                    submitted
                      ? 'bg-green-500 text-white'
                      : 'bg-accent text-black hover:bg-accent/90 hover:scale-105'
                  }`}
                >
                  {submitted ? (
                    <>
                      <Check size={18} />
                      Subscribed
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Subscribe
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Guarantee */}
            <p className="text-white/30 text-xs mt-6 flex items-center justify-center gap-1">
              <Shield size={12} />
              We respect your privacy. No spam, ever.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}