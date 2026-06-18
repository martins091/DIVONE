'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, Filter, Grid3x3, LayoutGrid, X, ShoppingBag, Eye } from 'lucide-react';
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
  // NEW FIELDS
  isSold?: boolean;
  status?: string;
  soldDate?: string | null;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();

        if (response.ok && data.products) {
          // Map the API response to our product format
          const mappedProducts = data.products.map((p: any) => ({
            id: p.id || p._id,
            _id: p._id,
            name: p.name,
            price: p.price / 1000, // Convert from 450000 to 450 for display
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
            // NEW FIELDS
            isSold: p.isSold || false,
            status: p.status || 'available',
            soldDate: p.soldDate || null,
          }));
          
          setProducts(mappedProducts);
          setFilteredProducts(mappedProducts);
        } else {
          throw new Error('Failed to load products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(p => 
        p.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory ||
        p.category.toLowerCase().includes(selectedCategory.replace('-', ' '))
      );
    }
    
    // Filter by price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, sortBy, priceRange]);

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'Evening-Wear', name: 'Evening Wear', count: products.filter(p => p.category === 'Evening Wear').length },
    { id: 'Casual-Chic', name: 'Casual Chic', count: products.filter(p => p.category === 'Casual Chic').length },
    { id: 'Accessories', name: 'Accessories', count: products.filter(p => p.category === 'Accessories').length },
  ];

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 1000000]);
    setSortBy('newest');
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

  return (
    <div className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Our Collection
          </h1>
          <div className="w-20 h-0.5 bg-accent mx-auto mb-6" />
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Discover timeless pieces crafted for the discerning woman
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Desktop */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="sticky top-32 space-y-6">
              {/* Categories */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                  <Filter size={18} className="text-accent" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex justify-between items-center px-4 py-2 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? 'bg-accent text-white'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className={`text-xs ${selectedCategory === category.id ? 'text-white/80' : 'text-gray-400'}`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-serif text-lg font-semibold mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{displayNaira(priceRange[0] * 1000)}</span>
                    <span>{displayNaira(priceRange[1] * 1000)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-accent"
                  />
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-white rounded-2xl p-4 mb-8 shadow-sm border border-gray-100 flex flex-wrap justify-between items-center gap-4"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <Filter size={18} />
                  Filters
                </button>
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-accent text-white' : 'hover:bg-gray-50'}`}
                  >
                    <Grid3x3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-accent text-white' : 'hover:bg-gray-50'}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </motion.div>

            {/* Active Filters */}
            {(selectedCategory !== 'all' || priceRange[1] < 1000000) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition"
                  >
                    {selectedCategory.replace('-', ' ')}
                    <X size={14} />
                  </button>
                )}
                {priceRange[1] < 1000000 && (
                  <button
                    onClick={() => setPriceRange([0, 1000000])}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition"
                  >
                    Under {displayNaira(priceRange[1])}
                    <X size={14} />
                  </button>
                )}
                <button
                  onClick={clearFilters}
                  className="text-accent text-sm hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products Grid/List */}
            {loading ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-foreground/60">Loading exquisite pieces...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-foreground/60">No products found.</p>
                <button onClick={clearFilters} className="mt-4 text-accent hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
              }>
                {filteredProducts.map((product, index) => {
                  // Check if product is sold
                  const isSold = product.isSold || product.status === 'sold' || product.stock === 0;
                  
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                      className={`${viewMode === 'list' ? "flex gap-6 bg-white rounded-xl p-4 shadow-sm" : ""} ${
                        isSold ? 'opacity-75' : ''
                      }`}
                    >
                      <Link href={`/products/${product.id}`} className={viewMode === 'list' ? "flex-1 flex gap-6" : "block"}>
                        {/* Product Image */}
                        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${getPlaceholderColor(product.category)} group ${
                          viewMode === 'grid' ? 'aspect-[3/4]' : 'w-48 h-48 flex-shrink-0'
                        }`}>
                          {product.image && product.image.startsWith('http') ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                                isSold ? 'grayscale' : ''
                              }`}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl font-serif text-gray-400">{product.name.charAt(0)}</span>
                            </div>
                          )}
                          
                          {/* SOLD Badge - Large Overlay */}
                          {isSold && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="bg-red-600/90 text-white px-6 py-3 rounded-lg font-bold text-2xl shadow-2xl transform -rotate-12 border-2 border-red-400">
                                SOLD OUT
                              </div>
                            </div>
                          )}
                          
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.originalPrice && !isSold && (
                              <span className="px-2 py-1 bg-accent text-white text-xs font-medium rounded">
                                SALE
                              </span>
                            )}
                            {product.isNew && !isSold && (
                              <span className="px-2 py-1 bg-black/80 backdrop-blur text-white text-xs font-medium rounded">
                                NEW
                              </span>
                            )}
                            {isSold && (
                              <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded flex items-center gap-1">
                                <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse" />
                                SOLD
                              </span>
                            )}
                          </div>

                          {/* Wishlist Button - Hide for sold items */}
                          {!isSold && (
                            <button
                              onClick={(e) => toggleFavorite(e, product.id)}
                              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition transform hover:scale-110"
                            >
                              <Heart
                                size={16}
                                className={favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}
                              />
                            </button>
                          )}

                          {/* Quick View Overlay - Hide for sold items */}
                          {!isSold && (
                            <div className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-3 transition-all duration-300 ${
                              hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                            }`}>
                              <button className="p-2 bg-white rounded-full hover:bg-accent hover:text-white transition">
                                <Eye size={18} />
                              </button>
                              <button className="p-2 bg-white rounded-full hover:bg-accent hover:text-white transition">
                                <ShoppingBag size={18} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className={`mt-4 ${viewMode === 'list' ? 'flex-1 mt-0' : ''}`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className={`font-serif text-lg font-semibold mb-1 transition line-clamp-1 ${
                                isSold ? 'text-gray-400 line-through' : 'text-foreground group-hover:text-accent'
                              }`}>
                                {product.name}
                              </h3>
                              {isSold && (
                                <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                                  Currently Unavailable
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < product.rating ? 'fill-accent text-accent' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">({product.reviewCount})</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-xl font-bold ${
                              isSold ? 'text-gray-400' : 'text-foreground'
                            }`}>
                              {displayNaira(product.price * 1000)}
                            </span>
                            {product.originalPrice && !isSold && (
                              <span className="text-sm text-gray-400 line-through">
                                {displayNaira(product.originalPrice * 1000)}
                              </span>
                            )}
                          </div>

                          {viewMode === 'list' && !isSold && (
                            <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                          
                          {viewMode === 'list' && isSold && (
                            <p className="text-red-500 text-sm mt-2 font-medium">
                              This item has been sold out.
                            </p>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-2">
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowFilters(false);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded ${
                        selectedCategory === category.id ? 'bg-accent text-white' : 'hover:bg-gray-50'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Price Range</h4>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-accent"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}