import { redirect } from 'next/navigation';
import { titleCase } from '@/lib/data';
import RoutesContent from '../../../RoutesContent';

export async function generateMetadata({ params }: { params: Promise<{ location: string; page: string }> }) {
  const { location, page } = await params;
  const name = titleCase(location);

  return {
    title: `Moving Routes from ${name} - Page ${page} | Rapid Panda Movers`,
    description: `Browse moving routes from ${name} - Page ${page}. Professional moving services with transparent pricing.`,
  };
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
