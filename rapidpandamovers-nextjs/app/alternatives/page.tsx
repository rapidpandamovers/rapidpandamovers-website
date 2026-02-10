import { Truck, Package, Users, HelpCircle } from 'lucide-react';
import alternatives from '@/data/alternatives.json';
import Hero from '../components/Hero';
import QuoteSection from '../components/QuoteSection';
import CompareTable from '../components/CompareTable';
import CompareList from '../components/CompareList';
import OverviewSection from '../components/OverviewSection';

export const metadata = {
  title: 'DIY Moving Alternatives vs Full-Service Movers',
  description: 'Compare DIY moving options like PODS, U-Haul, and labor services to full-service movers. Find the best option for your move.',
};

const typeIcons: Record<string, React.ReactNode> = {
  'Container/Pod Service': <Package className="w-8 h-8 text-orange-500" />,
  'Truck Rental Service': <Truck className="w-8 h-8 text-orange-500" />,
  'Labor-Only Service': <Users className="w-8 h-8 text-orange-500" />,
  'Freight/Container Service': <Package className="w-8 h-8 text-orange-500" />,
};

export default function AlternativesPage() {
  return (
    <div className="min-h-screen">
      <Hero
        title="Moving Alternatives"
        description="Compare DIY options to full-service moving and find what's right for you"
        cta="Get Your Free Quote"
        image_url="https://www.rapidpandamovers.com/wp-content/uploads/2024/11/about-us-rapid-panda.png"
      />

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto">
          <OverviewSection title={<>Rapid Panda Movers vs <span className="text-orange-500">DIY Moving</span></>}>
            <p className="text-xl text-gray-600 mb-8">
              There are many ways to move your belongings. From renting a truck to hiring labor-only services
              to using portable containers, each option has trade-offs. We've analyzed the most popular
              alternatives to help you make an informed decision.
            </p>
            <div className="bg-orange-50 rounded-xl p-6 text-left">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                <HelpCircle className="w-5 h-5 text-orange-500 mr-2" />
                The Real Question to Ask
              </h3>
              <p className="text-gray-700">
                When comparing costs, consider the <strong>true total</strong>: rental fees, mileage, fuel,
                insurance, packing supplies, your time, physical effort, and stress. DIY options often look
                cheaper on paper but can cost more when you factor in everything.
              </p>
            </div>
          </OverviewSection>
        </div>
      </section>

      {/* Alternatives Grid */}
      <CompareList
        title={<>Popular Moving <span className="text-orange-500">Alternatives</span></>}
        subtitle="Click on any option below to see a detailed comparison with full-service moving"
        items={alternatives.alternatives}
        basePath="/alternatives"
        getSlug={(alt) => alt.slug}
        ctaText="Compare to Full-Service"
        renderCard={(alt) => (
          <>
            <div className="flex items-center justify-between mb-4">
              {typeIcons[alt.alternative.type] || <Package className="w-8 h-8 text-orange-500" />}
              <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                {alt.alternative.type}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
              {alt.alternative.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {alt.summary}
            </p>
            <div className="text-sm text-gray-500 mb-4">
              <span className="font-medium">Starting at:</span>{' '}
              {alt.pricing.local !== 'Not available (100+ miles only)'
                ? alt.pricing.local
                : alt.pricing.long_distance}
            </div>
          </>
        )}
      />

      {/* Quick Comparison Table */}
      <CompareTable
        title="Quick Comparison"
        columns={[
          { header: 'You Handle' },
          { header: 'Best For' },
          { header: 'Price Range' },
        ]}
        rows={[
          {
            option: 'Rapid Panda Movers',
            cells: ['Nothing - we do it all', 'Most people, busy schedules', 'Competitive rates'],
            highlight: true,
          },
          {
            option: 'PODS / 1-800-PACK-RAT',
            cells: ['Packing, loading, unloading', 'Flexible timelines, storage needs', '$300 - $8,000'],
          },
          {
            option: 'U-Haul Truck Rental',
            cells: ['Everything + driving', 'Very tight budgets, small moves', '$50 - $2,000+'],
          },
          {
            option: 'HireAHelper',
            cells: ['Transportation, packing', 'Pairing with truck/container', '$339 - $705'],
          },
          {
            option: 'U-Pack',
            cells: ['Packing, loading, unloading', 'Long-distance moves 100+ miles', '$700 - $6,600'],
          },
        ]}
      />

      {/* CTA Section */}
      <QuoteSection />
    </div>
  );
}
