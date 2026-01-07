import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import TeamSection from '@/components/sections/TeamSection';

// Lazy load below-the-fold sections for better initial load performance
const ImpactSection = dynamic(() => import('@/components/sections/ImpactSection'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});
const NewsSection = dynamic(() => import('@/components/sections/NewsSection'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});
const GallerySection = dynamic(() => import('@/components/sections/GallerySection'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});
const GetInvolvedSection = dynamic(() => import('@/components/sections/GetInvolvedSection'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});
const DonateSection = dynamic(() => import('@/components/sections/DonateSection'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});
// LocationsSection loads amCharts, so it's especially important to lazy load
// Note: Component handles client-side initialization internally with Intersection Observer
const LocationsSection = dynamic(() => import('@/components/sections/LocationsSection'), {
  loading: () => <div style={{ minHeight: '600px' }} />,
});

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <TeamSection />
      <ImpactSection />
      <NewsSection />
      <GallerySection />
      <GetInvolvedSection />
      <DonateSection />
      <LocationsSection />
    </main>
  );
}
