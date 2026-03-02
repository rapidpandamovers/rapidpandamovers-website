'use client'

import { useSearchParams } from 'next/navigation';
import QuoteForm from '@/app/components/QuoteForm';

export default function QuotePageContent() {
  const searchParams = useSearchParams();
  const pickupZip = searchParams.get('pickup') || '';
  const dropoffZip = searchParams.get('dropoff') || '';

  return (
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
  );
}
