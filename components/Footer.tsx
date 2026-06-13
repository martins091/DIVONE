import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Mail, Send, Shield, Truck, CreditCard, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'All Collections', href: '/shop' },
      { name: 'New Arrivals', href: '/shop?filter=new' },
      { name: 'Bestsellers', href: '/shop?filter=bestsellers' },
      { name: 'Evening Wear', href: '/shop?category=evening-wear' },
      { name: 'Accessories', href: '/shop?category=accessories' },
    ],
    company: [
      { name: 'About DIVONE', href: '/about' },
      { name: 'Our Story', href: '/about' },
      { name: 'Sustainability', href: '/sustainability' },
      { name: 'Press', href: '/press' },
      { name: 'Careers', href: '/careers' },
    ],
    support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'Size Guide', href: '/size-guide' },
    ],
  };

  const features = [
    { icon: Truck, text: 'Free Worldwide Shipping' },
    { icon: CreditCard, text: 'Secure Payment' },
    { icon: Shield, text: 'Lifetime Warranty' },
    { icon: Heart, text: 'VIP Customer Support' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white mt-20 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Gold Gradient Line Top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 pb-8 border-b border-white/10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-3 text-white/70 text-sm"
            >
              <feature.icon className="w-5 h-5 text-accent" />
              <span>{feature.text}</span>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-black font-serif font-bold text-lg">D</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">DIVONE</h3>
            </div>
            <p className="text-white/60 mb-6 leading-relaxed">
              Discover exquisite luxury fashion curated for the sophisticated woman who appreciates timeless elegance.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-accent hover:text-black transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-accent hover:text-black transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-accent hover:text-black transition-all duration-300">
                <Twitter size={18} />
              </a>
            </div>
          </motion.div>

          {/* Shop Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-serif text-lg font-semibold text-white mb-4 relative inline-block">
              Shop
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-accent" />
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-serif text-lg font-semibold text-white mb-4 relative inline-block">
              Company
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-accent" />
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-serif text-lg font-semibold text-white mb-4 relative inline-block">
              Support
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-accent" />
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h4 className="font-serif text-lg font-semibold text-white mb-4 relative inline-block">
              Newsletter
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-accent" />
            </h4>
            <p className="text-white/60 text-sm mb-4">
              Subscribe for exclusive updates and 10% off your first order.
            </p>
            <form className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-white/5 text-white placeholder-white/40 rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all pr-12"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-accent hover:text-white transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
            <p className="text-white/30 text-xs mt-3 flex items-center gap-1">
              <Shield size={10} />
              No spam, unsubscribe anytime
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {currentYear} DIVONE. All rights reserved. | 
            <span className="text-accent/60"> Crafted with elegance</span>
          </p>

          {/* Payment Methods */}
          <div className="flex gap-2">
            <span className="text-white/30 text-xs">We accept:</span>
            <div className="flex gap-1">
              <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/50">VISA</span>
              <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/50">Mastercard</span>
              <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/50">PayPal</span>
              <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/50">AMEX</span>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-white/40 hover:text-accent transition-colors text-xs">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/40 hover:text-accent transition-colors text-xs">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-white/40 hover:text-accent transition-colors text-xs">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 bg-accent text-black rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-50 opacity-0 group-hover:opacity-100"
        style={{ opacity: 0 }}
        onMouseEnter={(e) => {
          if (window.scrollY > 300) {
            e.currentTarget.style.opacity = '1';
          }
        }}
      >
        <Sparkles size={20} />
      </button>
    </footer>
  );
}