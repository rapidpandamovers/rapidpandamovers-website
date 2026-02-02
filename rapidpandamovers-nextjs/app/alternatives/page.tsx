import Link from 'next/link';
import { ArrowRight, Truck, Package, Users, HelpCircle } from 'lucide-react';
import alternatives from '@/data/alternatives.json';
import Hero from '../components/Hero';
import QuoteSection from '../components/QuoteSection';

export const metadata = {
  title: 'Moving Alternatives | DIY vs Full-Service Movers | Rapid Panda Movers',
  description: 'Compare DIY moving options like PODS, U-Haul, and labor services to full-service movers. Find out which option saves you the most time and money.',
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Full-Service vs <span className="text-orange-500">DIY Moving</span>
            </h2>
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
          </div>
        </div>
      </section>

      {/* Alternatives Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Popular Moving <span className="text-orange-500">Alternatives</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Click on any option below to see a detailed comparison with full-service moving
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {alternatives.alternatives.map((alt) => (
              <Link
                key={alt.slug}
                href={`/alternatives/${alt.slug}`}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all group"
              >
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
                <div className="flex items-center text-orange-500 font-medium">
                  Compare to Full-Service
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Comparison Table */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Quick Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 text-left font-bold text-gray-800">Option</th>
                    <th className="p-4 text-left font-bold text-gray-800">You Handle</th>
                    <th className="p-4 text-left font-bold text-gray-800">Best For</th>
                    <th className="p-4 text-left font-bold text-gray-800">Price Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 bg-orange-50">
                    <td className="p-4 font-bold text-orange-600">Full-Service Movers</td>
                    <td className="p-4 text-gray-600">Nothing - we do it all</td>
                    <td className="p-4 text-gray-600">Most people, busy schedules</td>
                    <td className="p-4 text-gray-600">Competitive rates</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium text-gray-800">PODS / 1-800-PACK-RAT</td>
                    <td className="p-4 text-gray-600">Packing, loading, unloading</td>
                    <td className="p-4 text-gray-600">Flexible timelines, storage needs</td>
                    <td className="p-4 text-gray-600">$300 - $8,000</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium text-gray-800">U-Haul Truck Rental</td>
                    <td className="p-4 text-gray-600">Everything + driving</td>
                    <td className="p-4 text-gray-600">Very tight budgets, small moves</td>
                    <td className="p-4 text-gray-600">$50 - $2,000+</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium text-gray-800">HireAHelper</td>
                    <td className="p-4 text-gray-600">Transportation, packing</td>
                    <td className="p-4 text-gray-600">Pairing with truck/container</td>
                    <td className="p-4 text-gray-600">$339 - $705</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium text-gray-800">U-Pack</td>
                    <td className="p-4 text-gray-600">Packing, loading, unloading</td>
                    <td className="p-4 text-gray-600">Long-distance moves 100+ miles</td>
                    <td className="p-4 text-gray-600">$700 - $6,600</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <QuoteSection />
    </div>
  );
}
