'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, Filter } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviews: number;
  image: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock products data
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Silk Evening Gown',
        price: 450,
        originalPrice: 550,
        category: 'Evening Wear',
        rating: 5,
        reviews: 12,
        image: 'linear-gradient(135deg, #D4AF37 0%, #E8C4C4 100%)',
      },
      {
        id: '2',
        name: 'Classic Wool Blazer',
        price: 320,
        originalPrice: 400,
        category: 'Casual Chic',
        rating: 5,
        reviews: 8,
        image: 'linear-gradient(135deg, #E8C4C4 0%, #F8F5F0 100%)',
      },
      {
        id: '3',
        name: 'Leather Structured Bag',
        price: 380,
        category: 'Accessories',
        rating: 5,
        reviews: 15,
        image: 'linear-gradient(135deg, #1A1A1A 0%, #D4AF37 100%)',
      },
      {
        id: '4',
        name: 'Premium Cashmere Scarf',
        price: 180,
        originalPrice: 220,
        category: 'Accessories',
        rating: 4,
        reviews: 5,
        image: 'linear-gradient(135deg, #F8F5F0 0%, #E8C4C4 100%)',
      },
      {
        id: '5',
        name: 'Tailored Midi Dress',
        price: 380,
        originalPrice: 480,
        category: 'Evening Wear',
        rating: 5,
        reviews: 10,
        image: 'linear-gradient(135deg, #E8C4C4 0%, #D4AF37 100%)',
      },
      {
        id: '6',
        name: 'Designer Heels',
        price: 280,
        category: 'Accessories',
        rating: 5,
        reviews: 20,
        image: 'linear-gradient(135deg, #1A1A1A 0%, #E8C4C4 100%)',
      },
      {
        id: '7',
        name: 'Linen Summer Blouse',
        price: 150,
        originalPrice: 200,
        category: 'Casual Chic',
        rating: 4,
        reviews: 7,
        image: 'linear-gradient(135deg, #F8F5F0 0%, #D4AF37 100%)',
      },
      {
        id: '8',
        name: 'Luxury Watch',
        price: 520,
        category: 'Accessories',
        rating: 5,
        reviews: 18,
        image: 'linear-gradient(135deg, #D4AF37 0%, #1A1A1A 100%)',
      },
    ];

    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category.toLowerCase().replace(' ', '-') === selectedCategory);

  const categories = ['all', 'evening-wear', 'casual-chic', 'accessories'];

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  return (
    <div className="pt-32 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-5xl font-bold text-foreground mb-4">
            Shop All Collections
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl">
            Explore our complete range of luxury fashion pieces curated for the modern woman.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <motion.div
            className="lg:sticky lg:top-32 h-fit"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg p-6 border border-border">
              <div className="flex items-center gap-2 mb-6">
                <Filter size={20} className="text-accent" />
                <h3 className="font-serif text-lg font-semibold">Filters</h3>
              </div>

              <div className="space-y-3">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded transition-all ${
                      selectedCategory === category
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-secondary/50 text-foreground'
                    }`}
                  >
                    {category === 'all' ? 'All Products' : category.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="font-semibold mb-4">Price Range</h4>
                <input type="range" min="0" max="1000" className="w-full" />
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-foreground/60">Loading products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
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
                        <span className="font-bold text-foreground">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-foreground/50 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
