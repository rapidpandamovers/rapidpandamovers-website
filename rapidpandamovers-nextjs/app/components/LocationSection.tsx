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
  // Variant: 'default' shows all cities, 'compact' shows top 12 by population
  variant?: 'default' | 'compact';
  // Hide the section header entirely
  hideHeader?: boolean;
}

export default function LocationSection({ city, title, description, variant = 'default', hideHeader = false }: LocationSectionProps = {}) {
  // If city with neighborhoods is provided, show neighborhoods mode
  if (city?.neighborhoods) {
    const activeNeighborhoods = city.neighborhoods.filter(n => n.is_active !== false).sort((a, b) => a.name.localeCompare(b.name));

    if (activeNeighborhoods.length === 0) {
      return null;
    }

    return (
      <section className="pt-20">
        <div className="container mx-auto">
          {!hideHeader && (
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Neighborhoods We Serve in {city.name}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We provide moving services throughout all neighborhoods in {city.name}
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeNeighborhoods.map((neighborhood, index) => (
              <Link
                key={index}
                href={`/${neighborhood.slug}-movers`}
                className="bg-gray-50 rounded-2xl p-5 flex items-center gap-3 hover:bg-orange-50 transition-colors group"
              >
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-800 group-hover:text-orange-500 transition-colors">
                    {neighborhood.name}
                  </span>
                  {neighborhood.zip_codes && neighborhood.zip_codes.length > 0 && (
                    <p className="text-xs text-gray-500">{neighborhood.zip_codes.join(', ')}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const cities = getAllActiveCities()

  // Compact variant: top 12 cities by population with "and more" messaging
  if (variant === 'compact') {
    const topCities = [...cities]
      .sort((a, b) => (b.population || 0) - (a.population || 0))
      .slice(0, 12)
    const remainingCount = cities.length - topCities.length

    return (
      <section className="pt-20">
        <div className="container mx-auto">
          {!hideHeader && (
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {title || 'Locations We Serve'}
                </h2>
                <p className="text-lg text-gray-600">
                  {description || `Serving ${cities.length}+ cities and neighborhoods across Miami-Dade County`}
                </p>
              </div>
              <Link
                href="/locations"
                className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold mt-4 md:mt-0"
              >
                View All Locations
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topCities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}-movers`}
                className="bg-gray-50 rounded-2xl p-5 flex items-center gap-3 hover:bg-orange-50 transition-colors group"
              >
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="font-medium text-gray-800 group-hover:text-orange-500 transition-colors">
                  {city.name}
                </span>
              </Link>
            ))}
          </div>

          {remainingCount > 0 && (
            <div className="text-center mt-8">
              <Link
                href="/locations"
                className="text-gray-500 hover:text-orange-500 transition-colors"
              >
                + {remainingCount} more areas served
              </Link>
            </div>
          )}
        </div>
      </section>
    )
  }

  // Default: show all cities sorted alphabetically
  const sortedCities = [...cities].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <section className="pt-20">
      <div className="container mx-auto">
        {!hideHeader && (
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              {title || 'Locations We Serve'}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {description || `Serving ${cities.length}+ cities and neighborhoods across Miami-Dade County`}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedCities.map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}-movers`}
              className="bg-gray-50 rounded-2xl p-5 flex items-center gap-3 hover:bg-orange-50 transition-colors group"
            >
              <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span className="font-medium text-gray-800 group-hover:text-orange-500 transition-colors">
                {city.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
