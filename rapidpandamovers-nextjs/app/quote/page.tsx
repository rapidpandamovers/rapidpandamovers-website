import { Metadata } from 'next';
import content from '@/data/content.json';
import QuoteForm from '@/app/components/QuoteForm';

export const metadata: Metadata = {
  title: `Get a Free Quote - ${content.site.title}`,
  description: 'Request a free moving quote from Rapid Panda Movers. Professional moving services in Miami with no hidden fees.',
};

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
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
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
