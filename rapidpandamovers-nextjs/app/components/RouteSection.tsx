import { Navigation, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { allRoutes, allLocalRoutes, titleCase } from '@/lib/data';

interface Route {
  origin_name: string;
  destination_name: string;
  distance_mi: number;
  drive_time_min: number;
  slug: string;
  is_active?: boolean;
  avg_cost_usd?: number;
  house_sizes?: {
    '1_bedroom'?: {
      min_cost: number;
    };
  };
}

interface RouteSectionProps {
  // Option 1: Pass location to auto-fetch relevant routes
  location?: {
    name: string;
    slug: string;
    parentCity?: {
      name: string;
      slug: string;
    };
  };
  // Option 2: Pass routes directly
  routes?: Route[];
  // Customization
  title?: string;
  subtitle?: string;
  maxItems?: number;
}

// Helper function to get cost from route data
function getRouteCost(route: Route): number | undefined {
  if (route.avg_cost_usd) {
    return route.avg_cost_usd;
  }
  if (route.house_sizes?.['1_bedroom']?.min_cost) {
    return route.house_sizes['1_bedroom'].min_cost;
  }
  return undefined;
}

export default function RouteSection({
  location,
  routes: providedRoutes,
  title,
  subtitle,
  maxItems = 6
}: RouteSectionProps) {
  let relevantRoutes: Route[] = [];
  let defaultTitle = 'Popular Routes';
  let defaultSubtitle = '';

  // If routes are provided directly, use them
  if (providedRoutes && providedRoutes.length > 0) {
    relevantRoutes = providedRoutes.slice(0, maxItems);
  }
  // Otherwise, fetch based on location
  else if (location) {
    const isNeighborhood = !!location.parentCity;

    if (isNeighborhood) {
      // For neighborhoods: get routes specific to this neighborhood first
      const neighborhoodRoutes = allLocalRoutes.filter((r: Route) =>
        r.is_active !== false &&
        (r.origin_name === location.slug || r.destination_name === location.slug)
      );

      // Then get parent city routes as fallback
      const cityRoutes = allLocalRoutes.filter((r: Route) =>
        r.is_active !== false &&
        (r.origin_name === location.parentCity!.slug || r.destination_name === location.parentCity!.slug) &&
        r.origin_name !== location.slug &&
        r.destination_name !== location.slug
      );

      relevantRoutes = [...neighborhoodRoutes, ...cityRoutes].slice(0, maxItems);
      defaultTitle = 'Popular Routes';
      defaultSubtitle = `Moving routes from ${location.name} and ${location.parentCity!.name}`;
    } else {
      // For cities: get routes from this city
      relevantRoutes = allRoutes.filter((r: Route) =>
        r.origin_name === location.slug
      ).slice(0, maxItems);
      defaultTitle = `Popular Routes from ${location.name}`;
      defaultSubtitle = `Moving from ${location.name}? We provide reliable moving services to these popular destinations`;
    }
  }

  if (relevantRoutes.length === 0) {
    return null;
  }

  const displayTitle = title ?? defaultTitle;
  const displaySubtitle = subtitle ?? defaultSubtitle;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {displayTitle.includes(' ') ? (
              <>
                {displayTitle.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-orange-500">{displayTitle.split(' ').slice(-1)}</span>
              </>
            ) : (
              <span className="text-orange-500">{displayTitle}</span>
            )}
          </h2>
          {displaySubtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {displaySubtitle}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
          {relevantRoutes.map((route, index) => {
            const hours = Math.floor(route.drive_time_min / 60);
            const mins = route.drive_time_min % 60;
            const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
            const cost = getRouteCost(route);
            return (
              <Link
                key={index}
                href={`/${route.slug}-movers`}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <Navigation className="w-6 h-6 text-orange-500" />
                  <span className="text-sm text-gray-500">
                    {route.distance_mi} mi • {timeDisplay}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
                  {titleCase(route.origin_name)} to {titleCase(route.destination_name)}
                </h3>
                {cost && (
                  <p className="text-orange-500 font-bold text-lg mb-3">
                    Starting from ${cost.toLocaleString()}
                  </p>
                )}
                <div className="text-orange-600 group-hover:text-orange-700 font-medium flex items-center">
                  View Route
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
        {location && (
          <div className="text-center mt-12">
            <Link
              href={`/routes?from=${location.slug}`}
              className="inline-flex items-center px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
            >
              View All {location.name} Routes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
