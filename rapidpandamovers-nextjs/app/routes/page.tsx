import { Suspense } from 'react';
import Hero from '../components/Hero';
import QuoteSection from '../components/QuoteSection';
import RoutesContent from './RoutesContent';

export const metadata = {
  title: 'Moving Routes | Rapid Panda Movers',
  description: 'Browse all our moving routes. Professional moving services for local and long distance moves across Florida and nationwide.',
};

export default function RoutesPage() {
  return (
    <div className="min-h-screen">
      <Hero
        title="Moving Routes"
        description="Browse our popular moving routes with transparent pricing. Whether you're moving locally within Miami or relocating across the country, we've got you covered."
        cta="Get Your Free Quote"
      />

      <Suspense fallback={
        <div className="py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600">Loading routes...</p>
          </div>
        </div>
      }>
        <RoutesContent />
      </Suspense>

      <QuoteSection
        title="Don't See Your Route?"
        subtitle="We serve many more locations. Contact us for a custom quote for your move."
        buttonText="Get a Custom Quote"
      />
    </div>
  );
}
