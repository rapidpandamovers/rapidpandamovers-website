import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

interface GlossarySectionProps {
  className?: string;
}

export default function GlossarySection({ className = "" }: GlossarySectionProps) {
  const sampleTerms = [
    { term: 'Bill of Lading', definition: 'A legal document between you and the moving company that lists your belongings and serves as a receipt.' },
    { term: 'Cubic Feet', definition: 'A unit of measurement used to determine the volume of your shipment.' },
    { term: 'Valuation', definition: 'The degree of liability your moving company assumes for your belongings.' },
  ];

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto">
        <div className="mx-auto text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-orange-500" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Moving Glossary
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            New to moving? Learn the terminology used in the moving industry to better understand your move and communicate with your movers.
          </p>

          {/* Sample Terms Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {sampleTerms.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6 text-left">
                <h3 className="text-lg font-bold text-orange-500 mb-2">
                  {item.term}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/moving-glossary"
            className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            View Full Glossary
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
