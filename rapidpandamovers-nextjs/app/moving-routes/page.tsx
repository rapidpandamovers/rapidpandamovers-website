import RoutesContent from './RoutesContent';

export const metadata = {
  title: 'Moving Routes | Rapid Panda Movers',
  description: 'Browse all our moving routes. Professional moving services for local and long distance moves across Florida and nationwide.',
};

export default function RoutesPage() {
  return <RoutesContent currentPage={1} />;
}
