import RoutesContent from '../RoutesContent';
import { getLocale } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import type { Locale } from '@/i18n/config';

export async function generateMetadata() {
  const locale = await getLocale() as Locale;
  return generatePageMetadata({
    title: 'Local Moving Routes | Rapid Panda Movers',
    description: 'Browse our local moving routes in Miami-Dade County and South Florida. Professional local moving with experienced crews.',
    path: '/moving-routes/local',
    locale,
  });
}

export default function LocalRoutesPage() {
  return <RoutesContent currentPage={1} routeType="local" />;
}
