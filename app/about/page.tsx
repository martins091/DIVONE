'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles, Zap, Shield, Globe, Award, ChevronRight, Quote } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  const stats = [
    { value: '500+', label: 'Happy Clients', icon: Heart },
    { value: '50+', label: 'Premium Brands', icon: Award },
    { value: '15+', label: 'Countries Served', icon: Globe },
    { value: '98%', label: 'Satisfaction Rate', icon: Shield },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & Creative Director',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Curation',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format',
    },
    {
      name: 'Isabella Rossi',
      role: 'Senior Stylist',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format',
    },
    {
      name: 'David Okafor',
      role: 'Operations Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      {/* Hero Section with Background */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2070&auto=format"
            alt="Luxury fashion background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Heart className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-medium tracking-wide">OUR STORY</span>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-foreground mb-6">
              The Art of <span className="text-accent">Luxury</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Curating the finest selection of luxury women&apos;s fashion since 2015. 
              We believe in timeless elegance, exceptional quality, and empowering women through style.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section with Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-accent/30 rounded-tl-2xl" />
              <img
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format"
                alt="Luxury fashion boutique"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-accent/30 rounded-br-2xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-medium">OUR JOURNEY</span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-6">
              A Story of Passion & Elegance
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Divone Store was founded on the belief that luxury fashion should be accessible, 
              personal, and extraordinary. What started as a small curated collection has grown 
              into a destination for discerning women who appreciate quality, craftsmanship, 
              and timeless design.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Every piece in our collection is handpicked by our expert team of stylists and 
              fashion consultants. We partner exclusively with premium brands and emerging 
              designers who share our commitment to excellence and sustainability.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, Divone Store serves hundreds of customers worldwide who trust us to deliver 
              not just products, but an experience—one that celebrates their individuality and style.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black py-16 my-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-accent text-sm font-medium">CORE VALUES</span>
          </div>
          <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
            What We Stand For
          </h2>
          <div className="w-20 h-0.5 bg-accent mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              title: 'Excellence',
              description: 'We maintain the highest standards in every aspect of our business, from product selection to customer service.',
              icon: Award,
              color: 'from-amber-400/20 to-rose-400/20'
            },
            {
              title: 'Sustainability',
              description: 'We are committed to ethical sourcing and sustainable practices that respect our planet and communities.',
              icon: Globe,
              color: 'from-green-400/20 to-blue-400/20'
            },
            {
              title: 'Empowerment',
              description: 'We celebrate individuality and believe fashion is a powerful tool for self-expression and confidence.',
              icon: Heart,
              color: 'from-rose-400/20 to-purple-400/20'
            }
          ].map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className={`bg-gradient-to-br ${value.color} rounded-2xl p-8 text-center h-full transition-all duration-300 group-hover:shadow-xl`}>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <value.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

  

     {/* Testimonial Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <Quote className="absolute top-6 right-6 w-24 h-24 text-white" />
            <Quote className="absolute bottom-6 left-6 w-24 h-24 text-white rotate-180" />
          </div>
          
          <div className="relative z-10">
            <Quote className="w-12 h-12 text-accent mx-auto mb-6" />
            <p className="text-white text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto mb-8 italic">
              &quot;Divone Store has completely transformed my wardrobe. The quality of their pieces 
              is exceptional, and their customer service is unparalleled. I wouldn&apos;t shop anywhere else.&quot;
            </p>
            <div className="flex items-center justify-center gap-4">
              {/* Avatar placeholder - initials */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/40 to-accent/20 flex items-center justify-center ring-2 ring-accent/30">
                <span className="text-white font-semibold text-md">CE</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">Chidinma Eze</p>
                <p className="text-white/60 text-sm">Loyal Customer since 2020</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Elevate Your Style?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our curated collection of luxury fashion pieces.
          </p>
          <Link href="/shop">
            <button className="group inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-full hover:bg-accent/90 transition-all hover:scale-105">
              Shop Now
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}