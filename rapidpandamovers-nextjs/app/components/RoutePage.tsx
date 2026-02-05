import Hero from './Hero';
import WhySection from './WhySection';
import PricingSection from './PricingSection';
import MapSection from './MapSection';
import TravelSection from './TravelSection';
import RouteSection from './RouteSection';
import { allRoutes, titleCase, getCityNameBySlug } from '@/lib/data';

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
      <RouteSection
        title="Related Routes"
        subtitle={`Popular routes from ${fromCityTitle} or to ${toCityTitle}`}
        routes={relatedRoutes}
      />

      {/* Why Choose Us */}
      <WhySection />
    </div>
  );
}

