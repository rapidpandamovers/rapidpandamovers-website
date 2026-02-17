import Hero from './Hero';
import WhySection from './WhySection';
import AboutSection from './AboutSection';
import LocationSection from './LocationSection';
import RouteSection from './RouteSection';
import ServiceSection from './ServiceSection';
import BlogSection from './BlogSection';
import MapSection from './MapSection';
import OverviewSection from './OverviewSection';
import Breadcrumbs from './Breadcrumbs';
import QuoteSection from './QuoteSection';


interface LocationPageProps {
  city: {
    name: string;
    slug: string;
    population?: number;
    lat?: number;
    lng?: number;
    zip_codes?: string[];
    description?: string;
    neighborhoods?: Array<{
      name: string;
      slug: string;
      zip_codes?: string[];
      description?: string;
      is_active?: boolean;
    }>;
    // Neighborhood-specific fields (present when this is a neighborhood, not a city)
    parentCity?: {
      name: string;
      slug: string;
    };
    county?: {
      name: string;
      slug: string;
    };
    state?: {
      name: string;
      abbreviation: string;
    };
  };
}

export default function LocationPage({ city }: LocationPageProps) {
  // Determine if this is a neighborhood (has parentCity) or a city
  const isNeighborhood = !!city.parentCity;

  // Check if city has only 1 neighborhood that matches the city name
  const activeNeighborhoods = city.neighborhoods?.filter(n => n.is_active !== false) || [];
  const singleMatchingNeighborhood = activeNeighborhoods.length === 1 &&
    activeNeighborhoods[0].name.toLowerCase() === city.name.toLowerCase()
    ? activeNeighborhoods[0]
    : null;

  // If there's a single matching neighborhood, use its data
  const effectiveZipCodes = singleMatchingNeighborhood?.zip_codes || city.zip_codes;
  const effectiveDescription = singleMatchingNeighborhood?.description || city.description;

  // Don't show neighborhoods section if there's only one matching neighborhood
  const showNeighborhoods = !isNeighborhood && city.neighborhoods && !singleMatchingNeighborhood;

  // Hero description varies based on type
  const heroDescription = isNeighborhood
    ? `Professional moving services in ${city.name}, ${city.parentCity!.name}. Local movers you can trust.`
    : `Professional moving services in ${city.name}. Expert local and long-distance moving with experienced crews and transparent pricing.`;

  // Build breadcrumb items
  const breadcrumbItems = isNeighborhood
    ? [
        { label: 'Locations', href: '/locations' },
        { label: `${city.parentCity!.name}`, href: `/${city.parentCity!.slug}-movers` },
        { label: city.name },
      ]
    : [
        { label: 'Locations', href: '/locations' },
        { label: city.name },
      ];

  // Build info text for zip codes and population
  const infoText = isNeighborhood
    ? (effectiveZipCodes && effectiveZipCodes.length > 0 ? `ZIP Codes: ${effectiveZipCodes.join(', ')}` : undefined)
    : (effectiveZipCodes && effectiveZipCodes.length > 0
        ? `ZIP Codes: ${effectiveZipCodes.join(', ')}${city.population ? ` • Population: ${city.population.toLocaleString()}` : ''}`
        : (city.population ? `Serving ${city.name} (Population: ${city.population.toLocaleString()})` : undefined));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={`${city.name} Movers`}
        description={heroDescription}
        cta="Get Your Free Quote"
        image_url="https://www.rapidpandamovers.com/wp-content/uploads/2024/11/about-us-rapid-panda.png"
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} showBackground={true} />

      {/* Content Section */}
      <OverviewSection
        title={<>Professional Moving Services in <span className="text-orange-500">{city.name}</span></>}
      >
        {isNeighborhood ? (
          <p className="text-lg text-gray-700 font-medium mb-4">
            Serving {city.name} and the greater {city.parentCity!.name} area
          </p>
        ) : (
          <p className="text-gray-600 leading-relaxed mb-4">
            Rapid Panda Movers provides comprehensive moving services throughout {city.name} and the surrounding areas. Whether you&apos;re moving locally or long-distance, we&apos;re here to make your move stress-free and efficient.
          </p>
        )}

        {effectiveDescription && (
          <p className="text-gray-600 leading-relaxed mb-4">{effectiveDescription}</p>
        )}

        {infoText && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-medium">{infoText}</p>
          </div>
        )}
      </OverviewSection>

      {/* Map Section */}
      <MapSection
        location={{
          name: city.name,
          city: isNeighborhood ? city.parentCity!.name : city.name,
          state: 'FL',
          zip: effectiveZipCodes?.[0],
        }}
        title={`${city.name} Service Area`}
      />

      {/* Neighborhoods Section - Only for Cities with multiple neighborhoods */}
      {showNeighborhoods && <LocationSection city={city} />}

      {/* Available Services Section */}
      <ServiceSection location={city} />

      {/* Popular Routes Section */}
      <RouteSection location={city} />

      {/* Related Blog Posts */}
      <BlogSection
        variant="compact"
        locationFilter={city.slug}
        locationFilterFallback={isNeighborhood ? city.parentCity!.slug : undefined}
        showFeatured={false}
        showCategories={false}
        title={`Moving Tips for ${city.name}`}
        subtitle={`Helpful guides for your ${city.name} move`}
        viewMoreTitle="More Moving Tips"
        viewMoreSubtitle="Browse our full collection of moving guides and advice"
        viewMoreButtonText="View All Moving Tips"
        viewMoreLink="/blog"
      />

      {/* Why Choose Us */}
      <WhySection />

      {/* About Us - Only for Cities */}
      {!isNeighborhood && <AboutSection />}

      {/* CTA Section */}
      <QuoteSection />
    </div>
  );
}

