'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const collections = [
  {
    title: 'Evening Wear',
    description: 'Timeless elegance for special occasions',
    image: 'linear-gradient(135deg, #D4AF37 0%, #F8F5F0 100%)',
  },
  {
    title: 'Casual Chic',
    description: 'Comfortable yet refined daily fashion',
    image: 'linear-gradient(135deg, #E8C4C4 0%, #F8F5F0 100%)',
  },
  {
    title: 'Accessories',
    description: 'Complete your look with luxury details',
    image: 'linear-gradient(135deg, #1A1A1A 0%, #D4AF37 100%)',
  },
];

export default function Collections() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-accent font-medium mb-4 uppercase tracking-widest">Our Collections</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            Curated Collections
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Explore our handpicked selections designed for the modern woman who appreciates quality and style.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Link href={`/shop?category=${collection.title.toLowerCase().replace(' ', '-')}`}>
                <div className="relative h-80 rounded-lg overflow-hidden group cursor-pointer">
                  <div
                    className="absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                    style={{ background: collection.image }}
                  />
                  
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
                  
                  <div className="relative h-full flex flex-col items-center justify-center text-center">
                    <h3 className="font-serif text-3xl font-bold text-white mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-white/80 mb-6">{collection.description}</p>
                    <span className="inline-flex items-center text-white font-medium group-hover:gap-2 gap-1 transition-all">
                      Explore
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
