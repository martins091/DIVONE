'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';
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
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format',
  },
  {
    id: 2,
    name: 'Classic Wool Blazer',
    price: 320,
    originalPrice: 400,
    rating: 5,
    reviews: 8,
    category: 'Casual Chic',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format',
  },
  {
    id: 3,
    name: 'Leather Structured Bag',
    price: 380,
    originalPrice: null,
    rating: 5,
    reviews: 15,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format',
  },
  {
    id: 4,
    name: 'Premium Cashmere Scarf',
    price: 180,
    originalPrice: 220,
    rating: 4,
    reviews: 5,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format',
  },
  {
    id: 5,
    name: 'Designer Heels',
    price: 520,
    originalPrice: 650,
    rating: 5,
    reviews: 10,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format',
  },
];

export default function FeaturedProducts() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Bestsellers
          </h2>
          <div className="w-20 h-0.5 bg-accent mx-auto mb-6" />
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Our most loved pieces, curated just for you
          </p>
        </motion.div>

        {/* Carousel Navigation */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-gray-300 hover:bg-accent hover:border-accent hover:text-white transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-gray-300 hover:bg-accent hover:border-accent hover:text-white transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Products Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="min-w-[280px] sm:min-w-[300px] lg:min-w-[320px] snap-start"
            >
              <Link href={`/products/${product.id}`}>
                <div className="group">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {product.originalPrice && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-white text-xs font-medium rounded-full">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    )}

                    <button
                      onClick={(e) => toggleFavorite(e, product.id)}
                      className="absolute top-4 right-4 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                    >
                      <Heart
                        size={18}
                        className={favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-foreground'}
                      />
                    </button>

                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button className="w-full py-3 bg-white text-foreground rounded-lg font-medium hover:bg-accent hover:text-white transition-colors flex items-center justify-center gap-2">
                        <ShoppingBag size={18} />
                        Quick Add
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-accent font-medium mb-1">{product.category}</p>
                    <h3 className="font-serif font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < product.rating ? 'fill-accent text-accent' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-foreground/50">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {displayNaira(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-foreground/40 line-through">
                          {displayNaira(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}