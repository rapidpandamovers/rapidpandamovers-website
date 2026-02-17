import { titleCase } from '@/lib/data';
import RoutesContent from '../RoutesContent';

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const name = titleCase(location);

  return {
    title: `Moving Routes from ${name} | Rapid Panda Movers`,
    description: `Browse moving routes from ${name}. Professional local and long distance moving services with transparent pricing.`,
  };
}

export default async function RoutesLocationPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  return <RoutesContent currentPage={1} fromLocation={location} />;
}
