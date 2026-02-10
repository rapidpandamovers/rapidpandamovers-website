import { Scale, Star, Shield } from 'lucide-react';
import comparisons from '@/data/comparisons.json';
import Hero from '../components/Hero';
import QuoteSection from '../components/QuoteSection';
import CompareList from '../components/CompareList';
import CompareTable from '../components/CompareTable';
import OverviewSection from '../components/OverviewSection';

export const metadata = {
  title: 'Compare Movers | Rapid Panda Movers vs Competitors',
  description: 'Compare Rapid Panda Movers to other Miami moving companies. See side-by-side comparisons of services, pricing, and customer reviews.',
};

export default function ComparePage() {
  return (
    <div className="min-h-screen">
      <Hero
        title="Compare Miami Movers"
        description="See how Rapid Panda Movers stacks up against the competition"
        cta="Get Your Free Quote"
        image_url="https://www.rapidpandamovers.com/wp-content/uploads/2024/11/about-us-rapid-panda.png"
      />

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto">
          <OverviewSection title={<>Why Compare <span className="text-orange-500">Moving Companies</span>?</>}>
            <p className="text-xl text-gray-600 mb-8">
              Choosing the right moving company is crucial for a stress-free relocation. We believe in transparency,
              so we've created honest comparisons between Rapid Panda Movers and other popular Miami moving companies.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scale className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Fair Comparisons</h3>
                <p className="text-gray-600">Honest side-by-side analysis of services and pricing</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Real Reviews</h3>
                <p className="text-gray-600">Based on actual customer feedback and ratings</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Informed Decisions</h3>
                <p className="text-gray-600">All the info you need to choose confidently</p>
              </div>
            </div>
          </OverviewSection>
        </div>
      </section>

      {/* Comparisons Grid */}
      <CompareList
        title={<>Rapid Panda vs <span className="text-orange-500">The Competition</span></>}
        subtitle="Click on any comparison below to see a detailed analysis"
        items={comparisons.comparisons}
        basePath="/compare"
        getSlug={(c) => c.slug}
        ctaText="View Comparison"
        renderCard={(comparison) => (
          <>
            <div className="flex items-center justify-between mb-4">
              <Scale className="w-8 h-8 text-orange-500" />
              {comparison.competitor.rating !== 'N/A' && comparison.competitor.rating !== 'Mixed' && (
                <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                  {comparison.competitor.rating}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
              vs {comparison.competitor.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {comparison.summary}
            </p>
          </>
        )}
      />

      {/* Quick Comparison Table */}
      <CompareTable
        title="Quick Comparison"
        columns={[
          { header: 'Rating' },
          { header: 'Transparent Pricing' },
          { header: 'Licensed & Insured' },
        ]}
        rows={[
          {
            option: 'Rapid Panda Movers',
            cells: ['4.9/5 (Verified)', 'Yes - no hidden fees', 'Fully licensed & insured'],
            highlight: true,
          },
          ...comparisons.comparisons.map((c) => ({
            option: c.competitor.name,
            cells: [
              c.competitor.rating,
              c.competitor_cons.find(con => con.toLowerCase().includes('price') || con.toLowerCase().includes('fee') || con.toLowerCase().includes('cost')) ? 'Reports of hidden fees' : 'Varies',
              c.competitor_cons.find(con => con.toLowerCase().includes('licen') || con.toLowerCase().includes('insur')) ? 'Check credentials' : 'Yes',
            ],
          })),
        ]}
      />

      {/* CTA Section */}
      <QuoteSection
        title="Ready to Experience the Rapid Panda Difference?"
        subtitle="Get a free, no-obligation quote and see why Miami residents choose us over the competition."
      />
    </div>
  );
}
