import RoutesContent from '../RoutesContent';
import { getLocale } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import type { Locale } from '@/i18n/config';

export async function generateMetadata() {
  const locale = await getLocale() as Locale;
  return generatePageMetadata({
    title: 'Long Distance Moving Routes | Rapid Panda Movers',
    description: 'Browse our long distance moving routes. Professional interstate moving services with experienced crews and transparent pricing.',
    path: '/moving-routes/long-distance',
    locale,
  });
}

export default function LongDistanceRoutesPage() {
  return <RoutesContent currentPage={1} routeType="long-distance" />;
}
