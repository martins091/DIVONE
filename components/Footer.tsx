import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">DIVONE</h3>
            <p className="text-primary-foreground/70 mb-6">
              Discover exquisite luxury fashion curated for the sophisticated woman.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="hover:text-accent transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/shop?category=dresses" className="hover:text-accent transition-colors">
                  Dresses
                </Link>
              </li>
              <li>
                <Link href="/shop?category=outerwear" className="hover:text-accent transition-colors">
                  Outerwear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=accessories" className="hover:text-accent transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-accent transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-accent transition-colors">
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-primary-foreground/70 mb-4">
              Subscribe for exclusive updates and early access to new collections.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 bg-primary-foreground/10 text-primary-foreground placeholder-primary-foreground/50 rounded border border-primary-foreground/20 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors rounded font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/70 text-sm">
            © {currentYear} Divone Store. All rights reserved.
          </p>

          {/* Social */}
          <div className="flex gap-4">
            <a href="#" className="p-2 hover:text-accent transition-colors" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-2 hover:text-accent transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="p-2 hover:text-accent transition-colors" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="p-2 hover:text-accent transition-colors" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>

          {/* Links */}
          <div className="flex gap-4 text-sm">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
