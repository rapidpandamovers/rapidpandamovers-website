import { notFound } from 'next/navigation';
import comparisons from '@/data/comparisons.json';
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
      <section className="py-16">
        <div className="container mx-auto">
          <div className="mx-auto">
            <OverviewSection
              title={`About ${comparison.competitor.name}`}
              name={comparison.competitor.name}
              website={comparison.competitor.website}
            >
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
            </OverviewSection>

            {/* Pros and Cons Comparison */}
            <CompareSection
              name={comparison.competitor.name}
              pros={comparison.competitor_pros}
              cons={comparison.competitor_cons}
            />

          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhySection
        title={<>Why Choose <span className="text-orange-500">Rapid Panda Movers</span> Instead?</>}
        benefits={comparison.why_choose_us}
        ctaText="See Why We're Different"
        ctaLink="/why-choose-us"
      />

      {/* Verdict */}
      <QuoteSection
        title="Our Verdict"
        subtitle={comparison.verdict}
      />

      {/* Other Comparisons */}
      <RelatedSection
        title="More Comparisons"
        items={comparisons.comparisons}
        currentSlug={slug}
        basePath="/compare"
        getSlug={(c) => c.slug}
        renderItem={(c) => (
          <h4 className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">
            vs {c.competitor.name}
          </h4>
        )}
      />
      
    </div>
  );
}
