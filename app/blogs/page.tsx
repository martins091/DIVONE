'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Clock, 
  ArrowRight, 
  Search, 
  Tag, 
  ChevronRight,
  BookOpen,
  Heart,
  Share2,
  Eye
} from 'lucide-react';
import { blogPosts } from './data'; // Import shared data

// Categories for filter - dynamically generated from blog posts
const categories = ['All', ...new Set(blogPosts.map(post => post.category))];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts based on category and search
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-[url('/blog-hero-bg.jpg')] bg-cover bg-center opacity-30" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <BookOpen className="w-4 h-4 text-accent" />
              <span className="text-white/80 text-sm tracking-wider">DIVONE JOURNAL</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">The Art of</span>
              <br />
              <span className="bg-gradient-to-r from-accent via-white to-accent bg-clip-text text-transparent">
                Fashion Stories
              </span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed">
              Exploring the intersection of luxury, creativity, and timeless style through 
              curated stories and expert insights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-accent text-white shadow-lg shadow-accent/25'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10"
          >
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-80 lg:h-full min-h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 lg:hidden" />
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 z-20">
                  <span className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-full">
                    Featured
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-accent">
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
                
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-accent transition-colors">
                  {featuredPost.title}
                </h2>
                
                <p className="text-white/70 text-lg leading-relaxed mb-6">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-accent to-pink-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        D
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Divone Editor</p>
                      <p className="text-white/40 text-sm">Editorial Team</p>
                    </div>
                  </div>
                  
                  <Link
                    href={`/blogs/${featuredPost.id}`}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-all hover:scale-105"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif text-white">
            Latest Articles
          </h2>
          <span className="text-white/40 text-sm">
            {filteredPosts.length} articles
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg">No articles found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/5"
              >
                <Link href={`/blogs/${post.id}`}>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/20">
                        {post.category}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="p-6">
                  <Link href={`/blogs/${post.id}`}>
                    <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent/50 to-pink-500/50 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          D
                        </span>
                      </div>
                      <span className="text-white/60 text-sm">Divone Team</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-white/40">
                      <button className="hover:text-accent transition-colors flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">{post.likes}</span>
                      </button>
                      <button className="hover:text-accent transition-colors flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-xs">{post.views}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-12">
            <button className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-white/20 text-white rounded-full hover:bg-white hover:text-black transition-all">
              Load More Articles
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border border-accent/20 p-8 md:p-12 text-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h3 className="font-serif text-3xl md:text-4xl text-white mb-4">
              Join the Divine Circle
            </h3>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Subscribe to our newsletter and receive exclusive fashion insights, 
              early access to collections, and special invitations.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-accent/50"
              />
              <button className="px-8 py-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-all hover:scale-105 font-medium">
                Subscribe
              </button>
            </form>
            
            <p className="text-white/30 text-sm mt-4">
              By subscribing, you agree to our Privacy Policy
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}