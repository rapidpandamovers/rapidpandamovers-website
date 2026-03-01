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
import { getMessages, getLocale } from 'next-intl/server';
import { getTranslatedSlug } from '@/i18n/slug-map';
import type { Locale } from '@/i18n/config';


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

export default async function LocationPage({ city }: LocationPageProps) {
  const locale = await getLocale() as Locale;
  const { ui, content } = (await getMessages()) as any;
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

  // Hero title uses nameTemplate from nav messages
  const nameTemplate = ui.location.nameTemplate || '{name} Movers';
  const heroTitle = nameTemplate.replace('{name}', city.name);

  // Hero description varies based on type
  const heroDescription = isNeighborhood
    ? ui.location.heroDescriptionNeighborhood.replace('{name}', city.name).replace('{parent}', city.parentCity!.name)
    : ui.location.heroDescriptionCity.replace('{name}', city.name);

  // Build breadcrumb items with translated hrefs
  const locationsSlug = getTranslatedSlug('locations', locale);
  const breadcrumbItems = isNeighborhood
    ? [
        { label: ui.location.breadcrumb, href: `/${locationsSlug}` },
        { label: `${city.parentCity!.name}`, href: `/${getTranslatedSlug(`${city.parentCity!.slug}-movers`, locale)}` },
        { label: city.name },
      ]
    : [
        { label: ui.location.breadcrumb, href: `/${locationsSlug}` },
        { label: city.name },
      ];

  // Check if location has blog posts (for viewMoreLink)
  const hasLocationPosts = getPostsByLocation(city.slug, locale).length > 0;
  const hasParentLocationPosts = isNeighborhood ? getPostsByLocation(city.parentCity!.slug, locale).length > 0 : false;
  const locationSegment = getTranslatedSlug('location', locale);
  const blogViewMoreLink = hasLocationPosts
    ? `/blog/${locationSegment}/${city.slug}`
    : (hasParentLocationPosts ? `/blog/${locationSegment}/${city.parentCity!.slug}` : '/blog');

  // Build info text for zip codes and population
  const infoText = isNeighborhood
    ? (effectiveZipCodes && effectiveZipCodes.length > 0 ? `${ui.location.zipCodes} ${effectiveZipCodes.join(', ')}` : undefined)
    : (effectiveZipCodes && effectiveZipCodes.length > 0
        ? `${ui.location.zipCodes} ${effectiveZipCodes.join(', ')}${city.population ? ` • ${ui.location.populationLabel}: ${city.population.toLocaleString()}` : ''}`
        : (city.population ? ui.location.serving.replace('{name}', city.name).replace('{population}', city.population.toLocaleString()) : undefined));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={heroTitle}
        description={heroDescription}
        cta={content.locations.hero.cta}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} showBackground={true} />

      {/* Content Section */}
      <OverviewSection
        title={<>{ui.location.professionalServicesIn.split('{name}')[0]}<span className="text-orange-700">{city.name}</span>{ui.location.professionalServicesIn.split('{name}')[1]}</>}
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
        title={ui.location.movingServicesIn.replace('{name}', city.name)}
      />

      {/* Popular Routes Section */}
      <RouteSection location={city} variant="left" />

      {/* Related Blog Posts */}
      <BlogSection
        variant="left"
        locationFilter={city.slug}
        locationFilterFallback={isNeighborhood ? city.parentCity!.slug : undefined}
        categoryFilterFallback={ui.location.locationGuide}
        showFeatured={false}
        showCategories={false}
        title={ui.location.movingTipsFor.replace('{name}', city.name)}
        showViewMore
        viewMoreButtonText={content.blog.relatedArticles.viewMoreButtonText}
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
