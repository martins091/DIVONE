import Hero from '@/components/Hero';
import Collections from '@/components/Collections';
import FeaturedProducts from '@/components/FeaturedProducts';
import TrackOrderCta from '@/components/TrackOrderCta';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';

export default function Page() {
  return (
    <>
      <Hero />
      <TrackOrderCta />
      <Collections />
      <FeaturedProducts />
      <Testimonials />
      <Newsletter />
    </>
  );
}
