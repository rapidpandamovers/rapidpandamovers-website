import { titleCase } from '@/lib/data';
import RoutesContent from '../RoutesContent';
import { getLocale } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import { getAllRouteLocations } from '@/lib/routes-data';

export const dynamicParams = false;

export async function generateStaticParams() {
  const locations = getAllRouteLocations();
  return locales.flatMap(locale =>
    locations.map(location => ({ locale, location }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const locale = await getLocale() as Locale;
  const name = titleCase(location);

  return generatePageMetadata({
    title: `Moving Routes from ${name} | Rapid Panda Movers`,
    description: `Browse moving routes from ${name}. Professional local and long distance moving services with transparent pricing.`,
    path: `/moving-routes/${location}`,
    locale,
  });
}

export default async function RoutesLocationPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  return <RoutesContent currentPage={1} fromLocation={location} />;
}
