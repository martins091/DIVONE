import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CartProvider } from '@/lib/CartContext'
import LayoutWrapper from '@/components/LayoutWrapper'

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
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}