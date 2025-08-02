// src/pages/index.tsx
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeatureGrid from '@/components/FeatureGrid';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <FeatureGrid />
      </main>
    </div>
  );
};

export default Index;