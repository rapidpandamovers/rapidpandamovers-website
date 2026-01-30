import Hero from './Hero';
import WhySection from './WhySection';
import { allRoutes, allServices, allLocalRoutes, titleCase } from '@/lib/data';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NeighborhoodPageProps {
  neighborhood: {
    name: string;
    slug: string;
    zip_codes?: string[];
    is_active?: boolean;
    parentCity: {
      name: string;
      slug: string;
    };
    county: {
      name: string;
      slug: string;
    };
    state: {
      name: string;
      abbreviation: string;
    };
  };
}

export default function NeighborhoodPage({ neighborhood }: NeighborhoodPageProps) {
  const slug = `${neighborhood.slug}-movers`;

  // Get routes prioritizing those that specifically include this neighborhood
  const neighborhoodRoutes = allLocalRoutes.filter((r: any) =>
    r.is_active !== false &&
    (r.origin_name === neighborhood.slug || r.destination_name === neighborhood.slug)
  );

  // Get parent city routes as fallback
  const cityRoutes = allLocalRoutes.filter((r: any) =>
    r.is_active !== false &&
    (r.origin_name === neighborhood.parentCity.slug || r.destination_name === neighborhood.parentCity.slug) &&
    r.origin_name !== neighborhood.slug &&
    r.destination_name !== neighborhood.slug
  );

  // Combine: neighborhood routes first, then city routes
  const relevantRoutes = [...neighborhoodRoutes, ...cityRoutes].slice(0, 6);

  // Get active services
  const activeServices = allServices
    .filter(s => s.is_active)
    .slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={`${neighborhood.name} Movers`}
        description={`Professional moving services in ${neighborhood.name}, ${neighborhood.parentCity.name}. Local movers you can trust.`}
        cta="Get Your Free Quote"
        image_url="https://www.rapidpandamovers.com/wp-content/uploads/2024/11/about-us-rapid-panda.png"
      />

      {/* Location Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Moving Services in <span className="text-orange-500">{neighborhood.name}</span>
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                Serving {neighborhood.name} and the greater {neighborhood.parentCity.name} area
              </p>
              {neighborhood.zip_codes && neighborhood.zip_codes.length > 0 && (
                <p className="text-gray-500">
                  ZIP Codes: {neighborhood.zip_codes.join(', ')}
                </p>
              )}
            </div>

            {/* Breadcrumb Links */}
            <div className="bg-gray-50 rounded-lg p-6 mb-12">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <Link
                  href={`/${neighborhood.parentCity.slug}-movers`}
                  className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  {neighborhood.parentCity.name} Movers
                </Link>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{neighborhood.county.name} County</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{neighborhood.state.name}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      {activeServices.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Our <span className="text-orange-500">Services</span> in {neighborhood.name}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Professional moving services tailored to your needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {activeServices.map((service, index) => (
                <Link
                  key={index}
                  href={`/${service.slug}`}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {service.description}
                  </p>
                  <div className="text-orange-600 group-hover:text-orange-700 font-medium flex items-center text-sm">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Routes Section */}
      {relevantRoutes.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Popular <span className="text-orange-500">Routes</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Moving routes from {neighborhood.name} and {neighborhood.parentCity.name}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {relevantRoutes.map((route: any, index: number) => {
                const hours = Math.floor(route.drive_time_min / 60);
                const mins = route.drive_time_min % 60;
                const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
                return (
                  <Link
                    key={index}
                    href={`/${route.slug}-movers`}
                    className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Navigation className="w-6 h-6 text-orange-500" />
                      <span className="text-sm text-gray-500">
                        {route.distance_mi} mi • {timeDisplay}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {titleCase(route.origin_name)} to {titleCase(route.destination_name)}
                    </h3>
                    {route.house_sizes?.['1_bedroom']?.min_cost && (
                      <p className="text-orange-500 font-semibold mb-3">
                        Starting from ${route.house_sizes['1_bedroom'].min_cost.toLocaleString()}
                      </p>
                    )}
                    <div className="text-orange-600 group-hover:text-orange-700 font-medium flex items-center">
                      View Route
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/routes"
                className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
              >
                View All Routes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <WhySection />

      {/* Final CTA */}
    </div>
  );
}
