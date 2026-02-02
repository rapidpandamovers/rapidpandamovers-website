import { Navigation, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { allRoutes, allLocalRoutes, titleCase } from '@/lib/data';

interface RouteSectionProps {
  location: {
    name: string;
    slug: string;
    // If parentCity is present, this is a neighborhood
    parentCity?: {
      name: string;
      slug: string;
    };
  };
}

export default function RouteSection({ location }: RouteSectionProps) {
  const isNeighborhood = !!location.parentCity;

  // Get routes based on whether this is a neighborhood or city
  let relevantRoutes: any[] = [];

  if (isNeighborhood) {
    // For neighborhoods: get routes specific to this neighborhood first
    const neighborhoodRoutes = allLocalRoutes.filter((r: any) =>
      r.is_active !== false &&
      (r.origin_name === location.slug || r.destination_name === location.slug)
    );

    // Then get parent city routes as fallback
    const cityRoutes = allLocalRoutes.filter((r: any) =>
      r.is_active !== false &&
      (r.origin_name === location.parentCity!.slug || r.destination_name === location.parentCity!.slug) &&
      r.origin_name !== location.slug &&
      r.destination_name !== location.slug
    );

    relevantRoutes = [...neighborhoodRoutes, ...cityRoutes].slice(0, 6);
  } else {
    // For cities: get routes from this city
    relevantRoutes = allRoutes.filter(r =>
      r.origin_name === location.slug
    ).slice(0, 6);
  }

  if (relevantRoutes.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Popular <span className="text-orange-500">Routes</span>{!isNeighborhood && ` from ${location.name}`}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isNeighborhood
              ? `Moving routes from ${location.name} and ${location.parentCity!.name}`
              : `Moving from ${location.name}? We provide reliable moving services to these popular destinations`
            }
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {relevantRoutes.map((route: any, index: number) => {
            const hours = Math.floor(route.drive_time_min / 60);
            const mins = route.drive_time_min % 60;
            const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
            return (
              <Link
                key={index}
                href={`/${route.slug}-movers`}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-4">
                  <Navigation className="w-6 h-6 text-orange-500" />
                  <span className="text-sm text-gray-500">
                    {route.distance_mi} mi • {timeDisplay}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {titleCase(route.origin_name)} to {titleCase(route.destination_name)}
                </h3>
                {route.house_sizes?.['1_bedroom']?.min_cost && (
                  <p className="text-orange-500 font-semibold mb-3">
                    Starting from ${route.house_sizes['1_bedroom'].min_cost.toLocaleString()}
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
        {isNeighborhood && (
          <div className="text-center mt-12">
            <Link
              href="/routes"
              className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
            >
              View All Routes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
