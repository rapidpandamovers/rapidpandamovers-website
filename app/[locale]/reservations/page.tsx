import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getMessages, getLocale } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import type { Locale } from '@/i18n/config';
import Hero from '@/app/components/Hero';
import ReservationForm from '@/app/components/ReservationForm';

export async function generateMetadata() {
  const locale = await getLocale() as Locale;
  const { meta } = (await getMessages()) as any;
  return generatePageMetadata({
    title: meta.reservations.title,
    description: meta.reservations.description,
    path: meta.reservations.path,
    locale,
  });
}

export default async function ReservationsPage() {
  const { content } = (await getMessages()) as any;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={content.reservations.hero.title}
        description={content.reservations.hero.description}
        cta={content.reservations.hero.cta}
      />

      {/* Reservation Form */}
      <section id="reservation-form" className="pt-20">
        <div className="container mx-auto">
          <div className="mx-auto">
            <div className="bg-gray-50 rounded-4xl p-8">
              <Suspense fallback={<div className="text-center py-8">Loading form...</div>}>
                <ReservationForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
