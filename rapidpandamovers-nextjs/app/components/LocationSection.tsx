import { MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getAllActiveCities } from '@/lib/data'

interface Neighborhood {
  name: string;
  slug: string;
  zip_codes?: string[];
  is_active?: boolean;
}

interface LocationSectionProps {
  // When city is provided, show neighborhoods for that city
  city?: {
    name: string;
    slug: string;
    neighborhoods?: Neighborhood[];
  };
  // Optional title and description overrides for default (cities) view
  title?: string;
  description?: string;
  // Show "View All Services" link for location pages
  showServicesLink?: boolean;
}

export default function LocationSection({ city, title, description, showServicesLink = false }: LocationSectionProps = {}) {
  // If city with neighborhoods is provided, show neighborhoods mode
  if (city?.neighborhoods) {
    const activeNeighborhoods = city.neighborhoods.filter(n => n.is_active !== false);

    if (activeNeighborhoods.length === 0) {
      return null;
    }

    return (
      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Neighborhoods We Serve in <span className="text-orange-500">{city.name}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide moving services throughout all neighborhoods in {city.name}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mx-auto">
            {activeNeighborhoods.map((neighborhood, index) => (
              <Link
                key={index}
                href={`/${neighborhood.slug}-movers`}
                className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group w-[calc(50%-8px)] md:w-[calc(25%-12px)] lg:w-[calc(16.666%-14px)]"
              >
                <MapPin className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800 group-hover:text-orange-500 text-sm mb-1 transition-colors">
                  {neighborhood.name}
                </h4>
                {neighborhood.zip_codes && neighborhood.zip_codes.length > 0 && (
                  <p className="text-xs text-gray-500">{neighborhood.zip_codes.join(', ')}</p>
                )}
              </Link>
            ))}
          </div>
          {showServicesLink && (
            <div className="text-center mt-12">
              <Link
                href={`/services?location=${city.slug}`}
                className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                View All Services in {city.name}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Default: show all cities
  const cities = getAllActiveCities()

  return (
    <section className="py-20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title || 'Service Locations'}
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            {description || 'Rapid Panda Movers provides professional moving services throughout Miami-Dade County and beyond. No matter where you\'re moving within our service area, we\'re here to help.'}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}-movers`}
              className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all w-[calc(50%-8px)] md:w-[calc(25%-12px)] lg:w-[calc(16.666%-14px)]"
            >
              <MapPin className="w-5 h-5 text-orange-500 mx-auto mb-2" />
              <h4 className="font-medium text-gray-800 text-sm">{city.name}</h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
