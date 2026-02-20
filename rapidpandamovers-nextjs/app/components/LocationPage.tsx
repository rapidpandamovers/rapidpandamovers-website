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
import { getPostsByLocation } from '@/lib/blog';


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

  // Check if location has blog posts (for viewMoreLink)
  const hasLocationPosts = getPostsByLocation(city.slug).length > 0;
  const hasParentLocationPosts = isNeighborhood ? getPostsByLocation(city.parentCity!.slug).length > 0 : false;
  const blogViewMoreLink = hasLocationPosts
    ? `/blog/location/${city.slug}`
    : (hasParentLocationPosts ? `/blog/location/${city.parentCity!.slug}` : '/blog');

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

        {effectiveDescription && (
          <p className="text-gray-600 leading-relaxed mb-4">{effectiveDescription}</p>
        )}

        {/* Map Section */}
        <MapSection
          location={{
            name: city.name,
            city: isNeighborhood ? city.parentCity!.name : city.name,
            state: 'FL',
            zip: effectiveZipCodes?.[0],
          }}
          embedded
        />

        {infoText && (
          <div className="mt-4 pb-4">
            <p className="text-sm text-gray-500 font-medium">{infoText}</p>
          </div>
        )}
      </OverviewSection>

      {/* Neighborhoods Section - Only for Cities with multiple neighborhoods */}
      {showNeighborhoods && <LocationSection city={city} />}

      {/* Available Services Section */}
      <ServiceSection
        variant="left"
        location={city}
        title={`Moving Services in ${city.name}`}
      />

      {/* Popular Routes Section */}
      <RouteSection location={city} variant="left" />

      {/* Related Blog Posts */}
      <BlogSection
        variant="left"
        locationFilter={city.slug}
        locationFilterFallback={isNeighborhood ? city.parentCity!.slug : undefined}
        categoryFilterFallback="Location Guide"
        showFeatured={false}
        showCategories={false}
        title={`Moving Tips for ${city.name}`}
        showViewMore
        viewMoreButtonText="View All Articles"
        viewMoreLink={blogViewMoreLink}
        maxPosts={3}
      />

      {/* Why Choose Us */}
      <WhySection variant="left" />

      {/* About Us */}
      <AboutSection />

      {/* CTA Section */}
      <QuoteSection />
    </div>
  );
}

