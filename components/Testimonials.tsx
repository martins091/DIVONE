'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Fashion Enthusiast',
    content: 'The quality of pieces at Luxe is unparalleled. Every item feels like an investment in elegance.',
    rating: 5,
    image: 'linear-gradient(135deg, #D4AF37 0%, #E8C4C4 100%)',
  },
  {
    name: 'Emma Richardson',
    role: 'Executive',
    content: 'I recommend Luxe to all my colleagues. The collections are sophisticated and timeless.',
    rating: 5,
    image: 'linear-gradient(135deg, #E8C4C4 0%, #F8F5F0 100%)',
  },
  {
    name: 'Jessica Thompson',
    role: 'Stylist',
    content: 'Luxe understands luxury fashion better than anyone. Their curation is impeccable.',
    rating: 5,
    image: 'linear-gradient(135deg, #1A1A1A 0%, #D4AF37 100%)',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-accent font-medium mb-4 uppercase tracking-widest">Client Stories</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            Loved by Our Customers
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Discover why thousands of women trust Luxe for their luxury fashion needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-8 shadow-sm border border-border"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground/80 mb-6 leading-relaxed italic">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full"
                  style={{ background: testimonial.image }}
                />
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-foreground/60">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
