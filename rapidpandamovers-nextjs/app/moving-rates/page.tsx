import React from 'react';
import { Metadata } from 'next';
import content from '../../data/content.json';
import Hero from '../components/Hero';
import RateSection from '../components/RateSection';
import IncludedSection from '../components/IncludedSection';
import ResourceSection from '../components/ResourceSection';
import QuoteSection from '../components/QuoteSection';

export const metadata: Metadata = {
  title: content.rates.title,
  description: content.rates.description,
};

export default function RatesPage() {
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
            description: rates.pricing_structure.local_moving.description,
            rates: rates.pricing_structure.local_moving.rates
          },
          {
            title: rates.pricing_structure.packing_services.title,
            rates: rates.pricing_structure.packing_services.rates
          }
        ]}
        additionalServices={{
          title: 'Additional Services',
          subtitle: 'Optional services available for your specific moving needs',
          services: rates.additional_services
        }}
      />

      {/* What's Included */}
      <IncludedSection
        items={rates.whats_included}
        title="What's Included in Your Move"
        subtitle="Everything you need for a successful move, included in our transparent pricing"
      />

      {/* Resources Section */}
      <ResourceSection
        title="More Moving Resources"
        subtitle="Explore our comprehensive guides and services for a successful move"
        variant="grid"
      />

      {/* Quote CTA Section */}
      <QuoteSection
        title="Ready to Get Your Free Quote?"
        subtitle="Contact us today for a detailed, no-obligation estimate for your move."
      />
    </div>
  );
}
