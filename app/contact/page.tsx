'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, Clock, Send, CheckCircle, Instagram, MapPinned, Headphones, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsLoading(false);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      info: 'divonestore3@gmail.com',
      secondary: 'We respond within 24 hours',
      response: '24/7 Support Available',
      color: 'from-blue-500/20 to-blue-600/20',
      iconColor: 'text-blue-500'
    },
    {
      icon: Phone,
      title: 'Call Us',
      info: '08060611037',
      secondary: 'Available 24/7',
      response: 'Call or WhatsApp',
      color: 'from-green-500/20 to-green-600/20',
      iconColor: 'text-green-500'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      info: 'Monday - Sunday: 24/7',
      secondary: 'Always Open',
      response: 'We\'re here whenever you need us',
      color: 'from-orange-500/20 to-orange-600/20',
      iconColor: 'text-orange-500'
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      {/* Hero Section with Background */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60 z-10" />
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format"
            alt="Luxury contact background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <MessageCircle className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm tracking-wide">GET IN TOUCH</span>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6">
              Let's Talk
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
              Have a question or feedback? Our team is here to help. 
              Reach out and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className={`bg-gradient-to-br ${method.color} rounded-2xl p-6 text-center h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}>
                <div className={`w-14 h-14 ${method.iconColor} bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md`}>
                  <method.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{method.title}</h3>
                <p className="text-foreground font-medium">{method.info}</p>
                <p className="text-muted-foreground text-sm mt-1">{method.secondary}</p>
                <p className="text-accent text-xs mt-3">{method.response}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-8">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                  Send us a Message
                </h2>
                <div className="w-16 h-0.5 bg-accent" />
              </div>
              
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-xl text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Map & Social Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >

            {/* Social Connect */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Headphones className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Connect With Us</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="https://instagram.com/divonestore" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 group transition-all"
                >
                  <Instagram className="w-5 h-5 text-pink-500 group-hover:text-white" />
                  <span className="text-sm text-gray-600 group-hover:text-white">Instagram</span>
                </a>
                <a 
                  href="https://tiktok.com/@divonestore" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-black group transition-all"
                >
                  <svg className="w-5 h-5 text-black group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                  </svg>
                  <span className="text-sm text-gray-600 group-hover:text-white">TikTok</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}