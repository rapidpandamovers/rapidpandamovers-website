import { MapPin, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { getAllActiveCities } from '@/lib/data'
import { getMessages, getLocale } from 'next-intl/server'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'
import { H2 } from '@/app/components/Heading'

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
  // Variant: 'default' shows all cities, 'compact' shows top 12 by population, 'left' is compact with left-aligned header and optional subtitle
  variant?: 'default' | 'compact' | 'left';
  // Hide the section header entirely
  hideHeader?: boolean;
}

export default async function LocationSection({ city, title, description, variant = 'default', hideHeader = false }: LocationSectionProps = {}) {
  const { ui } = (await getMessages()) as any
  const locale = await getLocale() as Locale
  const locationsSlug = getTranslatedSlug('locations', locale)

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
            <div className="text-center mb-10 px-6 md:px-0">
              <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {ui.location.neighborhoodsTitle.replace('{city}', city.name)}
              </H2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {ui.location.neighborhoodsSubtitle.replace('{city}', city.name)}
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeNeighborhoods.map((neighborhood, index) => (
              <Link
                key={index}
                href={`/${getTranslatedSlug(`${neighborhood.slug}-movers`, locale)}`}
                className="bg-gray-50 rounded-2xl p-5 flex items-center gap-3 hover:bg-orange-50 transition-colors group"
              >
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
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
            <div className="text-center mb-10 px-6 md:px-0">
              <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {title || ui.location.defaultTitle}
              </H2>
              <p className="text-lg text-gray-600">
                {description || ui.location.defaultSubtitle.replace('{count}', String(cities.length))}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topCities.map((city) => (
              <Link
                key={city.slug}
                href={`/${getTranslatedSlug(`${city.slug}-movers`, locale)}`}
                className="bg-gray-50 rounded-2xl p-5 flex items-center gap-3 hover:bg-orange-50 transition-colors group"
              >
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                  {city.name}
                </span>
              </Link>
            ))}
          </div>

          {remainingCount > 0 && (
            <Link
              href={`/${locationsSlug}`}
              className="block bg-orange-50 rounded-2xl py-6 px-6 md:px-0 mt-4 text-center text-orange-600 hover:bg-orange-100 font-semibold text-lg transition-colors"
            >
              {ui.location.moreAreas}
            </Link>
          )}
        </div>
      </section>
    )
  }

  // Left variant: same as compact but with left-aligned header and optional subtitle
  if (variant === 'left') {
    const topCities = [...cities]
      .sort((a, b) => (b.population || 0) - (a.population || 0))
      .slice(0, 12)
    const remainingCount = cities.length - topCities.length

    return (
      <section className="pt-20">
        <div className="container mx-auto">
          {!hideHeader && (
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 px-6 md:px-0">
              <div>
                <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {title || ui.location.defaultTitle}
                </H2>
                {description && (
                  <p className="text-lg text-gray-600">
                    {description}
                  </p>
                )}
              </div>
              <Link
                href={`/${locationsSlug}`}
                className="inline-flex items-center text-orange-600 hover:text-orange-800 font-semibold mt-4 md:mt-0"
              >
                {ui.location.viewAll}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topCities.map((city) => (
              <Link
                key={city.slug}
                href={`/${getTranslatedSlug(`${city.slug}-movers`, locale)}`}
                className="bg-gray-50 rounded-2xl p-5 flex items-center gap-3 hover:bg-orange-50 transition-colors group"
              >
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                  {city.name}
                </span>
              </Link>
            ))}
          </div>

          {remainingCount > 0 && (
            <Link
              href={`/${locationsSlug}`}
              className="block bg-orange-50 rounded-2xl py-6 px-6 md:px-0 mt-4 text-center text-orange-600 hover:bg-orange-100 font-semibold text-lg transition-colors"
            >
              {ui.location.moreAreas}
            </Link>
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
          <div className="text-center mb-10 px-6 md:px-0">
            <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              {title || ui.location.defaultTitle}
            </H2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {description || ui.location.defaultSubtitle.replace('{count}', String(cities.length))}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedCities.map((city) => (
            <Link
              key={city.slug}
              href={`/${getTranslatedSlug(`${city.slug}-movers`, locale)}`}
              className="bg-gray-50 rounded-2xl p-5 flex items-center gap-3 hover:bg-orange-50 transition-colors group"
            >
              <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                {city.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
