import React, { Suspense } from 'react';
import { Metadata } from 'next';
import content from '../../data/content.json';
import Hero from '../components/Hero';
import ReservationForm from '../components/ReservationForm';

export const metadata: Metadata = {
  title: `Reservations - ${content.site.title}`,
  description: 'Book your move with Rapid Panda Movers. Professional moving services in Miami with transparent pricing and flexible scheduling.',
};

export default function ReservationsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title="Book Your Move Today"
        description="Professional moving services with transparent pricing and flexible scheduling"
        cta="Get Your Free Quote"
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
