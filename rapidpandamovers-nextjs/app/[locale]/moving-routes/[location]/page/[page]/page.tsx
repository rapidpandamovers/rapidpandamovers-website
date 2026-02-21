import { redirect } from 'next/navigation';
import { titleCase } from '@/lib/data';
import RoutesContent from '../../../RoutesContent';
import { generatePageMetadata } from '@/lib/metadata';
import { getLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';

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

  if (isNaN(pageNum) || pageNum < 1) {
    redirect(`/moving-routes/${location}`);
  }

  if (pageNum === 1) {
    redirect(`/moving-routes/${location}`);
  }

  return <RoutesContent currentPage={pageNum} fromLocation={location} />;
}
