import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, ArrowRight, Scale, ExternalLink } from 'lucide-react';
import comparisons from '@/data/comparisons.json';
import Hero from '../../components/Hero';
import ContactSection from '../../components/ContactSection';
import Breadcrumbs from '../../components/Breadcrumbs';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return comparisons.comparisons.map((comparison) => ({
    slug: comparison.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const comparison = comparisons.comparisons.find((c) => c.slug === slug);

  if (!comparison) {
    return { title: 'Comparison Not Found' };
  }

  return {
    title: `${comparison.title} | Miami Moving Company Comparison`,
    description: comparison.meta_description,
  };
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const comparison = comparisons.comparisons.find((c) => c.slug === slug);

  if (!comparison) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Hero
        title={comparison.title}
        description={comparison.summary}
        cta="Get Your Free Quote"
        image_url="https://www.rapidpandamovers.com/wp-content/uploads/2024/11/about-us-rapid-panda.png"
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Compare', href: '/compare' },
          { label: `vs ${comparison.competitor.name}` },
        ]}
        showBackground={true}
      />

      {/* Competitor Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8 mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  About {comparison.competitor.name}
                </h2>
                <a
                  href={comparison.competitor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-600 flex items-center text-sm"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-gray-500 text-sm">Rating</span>
                  <p className="font-bold text-gray-800">{comparison.competitor.rating}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Reviews</span>
                  <p className="font-bold text-gray-800">{comparison.competitor.reviews}</p>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Services Offered:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {comparison.competitor_services.map((service, index) => (
                  <li key={index} className="text-gray-600 flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pros and Cons Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Competitor Pros */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                  {comparison.competitor.name} Pros
                </h3>
                <ul className="space-y-3">
                  {comparison.competitor_pros.map((pro, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Competitor Cons */}
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <XCircle className="w-6 h-6 text-red-500 mr-2" />
                  {comparison.competitor.name} Cons
                </h3>
                <ul className="space-y-3">
                  {comparison.competitor_cons.map((con, index) => (
                    <li key={index} className="flex items-start">
                      <XCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Why Choose Rapid Panda */}
            <div className="bg-orange-50 rounded-xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Why Choose <span className="text-orange-500">Rapid Panda Movers</span> Instead?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comparison.why_choose_us.map((reason, index) => (
                  <div key={index} className="flex items-start bg-white rounded-lg p-4">
                    <CheckCircle className="w-6 h-6 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verdict */}
            <div className="bg-gray-900 rounded-xl p-8 text-center">
              <Scale className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Our Verdict</h3>
              <p className="text-gray-300 text-lg mb-6">{comparison.verdict}</p>
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

      {/* Other Comparisons */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            More Comparisons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {comparisons.comparisons
              .filter((c) => c.slug !== slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/compare/${c.slug}`}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all group"
                >
                  <h4 className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">
                    vs {c.competitor.name}
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
