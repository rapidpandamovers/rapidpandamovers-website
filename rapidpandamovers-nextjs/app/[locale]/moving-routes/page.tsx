import RoutesContent from './RoutesContent';
import { getMessages, getLocale } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/metadata';
import type { Locale } from '@/i18n/config';

export async function generateMetadata() {
  const locale = await getLocale() as Locale
  const { meta } = (await getMessages()) as any
  return generatePageMetadata({
    title: meta.routes.title,
    description: meta.routes.description,
    path: meta.routes.path,
    locale,
  })
}

export default function RoutesPage() {
  return <RoutesContent currentPage={1} />;
}
