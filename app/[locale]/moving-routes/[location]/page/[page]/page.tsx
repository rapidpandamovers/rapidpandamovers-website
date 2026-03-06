import { notFound } from 'next/navigation';
import { titleCase } from '@/lib/data';
import RoutesContent from '../../../RoutesContent';
import { generatePageMetadata } from '@/lib/metadata';
import { getLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import { getAllRouteLocations, getTotalPagesForLocation } from '@/lib/routes-data';

export const dynamicParams = false;

export async function generateStaticParams() {
  const locations = getAllRouteLocations();
  return locales.flatMap(locale =>
    locations.flatMap(location => {
      const totalPages = getTotalPagesForLocation(location);
      // Only generate pages 2+ (page 1 redirects to the location root)
      return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
        locale,
        location,
        page: String(i + 2),
      }));
    })
  );
}

export async function generateMetadata({ params }: { params: Promise<{ location: string; page: string }> }) {
  const { location, page } = await params;
  const name = titleCase(location);
  const locale = await getLocale() as Locale;

  return generatePageMetadata({
    title: `Moving Routes from ${name} - Page ${page} | Rapid Panda Movers`,
    description: `Browse moving routes from ${name} - Page ${page}. Professional moving services with transparent pricing.`,
    path: `/moving-routes/${location}/page/${page}`,
    locale,
    noIndex: true,
  });
}

export default async function RoutesLocationPaginatedPage({ params }: { params: Promise<{ location: string; page: string }> }) {
  const { location, page } = await params;
  const pageNum = parseInt(page, 10);

  return <RoutesContent currentPage={pageNum} fromLocation={location} />;
}
