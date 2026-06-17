'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { displayNaira } from '@/lib/currency';

interface Product {
  id: string;
  _id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  description: string;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch featured products first
        const featuredResponse = await fetch('/api/products?featured=true');
        const featuredData = await featuredResponse.json();

        let allProducts: Product[] = [];

        if (featuredResponse.ok && featuredData.products) {
          // Map featured products
          const mappedFeatured = featuredData.products.map((p: any) => ({
            id: p.id || p._id,
            _id: p._id,
            name: p.name,
            price: p.price / 1000,
            originalPrice: p.originalPrice ? p.originalPrice / 1000 : null,
            category: p.category,
            rating: p.rating || 5,
            reviewCount: p.reviewCount || Math.floor(Math.random() * 100) + 10,
            image: p.image && p.image.startsWith('linear') 
              ? `https://via.placeholder.com/600x800?text=${encodeURIComponent(p.name)}`
              : p.image || `https://via.placeholder.com/600x800?text=${encodeURIComponent(p.name)}`,
            images: p.images || [],
            sizes: p.sizes || ['S', 'M', 'L'],
            colors: p.colors || ['Default'],
            stock: p.stock || 10,
            isNew: p.isNew || !p.originalPrice,
            isFeatured: p.isFeatured || false,
            description: p.description,
          }));

          allProducts = [...mappedFeatured];
        }

        // If we have fewer than 4 featured products, fetch additional products
        if (allProducts.length < 4) {
          const limit = Math.max(8 - allProducts.length, 4);
          const recentResponse = await fetch(`/api/products?limit=${limit}&sort=createdAt:desc`);
          const recentData = await recentResponse.json();

          if (recentResponse.ok && recentData.products) {
            const mappedRecent = recentData.products.map((p: any) => ({
              id: p.id || p._id,
              _id: p._id,
              name: p.name,
              price: p.price / 1000,
              originalPrice: p.originalPrice ? p.originalPrice / 1000 : null,
              category: p.category,
              rating: p.rating || 5,
              reviewCount: p.reviewCount || Math.floor(Math.random() * 100) + 10,
              image: p.image && p.image.startsWith('linear') 
                ? `https://via.placeholder.com/600x800?text=${encodeURIComponent(p.name)}`
                : p.image || `https://via.placeholder.com/600x800?text=${encodeURIComponent(p.name)}`,
              images: p.images || [],
              sizes: p.sizes || ['S', 'M', 'L'],
              colors: p.colors || ['Default'],
              stock: p.stock || 10,
              isNew: p.isNew || !p.originalPrice,
              isFeatured: p.isFeatured || false,
              description: p.description,
            }));

            // Merge and deduplicate
            const existingIds = new Set(allProducts.map(p => p.id));
            const newProducts = mappedRecent.filter((p: Product) => !existingIds.has(p.id));
            allProducts = [...allProducts, ...newProducts];
          }
        }

        // Sort: Featured first, then by date
        allProducts.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });

        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  // Get color for gradient placeholder based on category
  const getPlaceholderColor = (category: string) => {
    switch(category) {
      case 'Evening Wear': return 'from-amber-400/20 to-rose-400/20';
      case 'Casual Chic': return 'from-rose-400/20 to-amber-400/20';
      case 'Accessories': return 'from-gray-600/20 to-amber-400/20';
      default: return 'from-gray-400/20 to-amber-400/20';
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Bestsellers
            </h2>
            <div className="w-20 h-0.5 bg-accent mx-auto mb-6" />
          </div>
          <div className="flex gap-6 overflow-x-auto pb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="min-w-[280px] sm:min-w-[300px] lg:min-w-[320px] snap-start">
                <div className="aspect-[3/4] rounded-xl bg-gray-200 animate-pulse" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mx-auto" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-40 mx-auto" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Bestsellers
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Bestsellers
          </h2>
          <p className="text-foreground/60">No products available.</p>
        </div>
      </section>
    );
  }

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
          {products.map((product, index) => {
            // Calculate discount percentage if originalPrice exists
            const discountPercentage = product.originalPrice 
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : null;

            return (
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
                    <div className={`relative aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br ${getPlaceholderColor(product.category)}`}>
                      {product.image && product.image.startsWith('http') ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl font-serif text-gray-400">{product.name.charAt(0)}</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {discountPercentage && discountPercentage > 0 && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-white text-xs font-medium rounded-full">
                          -{discountPercentage}%
                        </span>
                      )}

                      {product.isNew && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur text-white text-xs font-medium rounded-full">
                          NEW
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
                      <h3 className="font-serif font-semibold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-1">
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
                        <span className="text-xs text-foreground/50">({product.reviewCount})</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg font-bold text-foreground">
                          {displayNaira(product.price * 1000)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-foreground/40 line-through">
                            {displayNaira(product.originalPrice * 1000)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
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