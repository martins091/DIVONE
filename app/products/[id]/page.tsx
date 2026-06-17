'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, ArrowLeft, Truck, Shield, RefreshCw } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { displayNaira } from '@/lib/currency';

interface Product {
  id: string;
  _id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviewCount: number;
  description: string;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  category: string;
  isNew: boolean;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  // Unwrap params using React.use()
  const { id } = React.use(params);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products?id=${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Product not found');
        }

        const fetchedProduct = data.product || data.products?.find((p: any) => p.id === id || p._id === id);
        
        if (!fetchedProduct) {
          throw new Error('Product not found');
        }

        // Map the product to match our interface
        const mappedProduct: Product = {
          id: fetchedProduct.id || fetchedProduct._id,
          _id: fetchedProduct._id,
          name: fetchedProduct.name,
          price: fetchedProduct.price / 1000,
          originalPrice: fetchedProduct.originalPrice ? fetchedProduct.originalPrice / 1000 : null,
          rating: fetchedProduct.rating || 5,
          reviewCount: fetchedProduct.reviewCount || Math.floor(Math.random() * 100) + 10,
          description: fetchedProduct.description,
          image: fetchedProduct.image?.startsWith('linear') 
            ? null
            : fetchedProduct.image || `https://via.placeholder.com/600x800?text=${encodeURIComponent(fetchedProduct.name)}`,
          images: fetchedProduct.images || [],
          sizes: fetchedProduct.sizes || ['S', 'M', 'L', 'XL'],
          colors: fetchedProduct.colors || ['Black', 'White', 'Navy'],
          stock: fetchedProduct.stock || 10,
          category: fetchedProduct.category,
          isNew: fetchedProduct.isNew || !fetchedProduct.originalPrice,
        };
        
