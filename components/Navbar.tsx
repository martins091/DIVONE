'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { cartCount } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-accent-foreground font-serif font-bold text-lg">D</span>
            </div>
            <span className="hidden sm:inline font-serif text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
              DIVONE
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-accent transition-colors font-medium">
              Home
            </Link>
            <Link href="/shop" className="text-foreground hover:text-accent transition-colors font-medium">
              Shop
            </Link>
            <Link href="/about" className="text-foreground hover:text-accent transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-foreground hover:text-accent transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-foreground hover:text-accent transition-colors">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href={token ? '/account' : '/login'} className="p-2 text-foreground hover:text-accent transition-colors">
              <User size={20} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-foreground hover:text-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-background border-t border-border py-4"
          >
            <div className="flex flex-col gap-3">
              <Link href="/" className="px-4 py-2 text-foreground hover:bg-secondary/50 rounded transition-colors" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link href="/shop" className="px-4 py-2 text-foreground hover:bg-secondary/50 rounded transition-colors" onClick={() => setIsOpen(false)}>
                Shop
              </Link>
              <Link href="/about" className="px-4 py-2 text-foreground hover:bg-secondary/50 rounded transition-colors" onClick={() => setIsOpen(false)}>
                About
              </Link>
              <Link href="/contact" className="px-4 py-2 text-foreground hover:bg-secondary/50 rounded transition-colors" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
