import Hero from './Hero';
import WhySection from './WhySection';
import AboutSection from './AboutSection';
import LocationSection from './LocationSection';
import RouteSection from './RouteSection';
import ServiceSection from './ServiceSection';
import BlogSection from './BlogSection';
import MapSection from './MapSection';
import ContentSection from './ContentSection';
import Breadcrumbs from './Breadcrumbs';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
      <ContentSection
        title="Professional Moving Services in"
        titleHighlight={city.name}
        subtitle={isNeighborhood ? `Serving ${city.name} and the greater ${city.parentCity!.name} area` : undefined}
        description={isNeighborhood ? undefined : `Rapid Panda Movers provides comprehensive moving services throughout ${city.name} and the surrounding areas. Whether you're moving locally or long-distance, we're here to make your move stress-free and efficient.`}
        locationDescription={effectiveDescription}
        info={
          isNeighborhood
            ? (effectiveZipCodes && effectiveZipCodes.length > 0 ? `ZIP Codes: ${effectiveZipCodes.join(', ')}` : undefined)
            : (effectiveZipCodes && effectiveZipCodes.length > 0
                ? `ZIP Codes: ${effectiveZipCodes.join(', ')}${city.population ? ` • Population: ${city.population.toLocaleString()}` : ''}`
                : (city.population ? `Serving ${city.name} (Population: ${city.population.toLocaleString()})` : undefined))
        }
        breadcrumbs={
          isNeighborhood && city.county && city.state
            ? [
                { label: `${city.parentCity!.name} Movers`, href: `/${city.parentCity!.slug}-movers` },
                { label: `${city.county.name} County` },
                { label: city.state.name },
              ]
            : undefined
        }
      />

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
      {showNeighborhoods && <LocationSection city={city} showServicesLink />}

      {/* Available Services Section */}
      <ServiceSection location={city} />

      {/* View All Services Link */}
      <div className="container mx-auto text-center pb-12">
        <Link
          href={`/services?location=${city.slug}`}
          className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          View All Services in {city.name}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>

      {/* Popular Routes Section */}
      <RouteSection location={city} />

      {/* Related Blog Posts */}
      <BlogSection
        locationFilter={city.slug}
        locationFilterFallback={isNeighborhood ? city.parentCity!.slug : undefined}
        maxPosts={3}
        showFeatured={false}
        showCategories={false}
        title={`Moving Tips for ${city.name}`}
        subtitle={`Helpful guides for your ${city.name} move`}
        showViewMore={true}
        viewMorePosition="bottom"
        viewMoreLink="/blog"
        viewMoreButtonText="View All Moving Tips"
      />

      {/* Why Choose Us */}
      <WhySection />

      {/* About Us - Only for Cities */}
      {!isNeighborhood && <AboutSection />}
    </div>
  );
}

