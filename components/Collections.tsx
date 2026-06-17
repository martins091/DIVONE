'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Gem } from 'lucide-react';

const collections = [
  {
    title: 'Evening Wear',
    description: 'Timeless elegance for special occasions',
    image: 'blog2.jpeg',
    category: 'evening-wear',
    color: 'from-amber-900/80 to-black/80',
    icon: Gem,
  },
  {
    title: 'Casual Chic',
    description: 'Comfortable yet refined daily fashion',
    image: 'blog3.jpeg',
    category: 'casual-chic',
    color: 'from-rose-900/80 to-black/80',
    icon: Sparkles,
  },
  {
    title: 'Accessories',
    description: 'Complete your look with luxury details',
    image: 'blog4.jpeg',
    category: 'accessories',
    color: 'from-amber-900/80 to-black/80',
    icon: Gem,
  },
];

export default function Collections() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-accent text-sm font-medium tracking-wide">SIGNATURE SERIES</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            Curated Collections
          </h2>
          <div className="w-20 h-0.5 bg-accent mx-auto mb-6" />
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Explore our handpicked selections designed for the modern woman who appreciates quality and style.
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Link href={`/shop?category=${collection.category}`}>
                <div className="group relative h-[500px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${collection.image})` }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${collection.color} via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90`} />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-0 transition-transform duration-500 group-hover:-translate-y-4">
                    {/* Icon */}
                    <div className="mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <collection.icon className="w-8 h-8 text-accent" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-serif text-3xl font-bold mb-2 group-hover:text-accent transition-colors duration-300">
                      {collection.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-white/80 mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                    
                    {/* Shop Link */}
                    <div className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                      <span className="border-b-2 border-accent pb-1">Explore Collection</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border-2 border-accent/0 rounded-2xl group-hover:border-accent/50 transition-all duration-500 pointer-events-none" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Collections Button */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Link href="/shop">
            <button className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-accent text-accent font-medium rounded-full hover:bg-accent hover:text-white transition-all duration-300">
              View All Collections
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}