'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Heart, 
  Share2, 
  Bookmark,
  Twitter,
  Facebook,
  Linkedin,
  Link2
} from 'lucide-react';
import { blogPosts } from '../data'; // Import shared data

export default function BlogPostPage() {
  const params = useParams();
  const postId = parseInt(params.id as string);
  const post = blogPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Article not found</h2>
          <Link href="/blog" className="text-accent hover:underline">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black pt-32">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-accent transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
            <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {post.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-accent to-pink-500 flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  {post.author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{post.author}</p>
                <p className="text-white/40 text-sm">Contributing Editor</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full border border-white/10 hover:border-accent/50 hover:text-accent transition-all text-white/60">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full border border-white/10 hover:border-accent/50 hover:text-accent transition-all text-white/60">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full border border-white/10 hover:border-accent/50 hover:text-accent transition-all text-white/60">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-2xl overflow-hidden mb-12 aspect-[16/9]"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blogs/tag/${tag.toLowerCase()}`}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-white hover:border-accent/30 transition-all text-sm"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-white/60 font-medium">Share this article</p>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 transition-all group">
                <Twitter className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              </button>
              <button className="p-2 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 transition-all group">
                <Facebook className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              </button>
              <button className="p-2 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 transition-all group">
                <Linkedin className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              </button>
              <button className="p-2 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 transition-all group">
                <Link2 className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <h3 className="font-serif text-2xl text-white mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {blogPosts
              .filter(p => p.id !== post.id && p.category === post.category)
              .slice(0, 2)
              .map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blogs/${relatedPost.id}`}
                  className="group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:bg-white/10"
                >
                  <div className="p-6">
                    <h4 className="font-serif text-lg text-white group-hover:text-accent transition-colors mb-2">
                      {relatedPost.title}
                    </h4>
                    <p className="text-white/60 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </article>
    </main>
  );
}