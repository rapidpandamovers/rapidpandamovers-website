import { Suspense } from 'react';
import { getMessages } from 'next-intl/server';
import Hero from '@/app/components/Hero';
import QuotePageContent from './QuotePageContent';

export default async function QuotePage() {
  const { content } = (await getMessages()) as any;

  return (
    <div className="min-h-screen">
      <Hero
        title={content.quote.hero.title}
        description={content.quote.hero.description}
        cta={content.quote.hero.cta}
      />
      <Suspense fallback={<div className="h-96" />}>
        <QuotePageContent />
      </Suspense>
    </div>
  );
}
