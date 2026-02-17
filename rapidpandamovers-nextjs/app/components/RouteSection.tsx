'use client'

import { useState } from 'react';
import { Navigation, ArrowRight, ChevronDown } from 'lucide-react';
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
  // Expandable list support
  showExpandButton?: boolean;
  initialCount?: number;
  // Grid columns
  columns?: 3 | 4;
  // Show price
  showPrice?: boolean;
  // Layout variant
  variant?: 'default' | 'left';
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
  maxItems = 6,
  showExpandButton = false,
  initialCount = 12,
  columns = 3,
  showPrice = true,
  variant = 'default',
}: RouteSectionProps) {
  const [showAll, setShowAll] = useState(false);

  let relevantRoutes: Route[] = [];
  let defaultTitle = 'Popular Routes';
  let defaultSubtitle = '';

  // If routes are provided directly, use them
  if (providedRoutes && providedRoutes.length > 0) {
    relevantRoutes = showExpandButton ? providedRoutes : providedRoutes.slice(0, maxItems);
  }
  // Otherwise, fetch based on location
  else if (location) {
    const isNeighborhood = !!location.parentCity;

    if (isNeighborhood) {
      const neighborhoodRoutes = allLocalRoutes.filter((r: Route) =>
        r.is_active !== false &&
        (r.origin_name === location.slug || r.destination_name === location.slug)
      );

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

  const displayedRoutes = showExpandButton
    ? (showAll ? relevantRoutes : relevantRoutes.slice(0, initialCount))
    : relevantRoutes;
  const hasMore = showExpandButton && relevantRoutes.length > initialCount;

  const gridCols = columns === 4
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  // Left variant: left-aligned header with inline CTA link
  if (variant === 'left') {
    const ctaText = location ? `View All ${location.name} Routes` : 'View All Routes';
    const ctaHref = location ? `/moving-routes/${location.slug}` : '/moving-routes';

    return (
      <section className="pt-20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {displayTitle}
              </h2>
              {displaySubtitle && (
                <p className="text-lg text-gray-600">
                  {displaySubtitle}
                </p>
              )}
            </div>
            <Link
              href={ctaHref}
              className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold mt-4 md:mt-0"
            >
              {ctaText}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
          <div className="bg-gray-50 rounded-4xl p-8">
            <div className={`grid ${gridCols} gap-6`}>
              {relevantRoutes.slice(0, maxItems).map((route, index) => {
                const hours = Math.floor(route.drive_time_min / 60);
                const mins = route.drive_time_min % 60;
                const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
                const cost = showPrice ? getRouteCost(route) : undefined;
                return (
                  <Link
                    key={index}
                    href={`/${route.slug}-movers`}
                    className="bg-white rounded-2xl p-6 hover:bg-orange-50 transition-colors group"
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
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {displayTitle}
          </h2>
          {displaySubtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {displaySubtitle}
            </p>
          )}
        </div>
        <div className="bg-gray-50 rounded-4xl p-8">
          <div className={`grid ${gridCols} gap-6`}>
            {displayedRoutes.map((route, index) => {
              const hours = Math.floor(route.drive_time_min / 60);
              const mins = route.drive_time_min % 60;
              const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
              const cost = showPrice ? getRouteCost(route) : undefined;
              return (
                <Link
                  key={index}
                  href={`/${route.slug}-movers`}
                  className="bg-white rounded-2xl p-6 hover:bg-orange-50 transition-colors group"
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
        </div>
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
            >
              {showAll ? 'Show Less' : `Show All ${relevantRoutes.length} Routes`}
              <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${showAll ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
        {location && (
          <div className="text-center mt-8">
            <Link
              href={`/moving-routes/${location.slug}`}
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
