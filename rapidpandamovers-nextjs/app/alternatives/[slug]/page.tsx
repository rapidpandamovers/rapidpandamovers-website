import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, ArrowRight, DollarSign, Clock, Truck, ExternalLink } from 'lucide-react';
import alternatives from '@/data/alternatives.json';
import Hero from '../../components/Hero';
import ContactSection from '../../components/ContactSection';
import Breadcrumbs from '../../components/Breadcrumbs';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return alternatives.alternatives.map((alt) => ({
    slug: alt.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const alternative = alternatives.alternatives.find((a) => a.slug === slug);

  if (!alternative) {
    return { title: 'Alternative Not Found' };
  }

  return {
    title: `${alternative.title} | Rapid Panda Movers`,
    description: alternative.meta_description,
  };
}

export default async function AlternativePage({ params }: PageProps) {
  const { slug } = await params;
  const alternative = alternatives.alternatives.find((a) => a.slug === slug);

  if (!alternative) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Hero
        title={alternative.title}
        description={alternative.summary}
        cta="Get Your Free Quote"
        image_url="https://www.rapidpandamovers.com/wp-content/uploads/2024/11/about-us-rapid-panda.png"
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Alternatives', href: '/alternatives' },
          { label: alternative.alternative.name },
        ]}
        showBackground={true}
      />

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8 mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  How {alternative.alternative.name} Works
                </h2>
                <a
                  href={alternative.alternative.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-600 flex items-center text-sm"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
              <p className="text-gray-700 mb-6">{alternative.how_it_works}</p>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <DollarSign className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="text-gray-500 text-sm">Local Moves</span>
                  </div>
                  <p className="font-bold text-gray-800">{alternative.pricing.local}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Truck className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="text-gray-500 text-sm">Long-Distance</span>
                  </div>
                  <p className="font-bold text-gray-800">{alternative.pricing.long_distance}</p>
                </div>
                {'monthly_storage' in alternative.pricing && (
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-orange-500 mr-2" />
                      <span className="text-gray-500 text-sm">Monthly Storage</span>
                    </div>
                    <p className="font-bold text-gray-800">{alternative.pricing.monthly_storage}</p>
                  </div>
                )}
                {'hourly_rate' in alternative.pricing && (
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-orange-500 mr-2" />
                      <span className="text-gray-500 text-sm">Hourly Rate</span>
                    </div>
                    <p className="font-bold text-gray-800">{alternative.pricing.hourly_rate}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                  Pros of {alternative.alternative.name}
                </h3>
                <ul className="space-y-3">
                  {alternative.pros.map((pro, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <XCircle className="w-6 h-6 text-red-500 mr-2" />
                  Cons of {alternative.alternative.name}
                </h3>
                <ul className="space-y-3">
                  {alternative.cons.map((con, index) => (
                    <li key={index} className="flex items-start">
                      <XCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Best For */}
            <div className="bg-blue-50 rounded-xl p-6 mb-12">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {alternative.alternative.name} Is Best For:
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {alternative.best_for.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Why Full-Service is Better */}
            <div className="bg-orange-50 rounded-xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Why <span className="text-orange-500">Full-Service Moving</span> Might Be Better
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {alternative.why_full_service_better.map((reason, index) => (
                  <div key={index} className="flex items-start bg-white rounded-lg p-4">
                    <CheckCircle className="w-6 h-6 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Comparison */}
            <div className="bg-gray-100 rounded-xl p-8 mb-12">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <DollarSign className="w-6 h-6 text-orange-500 mr-2" />
                The Real Cost Comparison
              </h3>
              <p className="text-gray-700">{alternative.cost_comparison}</p>
            </div>

            {/* Verdict */}
            <div className="bg-gray-900 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Our Verdict</h3>
              <p className="text-gray-300 text-lg mb-6">{alternative.verdict}</p>
              <Link
                href="/contact-us"
                className="inline-block bg-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Get Your Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Other Alternatives */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Explore Other Alternatives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {alternatives.alternatives
              .filter((a) => a.slug !== slug)
              .map((a) => (
                <Link
                  key={a.slug}
                  href={`/alternatives/${a.slug}`}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all group"
                >
                  <span className="text-xs text-gray-500">{a.alternative.type}</span>
                  <h4 className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors mt-1">
                    {a.alternative.name}
                  </h4>
                  <span className="text-orange-500 text-sm flex items-center mt-2">
                    Compare
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