        setProduct(mappedProduct);
        setSelectedSize(mappedProduct.sizes?.[0] || 'One Size');
        setSelectedColor(mappedProduct.colors?.[0] || 'Default');
        setActiveImage(0); // Reset to first image
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error instanceof Error ? error.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available in stock!`);
      return;
    }

    addToCart({
      _id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      price: product.price * 1000,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.image || '',
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const getPlaceholderGradient = () => {
    switch(product?.category) {
      case 'Evening Wear': return 'from-amber-400/20 to-rose-400/20';
      case 'Casual Chic': return 'from-rose-400/20 to-amber-400/20';
      case 'Accessories': return 'from-gray-600/20 to-amber-400/20';
      default: return 'from-gray-400/20 to-amber-400/20';
    }
  };

  // Get the current image to display
  const getCurrentImage = () => {
    if (!product) return null;
    
    // If we have images array and it's not empty, use it
    if (product.images && product.images.length > 0) {
      return product.images[activeImage] || product.image;
    }
    
    // Fallback to main image
    return product.image;
  };

  // Get all available images (main + additional)
  const getAllImages = () => {
    if (!product) return [];
    
    const allImages = [];
    
    // Add main image if it exists and is valid
    if (product.image && !product.image.startsWith('linear') && !product.image.includes('placeholder')) {
      allImages.push(product.image);
    }
    
    // Add additional images
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        if (img && !allImages.includes(img)) {
          allImages.push(img);
        }
      });
    }
    
    return allImages;
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-6">{error || 'Product not found'}</p>
          <Link href="/shop" className="text-accent hover:text-accent/80 inline-flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const unitPrice = product.price * 1000;
  const totalPrice = unitPrice * quantity;
  const unitOriginalPrice = product.originalPrice ? product.originalPrice * 1000 : null;
  const totalOriginalPrice = unitOriginalPrice ? unitOriginalPrice * quantity : null;
  const savingsPerUnit = product.originalPrice ? product.originalPrice - product.price : 0;
  const totalSavings = savingsPerUnit * 1000 * quantity;
  const discountPercent = product.originalPrice ? Math.round((savingsPerUnit / product.originalPrice) * 100) : 0;

  const currentImage = getCurrentImage();
  const allImages = getAllImages();

  return (
    <div className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-accent transition-colors text-sm">
            <ArrowLeft size={16} />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${getPlaceholderGradient()} aspect-square`}>
              {currentImage && currentImage.startsWith('http') ? (
                <img 
                  src={currentImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl font-serif text-gray-400">{product.name.charAt(0)}</span>
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {discountPercent > 0 && (
                  <span className="px-3 py-1 bg-accent text-white text-sm font-medium rounded-full">
                    -{discountPercent}%
                  </span>
                )}
                {product.isNew && (
                  <span className="px-3 py-1 bg-black/80 backdrop-blur text-white text-sm font-medium rounded-full">
                    NEW
                  </span>
                )}
              </div>

              {/* Image counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                  {activeImage + 1} / {allImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail images - Show ALL available images */}
            {allImages.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`min-w-[80px] w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === idx ? 'border-accent shadow-lg' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    {img.startsWith('http') ? (
                      <img 
                        src={img} 
                        alt={`${product.name} - view ${idx + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-400">{idx + 1}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Category */}
            <div>
              <span className="text-accent text-sm font-medium tracking-wide uppercase">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className={i < product.rating ? 'fill-accent text-accent' : 'text-gray-300'} 
                  />
                ))}
              </div>
              <span className="text-foreground/50 text-sm">
                {product.reviewCount} reviews
              </span>
              <span className="text-foreground/30">|</span>
              <span className="text-green-600 text-sm">In Stock ({product.stock} units)</span>
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-100 py-6">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-bold text-foreground">
                  {displayNaira(totalPrice)}
                </span>
                {totalOriginalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {displayNaira(totalOriginalPrice)}
                    </span>
                    <span className="text-accent font-medium">
                      Save {displayNaira(totalSavings)}
                    </span>
                  </>
                )}
              </div>
              {quantity > 1 && (
                <p className="text-sm text-gray-400 mt-1">
                  Unit price: {displayNaira(unitPrice)}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Tax included. Free shipping on orders over ₦500,000
              </p>
            </div>

            {/* Subtotal preview */}
            {quantity > 1 && (
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  Subtotal for {quantity} {quantity === 1 ? 'item' : 'items'}: <span className="font-bold">{displayNaira(totalPrice)}</span>
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-foreground/70 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'One Size' && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-foreground">Select Size</h3>
                  <button className="text-accent text-sm hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[60px] h-12 px-4 rounded-lg border-2 transition-all font-medium ${
                        selectedSize === size
                          ? 'border-accent bg-accent text-white'
                          : 'border-gray-200 hover:border-accent text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && product.colors[0] !== 'Default' && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Select Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedColor === color
                          ? 'border-accent bg-accent text-white'
                          : 'border-gray-200 hover:border-accent text-gray-700'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors text-lg"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors text-lg"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-4 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    product.stock === 0
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-accent text-white hover:bg-accent/90'
                  }`}
                >
                  <ShoppingBag size={20} />
                  {product.stock === 0 
                    ? 'Out of Stock' 
                    : addedToCart 
                      ? 'Added to Cart!' 
                      : `Add to Cart - ${displayNaira(totalPrice)}`
                  }
                </button>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:text-red-500 transition-all"
                >
                  <Heart
                    size={20}
                    className={isFavorite ? 'fill-red-500 text-red-500' : ''}
                  />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-gray-100 pt-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <Truck className="w-5 h-5 text-accent mx-auto mb-2" />
                <p className="text-xs text-gray-500">Free Shipping</p>
                <p className="text-xs text-gray-400">On orders over ₦500k</p>
              </div>
              <div className="text-center">
                <Shield className="w-5 h-5 text-accent mx-auto mb-2" />
                <p className="text-xs text-gray-500">Secure Payment</p>
                <p className="text-xs text-gray-400">100% protected</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-5 h-5 text-accent mx-auto mb-2" />
                <p className="text-xs text-gray-500">Easy Returns</p>
                <p className="text-xs text-gray-400">30 days return</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}