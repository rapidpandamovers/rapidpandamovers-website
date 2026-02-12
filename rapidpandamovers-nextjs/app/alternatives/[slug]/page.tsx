import { notFound } from 'next/navigation';
import { DollarSign, Clock, Truck } from 'lucide-react';
import alternatives from '@/data/alternatives.json';
import Hero from '../../components/Hero';
import QuoteSection from '../../components/QuoteSection';
import Breadcrumbs from '../../components/Breadcrumbs';
import RelatedSection from '../../components/RelatedSection';
import OverviewSection from '../../components/OverviewSection';
import CompareSection from '../../components/CompareSection';
import WhySection from '../../components/WhySection';

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
      <OverviewSection
        title={`How ${alternative.alternative.name} Works`}
        name={alternative.alternative.name}
        website={alternative.alternative.website}
      >
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
      </OverviewSection>

      {/* Pros and Cons */}
      <CompareSection
        name={alternative.alternative.name}
        pros={alternative.pros}
        cons={alternative.cons}
        proTitle={`Pros of ${alternative.alternative.name}`}
        conTitle={`Cons of ${alternative.alternative.name}`}
        bestFor={alternative.best_for}
        costComparison={alternative.cost_comparison}
      />

      {/* Why Full-Service is Better */}
      <WhySection
        title={<>Why <span className="text-orange-500">Full-Service Moving</span> Might Be Better</>}
        benefits={alternative.why_full_service_better}
        ctaText="See Why We're Different"
        ctaLink="/why-choose-us"
      />

      {/* Verdict */}
      <QuoteSection
        title="Our Verdict"
        subtitle={alternative.verdict}
      />

      {/* Other Alternatives */}
      <RelatedSection
        title="Explore Other Alternatives"
        items={alternatives.alternatives}
        currentSlug={slug}
        basePath="/alternatives"
        getSlug={(a) => a.slug}
        renderItem={(a) => (
          <>
            <span className="text-xs text-gray-500">{a.alternative.type}</span>
            <h4 className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors mt-1">
              {a.alternative.name}
            </h4>
          </>
        )}
      />
      
    </div>
  );
}
