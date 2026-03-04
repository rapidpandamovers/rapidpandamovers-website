import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getMessages, getLocale } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import type { Locale } from '@/i18n/config';
import Hero from '@/app/components/Hero';
import ClaimsForm from '@/app/components/ClaimsForm';

export async function generateMetadata() {
  const locale = await getLocale() as Locale;
  const { meta } = (await getMessages()) as any;
  return generatePageMetadata({
    title: meta.claims.title,
    description: meta.claims.description,
    path: meta.claims.path,
    locale,
  });
}

export default async function ClaimsPage() {
  const { content } = (await getMessages()) as any;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={content.claims.hero.title}
        description={content.claims.hero.description}
        cta={content.claims.hero.cta}
      />

      {/* Claims Form */}
      <section id="claims-form" className="pt-20">
        <div className="container mx-auto">
          <div className="mx-auto">
            <div className="bg-gray-50 rounded-4xl p-8">
              <Suspense fallback={<div className="text-center py-8">Loading form...</div>}>
                <ClaimsForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
