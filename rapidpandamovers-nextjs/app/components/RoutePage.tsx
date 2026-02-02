import Hero from './Hero';
import WhySection from './WhySection';
import PricingSection from './PricingSection';
import MapSection from './MapSection';
import TravelSection from './TravelSection';
import { allRoutes, titleCase, getCityNameBySlug } from '@/lib/data';
import { Navigation, ArrowRight } from 'lucide-react';
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

// Helper function to extract state from location name (e.g., "akron-oh" -> "OH")
// Returns "FL" for Florida locations without state suffix
function getStateFromName(name: string): string {
  const parts = name.split('-');
  const lastPart = parts[parts.length - 1];
  // Check if last part is a 2-letter state code
  if (lastPart.length === 2 && /^[a-z]{2}$/i.test(lastPart)) {
    return lastPart.toUpperCase();
  }
  return 'FL';
}

export default function RoutePage({ route }: RoutePageProps) {
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
      <TravelSection
        origin={fromCityTitle}
        destination={toCityTitle}
        originSlug={route.origin_name}
        destinationSlug={route.destination_name}
        distanceMiles={route.distance_mi}
        driveTimeMinutes={route.drive_time_min}
        startingCost={route.avg_cost_usd}
        destinationHasPage={getStateFromName(route.destination_name) === 'FL'}
      />

      {/* Estimated Moving Costs */}
      {route.house_sizes && (
        <PricingSection
          houseSizes={route.house_sizes}
          originCity={getCityNameBySlug(route.origin_name) || fromCityTitle}
          originZip={route.origin_zip}
          destinationCity={getCityNameBySlug(route.destination_name) || toCityTitle}
          destinationZip={route.destination_zip}
        />
      )}

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
      
      {/* Map Section */}
      <MapSection
        route={{
          origin: fromCityTitle,
          destination: toCityTitle,
          originZip: route.origin_zip,
          destinationZip: route.destination_zip,
          originState: getStateFromName(route.origin_name),
          destinationState: getStateFromName(route.destination_name),
        }}
      />

      {/* Why Choose Us */}
      <WhySection />
    </div>
  );
}

