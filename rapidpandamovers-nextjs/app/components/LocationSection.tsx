import { MapPin } from 'lucide-react'
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
}

export default function LocationSection({ city, title, description }: LocationSectionProps = {}) {
  // If city with neighborhoods is provided, show neighborhoods mode
  if (city?.neighborhoods) {
    const activeNeighborhoods = city.neighborhoods.filter(n => n.is_active !== false);

    if (activeNeighborhoods.length === 0) {
      return null;
    }

    return (
      <section className="pt-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Neighborhoods We Serve in {city.name}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide moving services throughout all neighborhoods in {city.name}
            </p>
          </div>
          <div className="bg-gray-50 rounded-4xl p-8">
            <div className="flex flex-wrap justify-center gap-4">
              {activeNeighborhoods.map((neighborhood, index) => (
                <Link
                  key={index}
                  href={`/${neighborhood.slug}-movers`}
                  className="bg-white rounded-xl p-4 text-center hover:bg-orange-50 transition-colors group w-[calc(50%-8px)] md:w-[calc(25%-12px)] lg:w-[calc(16.666%-14px)]"
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
          </div>
        </div>
      </section>
    );
  }

  // Default: show all cities
  const cities = getAllActiveCities()

  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title || 'Service Locations'}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {description || 'Rapid Panda Movers provides professional moving services throughout Miami-Dade County and beyond. No matter where you\'re moving within our service area, we\'re here to help.'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-4xl p-8">
          <div className="flex flex-wrap justify-center gap-4">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}-movers`}
                className="bg-white rounded-xl p-4 text-center hover:bg-orange-50 transition-colors w-[calc(50%-8px)] md:w-[calc(25%-12px)] lg:w-[calc(16.666%-14px)]"
              >
                <MapPin className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800 text-sm">{city.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
