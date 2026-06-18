'use client';

import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    name: 'Chidinma Eze',
    role: 'Fashion Enthusiast',
    content: 'The quality of pieces at DIVONE is unparalleled. Every item feels like an investment in elegance. The attention to detail and customer service is exceptional.',
    rating: 5,
    location: 'Lagos, Nigeria',
  },
  {
    name: 'Ngozi Okonkwo',
    role: 'Executive Director',
    content: 'I recommend DIVONE to all my colleagues. The collections are sophisticated and timeless. Finally, a brand that understands modern professional women.',
    rating: 5,
    location: 'Abuja, Nigeria',
  },
  {
    name: 'Folake Adeyemi',
    role: 'Celebrity Stylist',
    content: 'DIVONE understands luxury fashion better than anyone. Their curation is impeccable and the craftsmanship is world-class. Absolutely stunning pieces.',
    rating: 5,
    location: 'Lagos, Nigeria',
  },
  {
    name: 'Amara Okafor',
    role: 'Creative Director',
    content: 'As someone who appreciates fine craftsmanship, DIVONE has exceeded my expectations. The pieces are not just clothing, they\'re works of art.',
    rating: 5,
    location: 'Port Harcourt, Nigeria',
  },
  {
    name: 'Ifeoma Obi',
    role: 'Luxury Blogger',
    content: 'DIVONE has become my go-to for statement pieces. The quality is unmatched and every purchase feels special. Truly a premium experience.',
    rating: 5,
    location: 'Enugu, Nigeria',
  },
  {
    name: 'Chioma Nwachukwu',
    role: 'Fashion Editor',
    content: 'The attention to detail in every DIVONE piece is remarkable. It\'s refreshing to see a brand that prioritizes quality over quantity.',
    rating: 5,
    location: 'Ibadan, Nigeria',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // For carousel view (optional)
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 3) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 3 + testimonials.length) % testimonials.length);
  };

  // Visible testimonials based on screen size (simplified)
  const visibleTestimonials = testimonials.slice(0, 3);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Quote className="w-4 h-4 text-accent" />
            <span className="text-accent text-sm font-medium tracking-wider">TESTIMONIALS</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Our Clients Say
          </h2>
          <div className="w-20 h-0.5 bg-accent mx-auto mb-6" />
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Join thousands of satisfied women who've elevated their style with DIVONE
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleTestimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote size={48} />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < testimonial.rating ? 'fill-accent text-accent' : 'text-gray-300'}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground/70 mb-8 leading-relaxed text-lg italic">
                  &quot;{testimonial.content}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {/* Avatar placeholder - initials */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center ring-2 ring-accent/20 group-hover:ring-accent/50 transition-all">
                    <span className="text-accent font-semibold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-accent font-medium">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-foreground/40 mt-1">
                      {testimonial.location}
                    </p>
                  </div>
                </div>

                {/* Decorative Line */}
                <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-accent/20 to-transparent group-hover:via-accent/50 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">500+</div>
              <div className="text-sm text-foreground/60">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">98%</div>
              <div className="text-sm text-foreground/60">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">4.9</div>
              <div className="text-sm text-foreground/60">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">50+</div>
              <div className="text-sm text-foreground/60">5-Star Reviews</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}