'use client'

import { useSearchParams } from 'next/navigation';
import { useMessages } from 'next-intl';
import { Suspense } from 'react';
import QuoteForm from '@/app/components/QuoteForm';
import Hero from '@/app/components/Hero';

function QuotePageContent() {
  const { content } = useMessages() as any;
  const searchParams = useSearchParams();
  const pickupZip = searchParams.get('pickup') || '';
  const dropoffZip = searchParams.get('dropoff') || '';
  return (
    <div className="min-h-screen">
      <Hero
        title={content.quote.hero.title}
        description={content.quote.hero.description}
        cta={content.quote.hero.cta}
      />

      {/* Form Section */}
      <section className="pt-20">
        <div className="container mx-auto">
          <div className="mx-auto">
            <div className="bg-gray-50 rounded-4xl p-8">
              <QuoteForm
                initialPickupZip={pickupZip}
                initialDropoffZip={dropoffZip}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuotePageContent />
    </Suspense>
  );
}
