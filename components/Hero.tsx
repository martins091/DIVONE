'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Crown, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/divone2.png"
          alt="Luxury fashion model"
          className="w-full h-full object-cover object-top"
        />
        
        {/* Left side dark overlay - strong on left, fades to transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        
        {/* Bottom dark overlay - heavier on bottom, lighter on top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Right side brightness boost - makes the right side lighter */}
        <div className="absolute inset-0 bg-gradient-to-l from-white/20 via-white/5 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            >
              <Crown className="w-4 h-4 text-accent" />
              <span className="text-white/80 text-sm tracking-wider">DIVONE COLLECTION</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="text-white">Define Your</span>
              <br />
              <span className="bg-gradient-to-r from-accent via-white to-accent bg-clip-text text-transparent">
                Elegance
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/70 text-lg mb-8 max-w-lg leading-relaxed"
            >
              Experience the pinnacle of luxury fashion. Each garment tells a story of craftsmanship, 
              passion, and timeless beauty.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-medium rounded-full hover:bg-accent/90 transition-all hover:scale-105 hover:shadow-xl"
              >
                Explore Collection
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-medium rounded-full hover:bg-white hover:text-black transition-all backdrop-blur-sm"
              >
                <Play className="mr-2" size={16} />
                Our Story
              </Link>
            </motion.div>
          </motion.div>

          {/* Right side - Empty or decorative element */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs tracking-wider">SCROLL</span>
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/50 rounded-full mt-1 animate-bounce" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}