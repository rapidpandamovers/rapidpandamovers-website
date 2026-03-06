import { notFound } from 'next/navigation';
import RoutesContent from '../../../RoutesContent';
import { locales } from '@/i18n/config';
import { generatePageMetadata } from '@/lib/metadata';
import { getLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';

const ROUTES_PER_PAGE = 24;

export const dynamicParams = false;

export async function generateStaticParams() {
  const { allLongDistanceRoutes } = await import('@/lib/routes-data');
  const totalRoutes = allLongDistanceRoutes.filter(r => r.is_active !== false).length;
  const totalPages = Math.ceil(totalRoutes / ROUTES_PER_PAGE);

  const pages = Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
  return locales.flatMap(locale => pages.map(p => ({ locale, ...p })));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const locale = await getLocale() as Locale;

  return generatePageMetadata({
    title: `Long Distance Moving Routes - Page ${page} | Rapid Panda Movers`,
    description: `Browse our long distance moving routes - Page ${page}. Professional interstate moving services.`,
    path: `/moving-routes/long-distance/page/${page}`,
    locale,
    noIndex: true,
  });
}

export default async function LongDistancePaginatedPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const pageNum = parseInt(page, 10);

  const { allLongDistanceRoutes } = await import('@/lib/routes-data');
  const totalRoutes = allLongDistanceRoutes.filter(r => r.is_active !== false).length;
  const totalPages = Math.ceil(totalRoutes / ROUTES_PER_PAGE);

  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
    notFound();
  }

  return <RoutesContent currentPage={pageNum} routeType="long-distance" />;
}
