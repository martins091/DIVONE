'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import { useState } from 'react';
import { displayNaira } from '@/lib/currency';

const products = [
  {
    id: 1,
    name: 'Silk Evening Gown',
    price: 450,
    originalPrice: 550,
    rating: 5,
    reviews: 12,
    category: 'Evening Wear',
    image: 'linear-gradient(135deg, #D4AF37 0%, #E8C4C4 100%)',
  },
  {
    id: 2,
    name: 'Classic Wool Blazer',
    price: 320,
    originalPrice: 400,
    rating: 5,
    reviews: 8,
    category: 'Casual Chic',
    image: 'linear-gradient(135deg, #E8C4C4 0%, #F8F5F0 100%)',
  },
  {
    id: 3,
    name: 'Leather Structured Bag',
    price: 380,
    originalPrice: null,
    rating: 5,
    reviews: 15,
    category: 'Accessories',
    image: 'linear-gradient(135deg, #1A1A1A 0%, #D4AF37 100%)',
  },
  {
    id: 4,
    name: 'Premium Cashmere Scarf',
    price: 180,
    originalPrice: 220,
    rating: 4,
    reviews: 5,
    category: 'Accessories',
    image: 'linear-gradient(135deg, #F8F5F0 0%, #E8C4C4 100%)',
  },
];

export default function FeaturedProducts() {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-accent font-medium mb-4 uppercase tracking-widest">New Arrivals</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            Featured Pieces
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={`/products/${product.id}`}>
                <div className="relative h-64 rounded-lg overflow-hidden mb-4 group-hover:shadow-xl transition-shadow duration-300">
                  <div
                    className="absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                    style={{ background: product.image }}
                  />
                  
                  {product.originalPrice && (
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded text-sm font-medium">
                      Sale
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(product.id);
                    }}
                    className="absolute top-4 left-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                  >
                    <Heart
                      size={20}
                      className={favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-foreground'}
                    />
                  </button>
                </div>

                <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(product.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-sm text-foreground/60">({product.reviews})</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{displayNaira(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-foreground/50 line-through">
                      {displayNaira(product.originalPrice)}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link href="/shop" className="inline-block px-8 py-3 bg-foreground text-background font-medium rounded hover:bg-foreground/90 transition-colors">
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
