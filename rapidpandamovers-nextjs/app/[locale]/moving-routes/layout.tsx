import { Suspense } from 'react';
import Hero from '@/app/components/Hero';
import QuoteSection from '@/app/components/QuoteSection';
import { getMessages } from 'next-intl/server';

export default async function RoutesLayout({ children }: { children: React.ReactNode }) {
  const { content } = (await getMessages()) as any;

  return (
    <div className="min-h-screen">
      <Hero
        title={content.moving_routes.hero.title}
        description={content.moving_routes.hero.description}
        cta={content.moving_routes.hero.cta}
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
        title={content.moving_routes.quote.title}
        subtitle={content.moving_routes.quote.subtitle}
        buttonText={content.moving_routes.quote.buttonText}
      />
    </div>
  );
}
