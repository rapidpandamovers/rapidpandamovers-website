'use client'

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import QuoteForm from '@/app/components/QuoteForm';

function QuotePageContent() {
  const searchParams = useSearchParams();
  const pickupZip = searchParams.get('pickup') || '';
  const dropoffZip = searchParams.get('dropoff') || '';
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Get Your <span className="text-orange-500">Free Moving Quote</span>
            </h1>
            <p className="text-xl text-gray-600">
              Fill out the form below and we'll provide you with a detailed quote within 24 hours
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="container mx-auto">
          <div className="mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8">
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
