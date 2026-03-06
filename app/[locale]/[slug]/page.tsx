import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getServiceBySlug, getCityBySlug, getNeighborhoodBySlug, getServiceSlugs, getLocationServiceBySlug, getLocalizedServiceBySlug, getLocalizedCityBySlug, getLocalizedNeighborhoodBySlug } from '@/lib/data';
import { generateServiceMetadata, generateLocationMetadata, generateRouteMetadata } from '@/lib/metadata';
import ServicePage from '@/app/components/ServicePage';
import LocationPage from '@/app/components/LocationPage';
import RoutePage from '@/app/components/RoutePage';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getCanonicalSlug, getTranslatedSlug } from '@/i18n/slug-map';
import ServiceSchema from '@/app/components/Schema/ServiceSchema';
import RouteSchema from '@/app/components/Schema/RouteSchema';
import { SITE_CONFIG } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const canonical = getCanonicalSlug(slug, locale as Locale);
  const loc = locale as Locale;

  // Check for location-service combo first (e.g., miami-local-moving)
  const locationService = getLocationServiceBySlug(canonical);
  if (locationService) {
    return generateServiceMetadata(locationService.service, locationService.location, loc);
  }

  // Check for service page
  const service = getServiceBySlug(canonical);
  if (service) {
    return generateServiceMetadata(service, undefined, loc);
  }

  // Check for city page
  const city = getCityBySlug(canonical);
  if (city) {
    return generateLocationMetadata(city, loc);
  }

  // Check for neighborhood page
  const neighborhood = getNeighborhoodBySlug(canonical);
  if (neighborhood) {
    return generateLocationMetadata(neighborhood, loc);
  }

  // Check for route page (lazy-load to avoid 6MB JSON blocking metadata)
  const { getRouteBySlug } = await import('@/lib/routes-data');
  const route = getRouteBySlug(canonical);
  if (route) {
    return generateRouteMetadata(route, loc);
  }

  // Fallback for 404
  return {
    title: 'Page Not Found',
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const canonical = getCanonicalSlug(slug, locale as Locale);

  // Detect content type - check in order: location-service combo, service, city, neighborhood, route
  const locationService = getLocationServiceBySlug(canonical);
  const service = getServiceBySlug(canonical);
  const city = getCityBySlug(canonical);
  const neighborhood = getNeighborhoodBySlug(canonical);
  const { getRouteBySlug } = await import('@/lib/routes-data');
  const route = getRouteBySlug(canonical);

  // Location-specific service pages (e.g., /miami-local-moving)
  if (locationService) {
    const localizedService = getLocalizedServiceBySlug(locationService.service.slug, locale) || locationService.service;
    const localizedLocation = (locationService.locationType === 'neighborhood'
      ? getLocalizedNeighborhoodBySlug(locationService.location.slug, locale)
      : getLocalizedCityBySlug(locationService.location.slug, locale)) || locationService.location;
    return (
      <>
        <ServiceSchema
          name={localizedService.name}
          description={localizedService.description}
          url={`${SITE_CONFIG.domain}/${localizedService.slug}`}
          areaServed={localizedLocation.name}
          locale={locale}
        />
        <ServicePage service={localizedService} location={localizedLocation} />
      </>
    );
  }

  // Render appropriate component based on content type
  if (service) {
    const localizedService = getLocalizedServiceBySlug(service.slug, locale) || service;
    return (
      <>
        <ServiceSchema
          name={localizedService.name}
          description={localizedService.description}
          url={`${SITE_CONFIG.domain}/${localizedService.slug}`}
          locale={locale}
        />
        <ServicePage service={localizedService} />
      </>
    );
  }

  if (city) {
    const localizedCity = getLocalizedCityBySlug(city.slug, locale) || city;
    return <LocationPage city={localizedCity} />;
  }

  // Neighborhoods are now handled by LocationPage (has parentCity field)
  if (neighborhood) {
    const localizedNeighborhood = getLocalizedNeighborhoodBySlug(neighborhood.slug, locale) || neighborhood;
    return <LocationPage city={localizedNeighborhood} />;
  }

  if (route) {
    return (
      <>
        <RouteSchema
          originCity={route.origin_name.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
          destinationCity={route.destination_name.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
          distance={route.distance_mi}
          url={`${SITE_CONFIG.domain}/${route.slug}-movers`}
          locale={locale}
        />
        <RoutePage route={route} />
      </>
    );
  }

  // Trigger 404 for unknown slugs
  notFound();
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const enSlugs = getStaticSlugs();
  return locales.flatMap(locale =>
    enSlugs.map(s => ({
      locale,
      slug: locale === 'en' ? s.slug : getTranslatedSlug(s.slug, locale as Locale),
    }))
  );
}

function getStaticSlugs() {
  const { allCities, getServiceSlugs, getAllLocationServiceSlugs } = require('@/lib/data');
  const { allRoutes } = require('@/lib/routes-data');
  const allCitiesFlat = allCities.states.flatMap((state: any) =>
    state.counties.flatMap((county: any) => county.cities)
  );
  const allNeighborhoods = allCitiesFlat.flatMap((city: any) =>
    (city.neighborhoods || []).filter((n: any) => n.is_active !== false)
  );
  return [
    ...allCitiesFlat.map((c: any) => ({ slug: `${c.slug}-movers` })),
    ...allNeighborhoods.map((n: any) => ({ slug: `${n.slug}-movers` })),
    ...allRoutes.map((r: any) => ({ slug: `${r.slug}-movers` })),
    ...getServiceSlugs().map((s: string) => ({ slug: s })),
    ...getAllLocationServiceSlugs().map((s: string) => ({ slug: s }))
  ];
}
