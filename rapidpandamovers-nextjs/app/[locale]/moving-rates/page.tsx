import React from 'react';
import { Metadata } from 'next';
import { getMessages, getLocale } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import type { Locale } from '@/i18n/config';
import Hero from '@/app/components/Hero';
import RateSection from '@/app/components/RateSection';
import IncludedSection from '@/app/components/IncludedSection';
import ResourceSection from '@/app/components/ResourceSection';
import QuoteSection from '@/app/components/QuoteSection';

export async function generateMetadata() {
  const locale = await getLocale() as Locale;
  const { meta } = (await getMessages()) as any;
  return generatePageMetadata({
    title: meta.rates.title,
    description: meta.rates.description,
    path: meta.rates.path,
    locale,
  });
}

export default async function RatesPage() {
  const { content } = (await getMessages()) as any;
  const { rates } = content;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={rates.hero.title}
        description={rates.hero.description}
        cta={rates.hero.cta}
      />

      {/* Pricing Structure & Additional Services */}
      <RateSection
        categories={[
          {
            title: rates.pricing_structure.local_moving.title,
            rates: rates.pricing_structure.local_moving.rates
          },
          {
            title: rates.pricing_structure.packing_services.title,
            rates: rates.pricing_structure.packing_services.rates
          }
        ]}
        additionalServices={{
          title: rates.additionalServicesSection.title,
          subtitle: rates.additionalServicesSection.subtitle,
          services: rates.additional_services
        }}
      />

      {/* What's Included */}
      <IncludedSection
        items={rates.whats_included}
        title={rates.includedSection.title}
        subtitle={rates.includedSection.subtitle}
      />

      {/* Resources Section */}
      <ResourceSection
        title={rates.resourceSection.title}
        subtitle={rates.resourceSection.subtitle}
        variant="grid"
      />

      {/* Quote CTA Section */}
      <QuoteSection
        title={rates.quote.title}
        subtitle={rates.quote.subtitle}
      />
    </div>
  );
}
