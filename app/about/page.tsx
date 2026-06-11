'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-foreground mb-6 text-balance">
            About Divone Store
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Curating the finest selection of luxury women&apos;s fashion since 2015. We believe in timeless elegance, exceptional quality, and empowering women through style.
          </p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-serif text-4xl font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Divone Store was founded on the belief that luxury fashion should be accessible, personal, and extraordinary. What started as a small curated collection has grown into a destination for discerning women who appreciate quality, craftsmanship, and timeless design.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Every piece in our collection is handpicked by our expert team of stylists and fashion consultants. We partner exclusively with premium brands and emerging designers who share our commitment to excellence and sustainability.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, Divone Store serves hundreds of customers worldwide who trust us to deliver not just products, but an experience—one that celebrates their individuality and style.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-secondary rounded-lg p-12 h-full flex flex-col justify-center"
          >
            <div className="space-y-8">
              <div className="flex gap-4">
                <Heart className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Passion for Fashion</h3>
                  <p className="text-muted-foreground text-sm">We live and breathe luxury fashion, dedicating ourselves to finding the perfect pieces for our customers.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Sparkles className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Quality & Craftsmanship</h3>
                  <p className="text-muted-foreground text-sm">Every item meets our rigorous standards for quality, design, and durability.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Zap className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Expert Curation</h3>
                  <p className="text-muted-foreground text-sm">Our team of stylists curates each collection to ensure timeless elegance and contemporary relevance.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-serif text-4xl font-bold text-foreground text-center mb-12"
          >
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Excellence',
                description: 'We maintain the highest standards in every aspect of our business, from product selection to customer service.'
              },
              {
                title: 'Sustainability',
                description: 'We are committed to ethical sourcing and sustainable practices that respect our planet and communities.'
              },
              {
                title: 'Empowerment',
                description: 'We celebrate individuality and believe fashion is a powerful tool for self-expression and confidence.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <h3 className="font-semibold text-xl text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
    
    </div>
  );
}
