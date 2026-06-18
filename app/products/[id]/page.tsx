'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, ArrowLeft, Truck, Shield, RefreshCw, XCircle } from 'lucide-react';
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
  // NEW FIELDS
  isSold?: boolean;
  status?: string;
  soldDate?: string | null;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetailContent id={params.id} />;
}

// Move all the client-side logic to a separate component
function ProductDetailContent({ id }: { id: string }) {
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
            ? ''
            : fetchedProduct.image || `https://via.placeholder.com/600x800?text=${encodeURIComponent(fetchedProduct.name)}`,
          images: fetchedProduct.images || [],
          sizes: fetchedProduct.sizes || ['S', 'M', 'L', 'XL'],
          colors: fetchedProduct.colors || ['Black', 'White', 'Navy'],
          stock: fetchedProduct.stock || 10,
          category: fetchedProduct.category,
          isNew: fetchedProduct.isNew || !fetchedProduct.originalPrice,
          // NEW FIELDS
          isSold: fetchedProduct.isSold || false,
          status: fetchedProduct.status || 'available',
          soldDate: fetchedProduct.soldDate || null,
        };
        
        setProduct(mappedProduct);
        setSelectedSize(mappedProduct.sizes?.[0] || 'One Size');
        setSelectedColor(mappedProduct.colors?.[0] || 'Default');
        setActiveImage(0);
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

    // Check if product is sold
    if (product.isSold || product.status === 'sold' || product.stock === 0) {
      alert('This product has been sold out!');
      return;
    }

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

  const getCurrentImage = (): string | null => {
    if (!product) return null;
    
    if (product.images && product.images.length > 0) {
      return product.images[activeImage] || product.image;
    }
    
    return product.image;
  };

  const getAllImages = (): string[] => {
    if (!product) return [];
    
    const allImages: string[] = [];
    
    if (product.image && !product.image.startsWith('linear') && !product.image.includes('placeholder')) {
      allImages.push(product.image);
    }
    
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        if (img && !allImages.includes(img)) {
          allImages.push(img);
        }
      });
    }
    
    return allImages;
  };

  // Check if product is sold
  const isProductSold = product?.isSold || product?.status === 'sold' || product?.stock === 0;

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
            <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${getPlaceholderGradient()} aspect-square ${
              isProductSold ? 'opacity-80' : ''
            }`}>
              {currentImage && currentImage.startsWith('http') ? (
                <img 
                  src={currentImage} 
                  alt={product.name} 
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isProductSold ? 'grayscale' : ''
                  }`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl font-serif text-gray-400">{product.name.charAt(0)}</span>
                </div>
              )}
              
              {/* SOLD OUT Overlay */}
              {isProductSold && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-red-600/90 text-white px-8 py-4 rounded-lg font-bold text-3xl shadow-2xl transform -rotate-12 border-2 border-red-400">
                    SOLD OUT
                  </div>
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {discountPercent > 0 && !isProductSold && (
                  <span className="px-3 py-1 bg-accent text-white text-sm font-medium rounded-full">
                    -{discountPercent}%
                  </span>
                )}
                {product.isNew && !isProductSold && (
                  <span className="px-3 py-1 bg-black/80 backdrop-blur text-white text-sm font-medium rounded-full">
                    NEW
                  </span>
                )}
                {isProductSold && (
                  <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    SOLD
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

            {/* Thumbnail images */}
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
                        className={`w-full h-full object-cover ${isProductSold ? 'grayscale' : ''}`}
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
              <h1 className={`font-serif text-3xl md:text-4xl font-bold mt-2 ${
                isProductSold ? 'text-gray-400 line-through' : 'text-foreground'
              }`}>
                {product.name}
              </h1>
              {isProductSold && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    This item has been sold
                  </span>
                </div>
              )}
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
              {isProductSold ? (
                <span className="text-red-600 text-sm font-medium">Sold Out</span>
              ) : (
                <span className="text-green-600 text-sm">In Stock ({product.stock} units)</span>
              )}
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-100 py-6">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className={`text-4xl font-bold ${
                  isProductSold ? 'text-gray-400' : 'text-foreground'
                }`}>
                  {displayNaira(totalPrice)}
                </span>
                {totalOriginalPrice && !isProductSold && (
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
              {quantity > 1 && !isProductSold && (
                <p className="text-sm text-gray-400 mt-1">
                  Unit price: {displayNaira(unitPrice)}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {isProductSold ? 'This item is no longer available for purchase.' : 'Tax included. Free shipping on orders over ₦500,000'}
              </p>
            </div>

            {/* Subtotal preview */}
            {quantity > 1 && !isProductSold && (
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  Subtotal for {quantity} {quantity === 1 ? 'item' : 'items'}: <span className="font-bold">{displayNaira(totalPrice)}</span>
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className={`leading-relaxed ${isProductSold ? 'text-gray-400' : 'text-foreground/70'}`}>
                {product.description}
              </p>
            </div>

            {/* Size Selection - Disable when sold */}
            {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'One Size' && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className={`font-semibold ${isProductSold ? 'text-gray-400' : 'text-foreground'}`}>
                    Select Size
                  </h3>
                  {!isProductSold && (
                    <button className="text-accent text-sm hover:underline">Size Guide</button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => !isProductSold && setSelectedSize(size)}
                      disabled={isProductSold}
                      className={`min-w-[60px] h-12 px-4 rounded-lg border-2 transition-all font-medium ${
                        isProductSold
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                          : selectedSize === size
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

            {/* Color Selection - Disable when sold */}
            {product.colors && product.colors.length > 0 && product.colors[0] !== 'Default' && (
              <div>
                <h3 className={`font-semibold ${isProductSold ? 'text-gray-400' : 'text-foreground'}`}>
                  Select Color
                </h3>
                <div className="flex flex-wrap gap-3 mt-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => !isProductSold && setSelectedColor(color)}
                      disabled={isProductSold}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        isProductSold
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                          : selectedColor === color
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
                <div className={`flex items-center border rounded-lg ${
                  isProductSold ? 'border-gray-200' : 'border-gray-200'
                }`}>
                  <button
                    onClick={() => !isProductSold && setQuantity(Math.max(1, quantity - 1))}
                    disabled={isProductSold}
                    className={`px-4 py-3 transition-colors text-lg ${
                      isProductSold ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'
                    }`}
                  >
                    -
                  </button>
                  <span className={`w-12 text-center font-semibold ${isProductSold ? 'text-gray-400' : ''}`}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => !isProductSold && setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={isProductSold}
                    className={`px-4 py-3 transition-colors text-lg ${
                      isProductSold ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'
                    }`}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isProductSold || product.stock === 0}
                  className={`flex-1 py-4 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    isProductSold || product.stock === 0
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-accent text-white hover:bg-accent/90'
                  }`}
                >
                  <ShoppingBag size={20} />
                  {isProductSold 
                    ? 'Sold Out' 
                    : product.stock === 0 
                      ? 'Out of Stock' 
                      : addedToCart 
                        ? 'Added to Cart!' 
                        : `Add to Cart - ${displayNaira(totalPrice)}`
                  }
                </button>

                <button
                  onClick={() => !isProductSold && setIsFavorite(!isFavorite)}
                  disabled={isProductSold}
                  className={`p-4 border rounded-lg transition-all ${
                    isProductSold 
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'border-gray-200 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Heart
                    size={20}
                    className={isFavorite ? 'fill-red-500 text-red-500' : ''}
                  />
                </button>
              </div>
              
              {isProductSold && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-red-600 text-sm font-medium">
                    This product has been sold out. Check out our other stunning pieces!
                  </p>
                  <Link href="/shop" className="text-accent text-sm font-medium hover:underline inline-block mt-1">
                    Browse other products →
                  </Link>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="border-t border-gray-100 pt-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <Truck className={`w-5 h-5 mx-auto mb-2 ${isProductSold ? 'text-gray-400' : 'text-accent'}`} />
                <p className={`text-xs ${isProductSold ? 'text-gray-400' : 'text-gray-500'}`}>Free Shipping</p>
                <p className={`text-xs ${isProductSold ? 'text-gray-300' : 'text-gray-400'}`}>On orders over ₦500k</p>
              </div>
              <div className="text-center">
                <Shield className={`w-5 h-5 mx-auto mb-2 ${isProductSold ? 'text-gray-400' : 'text-accent'}`} />
                <p className={`text-xs ${isProductSold ? 'text-gray-400' : 'text-gray-500'}`}>Secure Payment</p>
                <p className={`text-xs ${isProductSold ? 'text-gray-300' : 'text-gray-400'}`}>100% protected</p>
              </div>
              <div className="text-center">
                <RefreshCw className={`w-5 h-5 mx-auto mb-2 ${isProductSold ? 'text-gray-400' : 'text-accent'}`} />
                <p className={`text-xs ${isProductSold ? 'text-gray-400' : 'text-gray-500'}`}>Easy Returns</p>
                <p className={`text-xs ${isProductSold ? 'text-gray-300' : 'text-gray-400'}`}>30 days return</p>
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