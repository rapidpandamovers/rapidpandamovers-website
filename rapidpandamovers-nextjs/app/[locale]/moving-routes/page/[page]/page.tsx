import { notFound, redirect } from 'next/navigation';
import RoutesContent from '../../RoutesContent';
import { allLongDistanceRoutes, allLocalRoutes } from '@/lib/data';
import { locales } from '@/i18n/config';
import { generatePageMetadata } from '@/lib/metadata';
import { getLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';

const ROUTES_PER_PAGE = 24;

export async function generateStaticParams() {
  const totalRoutes =
    allLongDistanceRoutes.filter(r => r.is_active !== false).length +
    allLocalRoutes.filter(r => r.is_active !== false).length;
  const totalPages = Math.ceil(totalRoutes / ROUTES_PER_PAGE);

  const pages = Array.from({ length: totalPages - 1 }, (_, i) => ({
    page: String(i + 2),
  }));
  return locales.flatMap(locale => pages.map(p => ({ locale, ...p })));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const locale = await getLocale() as Locale;

  return generatePageMetadata({
    title: `Moving Routes - Page ${page} | Rapid Panda Movers`,
    description: `Browse our moving routes - Page ${page}. Professional moving services for local and long distance moves across Florida and nationwide.`,
    path: `/moving-routes/page/${page}`,
    locale,
    noIndex: true,
  });
}

export default async function RoutesPaginatedPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const pageNum = parseInt(page, 10);

  if (pageNum === 1) {
    redirect('/moving-routes');
  }

  const totalRoutes =
    allLongDistanceRoutes.filter(r => r.is_active !== false).length +
    allLocalRoutes.filter(r => r.is_active !== false).length;
  const totalPages = Math.ceil(totalRoutes / ROUTES_PER_PAGE);

  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
    notFound();
  }

  return <RoutesContent currentPage={pageNum} />;
}
