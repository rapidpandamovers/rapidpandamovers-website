import Hero from './Hero';
import WhySection from './WhySection';
import PricingSection from './PricingSection';
import AutoLinks from '@/components/AutoLinks';
import { buildLinkBlocks } from '@/components/buildLinkBlocks';
import { allRoutes, titleCase } from '@/lib/data';
import { Navigation, MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface HouseSize {
  min_cost: number;
  max_cost: number;
  avg_cost: number;
  movers: number;
  trucks: number;
  min_hours: number;
  max_hours: number;
}

interface RoutePageProps {
  route: {
    origin_name: string;
    origin_zip?: string;
    destination_name: string;
    destination_zip?: string;
    distance_mi: number;
    drive_time_min: number;
    avg_cost_usd?: number;
    slug: string;
    is_active?: boolean;
    house_sizes?: {
      '1_bedroom'?: HouseSize;
      '2_bedroom'?: HouseSize;
      '3_bedroom'?: HouseSize;
      '4_bedroom'?: HouseSize;
      '4plus_bedroom'?: HouseSize;
    };
  };
}

// Helper function to get avg_cost_usd from route data
function getAvgCost(route: any): number | undefined {
  if ('avg_cost_usd' in route && route.avg_cost_usd) {
    return route.avg_cost_usd;
  }
  if ('house_sizes' in route && route.house_sizes?.['1_bedroom']?.min_cost) {
    return route.house_sizes['1_bedroom'].min_cost;
  }
  return undefined;
}

export default function RoutePage({ route }: RoutePageProps) {
  const blocks = buildLinkBlocks(route.slug);
  
  // Get related routes (same origin or destination)
  const relatedRoutes = allRoutes
    .filter(r => 
      r.slug !== route.slug && 
      r.is_active !== false &&
      (r.origin_name === route.origin_name || r.destination_name === route.destination_name)
    )
    .slice(0, 6);

  const fromCityTitle = titleCase(route.origin_name);
  const toCityTitle = titleCase(route.destination_name);
  const hours = Math.floor(route.drive_time_min / 60);
  const minutes = route.drive_time_min % 60;
  const timeDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={`${fromCityTitle} to ${toCityTitle} Movers`}
        description={`Moving from ${fromCityTitle} to ${toCityTitle}? We provide professional moving services for this route with experienced crews and reliable service.`}
        cta="Get Your Free Quote"
        image_url="https://www.rapidpandamovers.com/wp-content/uploads/2024/11/about-us-rapid-panda.png"
      />

      {/* Route Details Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Moving from <span className="text-orange-500">{fromCityTitle}</span> to <span className="text-orange-500">{toCityTitle}</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Professional moving services for your relocation from {fromCityTitle} to {toCityTitle}
              </p>
            </div>

            {/* Route Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <Navigation className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Distance</h3>
                <p className="text-2xl font-bold text-gray-800">{route.distance_mi} miles</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <Clock className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Drive Time</h3>
                <p className="text-2xl font-bold text-gray-800">{timeDisplay}</p>
              </div>
              {route.avg_cost_usd && (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <DollarSign className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Starting Cost</h3>
                  <p className="text-2xl font-bold text-gray-800">${route.avg_cost_usd.toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Origin & Destination Links */}
            <div className="bg-orange-50 rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Origin & Destination
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link 
                  href={`/${route.origin_name}-movers`}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-6 h-6 text-orange-500" />
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Origin</h4>
                      <p className="text-xl font-bold text-gray-800">{fromCityTitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link 
                  href={`/${route.destination_name}-movers`}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-6 h-6 text-orange-500" />
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Destination</h4>
                      <p className="text-xl font-bold text-gray-800">{toCityTitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Routes Section */}
      {relatedRoutes.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Related <span className="text-orange-500">Routes</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Popular routes from {fromCityTitle} or to {toCityTitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {relatedRoutes.map((relatedRoute, index) => {
                const avgCost = getAvgCost(relatedRoute);
                return (
                <Link
                  key={index}
                  href={`/${relatedRoute.slug}-movers`}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Navigation className="w-6 h-6 text-orange-500" />
                    <span className="text-sm text-gray-500 font-normal">
                      {relatedRoute.distance_mi} mi • {Math.floor(relatedRoute.drive_time_min / 60)}h {relatedRoute.drive_time_min % 60}m
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {titleCase(relatedRoute.origin_name)} to {titleCase(relatedRoute.destination_name)}
                  </h3>
                  {avgCost && (
                    <p className="text-orange-500 font-semibold">
                      Starting from ${avgCost.toLocaleString()}
                    </p>
                  )}
                  <div className="mt-4 text-orange-600 hover:text-orange-700 font-medium flex items-center">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Moving Categories with Pricing */}
      {route.house_sizes && (
        <PricingSection houseSizes={route.house_sizes} />
      )}

      {/* Why Choose Us */}
      <WhySection />

      {/* Auto Links */}
      {blocks.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <AutoLinks blocks={blocks} />
          </div>
        </section>
      )}

      {/* Final CTA */}
    </div>
  );
}

