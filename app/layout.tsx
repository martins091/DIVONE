import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CartProvider } from '@/lib/CartContext'

const playfairDisplay = Playfair_Display({ 
  variable: '--font-playfair',
  subsets: ["latin"],
  weight: ['400', '500', '600', '700']
});

const inter = Inter({ 
  variable: '--font-inter',
  subsets: ["latin"] 
});

export const metadata: Metadata = {
  title: 'DIVONE - Premium Women\'s Fashion',
  description: 'Discover exquisite luxury women\'s fashion with curated collections of elegant clothing and accessories.',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfairDisplay.variable} font-sans antialiased bg-background text-foreground`}>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
