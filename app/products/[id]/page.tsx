'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { displayNaira } from '@/lib/currency';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  // Mock product data
  const product = {
    id: params.id,
    name: 'Silk Evening Gown',
    price: 450,
    originalPrice: 550,
    rating: 5,
    reviews: 12,
    description: 'An exquisite silk evening gown crafted from the finest materials. This stunning piece features delicate draping and timeless elegance, perfect for any special occasion.',
    image: 'linear-gradient(135deg, #D4AF37 0%, #E8C4C4 100%)',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Ivory', 'Navy', 'Blush'],
    details: [
      'Made from 100% premium silk',
      'Hand-finished details',
      'Fully lined',
      'Invisible zipper',
      'Available in 4 colors',
      'Care: Dry clean only'
    ]
  };

  const handleAddToCart = () => {
    const cartItem = {
      _id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor
    };
    addToCart(cartItem);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="pt-32 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 mb-8">
          <ArrowLeft size={20} />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            className="h-96 md:h-full rounded-lg overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ background: product.image }}
          />

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-between"
          >
            {/* Title & Rating */}
            <div>
              <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex gap-1">
                  {[...Array(product.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-foreground/60">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-3xl font-bold text-foreground">{displayNaira(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-foreground/50 line-through">
                      {displayNaira(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-accent font-medium">Save {displayNaira(product.originalPrice! - product.price)}</p>
              </div>

              {/* Description */}
              <p className="text-foreground/70 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Size</h3>
                <div className="flex gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded border-2 transition-all flex items-center justify-center font-medium ${
                        selectedSize === size
                          ? 'border-accent bg-accent text-accent-foreground'
                          : 'border-border hover:border-accent'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-3">Color</h3>
                <div className="flex gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded border-2 transition-all ${
                        selectedColor === color
                          ? 'border-accent bg-accent text-accent-foreground'
                          : 'border-border hover:border-accent text-foreground'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex items-center gap-4 border border-border rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-secondary/50 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-secondary/50 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 border border-border rounded hover:bg-secondary/50 transition-colors"
                >
                  <Heart
                    size={20}
                    className={isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'}
                  />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-accent text-accent-foreground font-semibold rounded hover:bg-accent/90 transition-all flex items-center justify-center gap-2 group"
              >
                <ShoppingBag size={20} />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              <button className="w-full py-4 border-2 border-foreground text-foreground font-semibold rounded hover:bg-foreground hover:text-background transition-all">
                Buy Now
              </button>
            </div>
          </motion.div>
        </div>

        {/* Product Details Section */}
        <motion.div
          className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-lg p-8 border border-border">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Product Details</h2>
            <ul className="space-y-3">
              {product.details.map((detail, index) => (
                <li key={index} className="flex gap-3 text-foreground/70">
                  <span className="text-accent font-bold">✓</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg p-8 border border-border">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Shipping & Returns</h2>
            <div className="space-y-4 text-foreground/70">
              <p>Free shipping on orders over $150 within the continental US.</p>
              <p>Easy 30-day returns. We want you to be completely satisfied with your purchase.</p>
              <p>All items come beautifully packaged with care instructions.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
