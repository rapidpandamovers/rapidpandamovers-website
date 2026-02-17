import { Suspense } from 'react';
import Hero from '../components/Hero';
import QuoteSection from '../components/QuoteSection';

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Hero
        title="Moving Routes"
        description="Browse our popular moving routes with transparent pricing. Whether you're moving locally within Miami or relocating across the country, we've got you covered."
        cta="Get Your Free Quote"
      />

      <Suspense fallback={
        <div className="pt-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600">Loading routes...</p>
          </div>
        </div>
      }>
        {children}
      </Suspense>

      <QuoteSection
        title="Don't See Your Route?"
        subtitle="We serve many more locations. Contact us for a custom quote for your move."
        buttonText="Get a Custom Quote"
      />
    </div>
  );
}
