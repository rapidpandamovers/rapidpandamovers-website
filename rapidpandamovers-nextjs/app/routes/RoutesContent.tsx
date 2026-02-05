'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { allLongDistanceRoutes, allLocalRoutes, titleCase } from '@/lib/data';
import { Navigation, ChevronDown, MapPin } from 'lucide-react';

const INITIAL_DISPLAY_COUNT = 12;

interface Route {
  slug: string;
  origin_name: string;
  origin_slug?: string;
  destination_name: string;
  destination_slug?: string;
  distance_mi: number;
  drive_time_min: number;
  is_active?: boolean;
  house_sizes?: {
    '1_bedroom'?: {
      min_cost?: number;
    };
  };
}

function RouteCard({ route, showPrice = true }: { route: Route; showPrice?: boolean }) {
  const hours = Math.floor(route.drive_time_min / 60);
  const mins = route.drive_time_min % 60;
  const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <Link
      href={`/${route.slug}-movers`}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group"
    >
      <div className="flex items-center justify-between mb-2">
        <Navigation className="w-5 h-5 text-orange-500" />
        <span className="text-xs text-gray-500">
          {route.distance_mi} mi
        </span>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">
        {titleCase(route.origin_name)} to {titleCase(route.destination_name)}
      </h3>
      <p className="text-sm text-gray-500 mb-2">
        {timeDisplay} drive
      </p>
      {showPrice && route.house_sizes?.['1_bedroom']?.min_cost && (
        <p className="text-orange-500 font-bold">
          From ${route.house_sizes['1_bedroom'].min_cost.toLocaleString()}
        </p>
      )}
    </Link>
  );
}

function RouteSection({
  title,
  subtitle,
  routes,
  showPrice = true,
  initialCount = INITIAL_DISPLAY_COUNT,
}: {
  title: string;
  subtitle: string;
  routes: Route[];
  showPrice?: boolean;
  initialCount?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const displayedRoutes = showAll ? routes : routes.slice(0, initialCount);
  const hasMore = routes.length > initialCount;

  if (routes.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {title.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-orange-500">{title.split(' ').slice(-1)}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {displayedRoutes.map((route, index) => (
            <RouteCard key={index} route={route} showPrice={showPrice} />
          ))}
        </div>
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
            >
              {showAll ? 'Show Less' : `Show All ${routes.length} Routes`}
              <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${showAll ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function RoutesContent() {
  const searchParams = useSearchParams();
  const fromLocation = searchParams.get('from');
  const routeType = searchParams.get('type');

  const longDistanceRoutes = useMemo(() =>
    allLongDistanceRoutes.filter(r => r.is_active !== false),
    []
  );

  const localRoutes = useMemo(() =>
    allLocalRoutes.filter(r => r.is_active !== false),
    []
  );

  // Filter routes based on URL params
  const filteredLongDistance = useMemo(() => {
    if (!fromLocation) return longDistanceRoutes;
    const locationSlug = fromLocation.toLowerCase();
    return longDistanceRoutes.filter(r =>
      r.origin_name.toLowerCase() === locationSlug ||
      r.destination_name.toLowerCase() === locationSlug ||
      r.origin_name.toLowerCase().includes(locationSlug) ||
      r.destination_name.toLowerCase().includes(locationSlug)
    );
  }, [longDistanceRoutes, fromLocation]);

  const filteredLocal = useMemo(() => {
    if (!fromLocation) return localRoutes;
    const locationSlug = fromLocation.toLowerCase();
    return localRoutes.filter(r =>
      r.origin_name.toLowerCase() === locationSlug ||
      r.destination_name.toLowerCase() === locationSlug ||
      r.origin_name.toLowerCase().includes(locationSlug) ||
      r.destination_name.toLowerCase().includes(locationSlug)
    );
  }, [localRoutes, fromLocation]);

  // Determine which sections to show based on type param
  const showLongDistance = !routeType || routeType === 'long-distance';
  const showLocal = !routeType || routeType === 'local';

  // If filtered by location, show those routes first with higher initial count
  const locationFilteredInitialCount = fromLocation ? 24 : INITIAL_DISPLAY_COUNT;

  return (
    <>
      {/* Filter indicator */}
      {fromLocation && (
        <div className="py-4 bg-orange-50 border-b border-orange-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 text-orange-700">
              <MapPin className="w-5 h-5" />
              <span>Showing routes from/to <strong>{titleCase(fromLocation)}</strong></span>
              <Link
                href="/routes"
                className="ml-4 text-sm underline hover:no-underline"
              >
                View all routes
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Route type tabs */}
      {!fromLocation && (
        <div className="py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-4">
              <Link
                href="/routes"
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  !routeType
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Routes
              </Link>
              <Link
                href="/routes?type=long-distance"
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  routeType === 'long-distance'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Long Distance
              </Link>
              <Link
                href="/routes?type=local"
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  routeType === 'local'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Local
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Long Distance Routes */}
      {showLongDistance && (
        <RouteSection
          title="Long Distance Routes"
          subtitle="Interstate and cross-country moving services with guaranteed delivery windows"
          routes={filteredLongDistance}
          showPrice={true}
          initialCount={locationFilteredInitialCount}
        />
      )}

      {/* Local Routes */}
      {showLocal && (
        <RouteSection
          title="Local Routes"
          subtitle="Short distance moves within the Miami-Dade area"
          routes={filteredLocal}
          showPrice={true}
          initialCount={locationFilteredInitialCount}
        />
      )}

      {/* No results message */}
      {fromLocation && filteredLongDistance.length === 0 && filteredLocal.length === 0 && (
        <div className="py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xl text-gray-600 mb-4">
              No routes found for "{titleCase(fromLocation)}"
            </p>
            <Link
              href="/routes"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              View All Routes
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
