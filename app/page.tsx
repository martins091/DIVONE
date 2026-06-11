import Hero from '@/components/Hero';
import Collections from '@/components/Collections';
import FeaturedProducts from '@/components/FeaturedProducts';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';

export default function Page() {
  return (
    <>
      <Hero />
      <Collections />
      <FeaturedProducts />
      <Testimonials />
      <Newsletter />
    </>
  );
}
