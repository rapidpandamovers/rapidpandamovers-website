import Hero from './Hero';
import WhySection from './WhySection';
import AboutSection from './AboutSection';
import AutoLinks from '@/components/AutoLinks';
import { buildLinkBlocks } from '@/components/buildLinkBlocks';
import { allRoutes, allServices, titleCase } from '@/lib/data';
import { MapPin, Navigation } from 'lucide-react';
import Link from 'next/link';

interface LocationPageProps {
  city: {
    name: string;
    slug: string;
    population?: number;
    lat?: number;
    lng?: number;
    neighborhoods?: Array<{
      name: string;
      slug: string;
      zip_codes?: string[];
      is_active?: boolean;
    }>;
  };
}

export default function LocationPage({ city }: LocationPageProps) {
  const slug = `${city.slug}-movers`;
  const blocks = buildLinkBlocks(slug);
  
  // Get routes from this city (compare slugs)
  const routesFromCity = allRoutes.filter(r =>
    r.origin_name === city.slug
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={`${city.name} Movers`}
        description={`Professional moving services in ${city.name}. Expert local and long-distance moving with experienced crews and transparent pricing.`}
        cta="Get Your Free Quote"
        image_url="https://www.rapidpandamovers.com/wp-content/uploads/2024/11/about-us-rapid-panda.png"
      />

      {/* City Info Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Professional Moving Services in <span className="text-orange-500">{city.name}</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Rapid Panda Movers provides comprehensive moving services throughout {city.name} and the surrounding areas. 
              Whether you're moving locally or long-distance, we're here to make your move stress-free and efficient.
            </p>
            {city.population && (
              <div className="text-gray-600 text-lg">
                Serving {city.name} (Population: {city.population.toLocaleString()})
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Neighborhoods Section */}
      {city.neighborhoods && city.neighborhoods.filter(n => n.is_active !== false).length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Neighborhoods We Serve in <span className="text-orange-500">{city.name}</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We provide moving services throughout all neighborhoods in {city.name}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
              {city.neighborhoods
                .filter(n => n.is_active !== false)
                .map((neighborhood, index) => (
                  <Link
                    key={index}
                    href={`/${neighborhood.slug}-movers`}
                    className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <MapPin className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-800 group-hover:text-orange-500 text-sm mb-1 transition-colors">{neighborhood.name}</h4>
                    {neighborhood.zip_codes && neighborhood.zip_codes.length > 0 && (
                      <p className="text-xs text-gray-500">{neighborhood.zip_codes.join(', ')}</p>
                    )}
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Routes Section */}
      {routesFromCity.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Popular Routes from <span className="text-orange-500">{city.name}</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Moving from {city.name}? We provide reliable moving services to these popular destinations
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {routesFromCity.slice(0, 6).map((route, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <Navigation className="w-6 h-6 text-orange-500" />
                    <span className="text-sm text-gray-500 font-normal">
                      {route.distance_mi} mi • {Math.round(route.drive_time_min / 60)}h {route.drive_time_min % 60}m
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {titleCase(route.origin_name)} to {titleCase(route.destination_name)}
                  </h3>
                  {route.house_sizes?.['1_bedroom']?.min_cost && (
                    <p className="text-orange-500 font-semibold">
                      Starting from ${route.house_sizes['1_bedroom'].min_cost.toLocaleString()}
                    </p>
                  )}
                  <a
                    href={`/${route.slug}-movers`}
                    className="text-orange-600 hover:text-orange-700 font-medium mt-4 inline-block"
                  >
                    Learn More →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Available Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Moving Services in <span className="text-orange-500">{city.name}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a complete range of moving services to meet all your relocation needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {allServices
              .filter(service => service.is_active !== false)
              .slice(0, 6)
              .map((service, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{service.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                  <a
                    href={`/${service.slug}-${city.slug}-movers`}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Learn More →
                  </a>
                </div>
              ))}
          </div>
        </div>
      </section>

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

      {/* About Us */}
      <AboutSection />

      {/* Final CTA */}
    </div>
  );
}

