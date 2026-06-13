'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current page is an admin page
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {/* Only show Navbar if NOT on admin page */}
      {!isAdminPage && <Navbar />}
      
      {/* Main content */}
      {children}
      
      {/* Only show Footer if NOT on admin page */}
      {!isAdminPage && <Footer />}
    </>
  );
}