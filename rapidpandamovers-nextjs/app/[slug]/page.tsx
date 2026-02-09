import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getServiceBySlug, getCityBySlug, getRouteBySlug, getNeighborhoodBySlug, getServiceSlugs, getLocationServiceBySlug } from '@/lib/data';
import { generateServiceMetadata, generateLocationMetadata, generateRouteMetadata } from '@/lib/metadata';
import ServicePage from '@/app/components/ServicePage';
import LocationPage from '@/app/components/LocationPage';
import RoutePage from '@/app/components/RoutePage';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  // Check for location-service combo first (e.g., miami-local-moving)
  const locationService = getLocationServiceBySlug(slug);
  if (locationService) {
    return generateServiceMetadata(locationService.service, locationService.location);
  }

  // Check for service page
  const service = getServiceBySlug(slug);
  if (service) {
    return generateServiceMetadata(service);
  }

  // Check for city page
  const city = getCityBySlug(slug);
  if (city) {
    return generateLocationMetadata(city);
  }

  // Check for neighborhood page
  const neighborhood = getNeighborhoodBySlug(slug);
  if (neighborhood) {
    return generateLocationMetadata(neighborhood);
  }

  // Check for route page
  const route = getRouteBySlug(slug);
  if (route) {
    return generateRouteMetadata(route);
  }

  // Fallback for 404
  return {
    title: 'Page Not Found',
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Detect content type - check in order: location-service combo, service, city, neighborhood, route
  const locationService = getLocationServiceBySlug(slug);
  const service = getServiceBySlug(slug);
  const city = getCityBySlug(slug);
  const neighborhood = getNeighborhoodBySlug(slug);
  const route = getRouteBySlug(slug);

  // Location-specific service pages (e.g., /miami-local-moving)
  if (locationService) {
    return <ServicePage service={locationService.service} location={locationService.location} />;
  }

  // Render appropriate component based on content type
  if (service) {
    return <ServicePage service={service} />;
  }

  if (city) {
    return <LocationPage city={city} />;
  }

  // Neighborhoods are now handled by LocationPage (has parentCity field)
  if (neighborhood) {
    return <LocationPage city={neighborhood} />;
  }

  if (route) {
    return <RoutePage route={route} />;
  }

  // Trigger 404 for unknown slugs
  notFound();
}

export async function generateStaticParams() {
  return [
    ...getStaticSlugs(),
  ];
}

function getStaticSlugs() {
  const { allCities, allRoutes, getServiceSlugs, getAllLocationServiceSlugs } = require('@/lib/data');
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
