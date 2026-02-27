'use client'

import { useState } from 'react';
import { Navigation, ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useMessages, useLocale } from 'next-intl';
import { allRoutes, allLocalRoutes, titleCase } from '@/lib/data';
import { getTranslatedSlug } from '@/i18n/slug-map';
import type { Locale } from '@/i18n/config';
import { H2, H3 } from '@/app/components/Heading';

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
  const { ui } = useMessages() as any;
  const locale = useLocale() as Locale;

  let relevantRoutes: Route[] = [];
  let defaultTitle = ui.routes.popularRoutes;
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
      defaultTitle = ui.routes.popularRoutes;
      defaultSubtitle = ui.routes.routesFromAndCity.replace('{name}', location.name).replace('{city}', location.parentCity!.name);
    } else {
      relevantRoutes = allRoutes.filter((r: Route) =>
        r.origin_name === location.slug
      ).slice(0, maxItems);
      defaultTitle = ui.routes.popularRoutesFrom.replace('{name}', location.name);
      defaultSubtitle = ui.routes.routesFromSubtitle.replace('{name}', location.name);
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

  const routesSlug = getTranslatedSlug('moving-routes', locale);

  // Left variant: left-aligned header with inline CTA link
  if (variant === 'left') {
    const ctaText = location ? ui.routes.viewAllLocationRoutes.replace('{name}', location.name) : ui.routes.viewAllRoutes;
    const ctaHref = location ? `/${routesSlug}/${location.slug}` : `/${routesSlug}`;

    return (
      <section className="pt-20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 px-6 md:px-0">
            <div>
              <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {displayTitle}
              </H2>
              {displaySubtitle && (
                <p className="text-lg text-gray-600">
                  {displaySubtitle}
                </p>
              )}
            </div>
            <Link
              href={ctaHref}
              className="inline-flex items-center text-orange-600 hover:text-orange-800 font-semibold mt-4 md:mt-0"
            >
              {ctaText}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
          <div className={`grid ${gridCols} gap-6`}>
              {relevantRoutes.slice(0, maxItems).map((route, index) => {
                const hours = Math.floor(route.drive_time_min / 60);
                const mins = route.drive_time_min % 60;
                const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
                const cost = showPrice ? getRouteCost(route) : undefined;
                return (
                  <Link
                    key={index}
                    href={`/${getTranslatedSlug(`${route.slug}-movers`, locale)}`}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-600 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Navigation className="w-6 h-6 text-orange-500" />
                      <span className="text-sm text-gray-500">
                        {route.distance_mi} mi • {timeDisplay}
                      </span>
                    </div>
                    <H3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                      {titleCase(route.origin_name)} {ui.routes.to} {titleCase(route.destination_name)}
                    </H3>
                    {cost && (
                      <p className="text-orange-600 font-bold text-lg mb-3">
                        {ui.routes.startingFrom.replace('${cost}', '$' + cost.toLocaleString())}
                      </p>
                    )}
                    <div className="text-orange-600 group-hover:text-orange-600 font-medium flex items-center">
                      {ui.routes.viewRoute}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-20">
      <div className="container mx-auto">
        <div className="text-center mb-12 px-6 md:px-0">
          <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {displayTitle}
          </H2>
          {displaySubtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {displaySubtitle}
            </p>
          )}
        </div>
        <div className={`grid ${gridCols} gap-6`}>
            {displayedRoutes.map((route, index) => {
              const hours = Math.floor(route.drive_time_min / 60);
              const mins = route.drive_time_min % 60;
              const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
              const cost = showPrice ? getRouteCost(route) : undefined;
              return (
                <Link
                  key={index}
                  href={`/${getTranslatedSlug(`${route.slug}-movers`, locale)}`}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-600 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Navigation className="w-6 h-6 text-orange-500" />
                    <span className="text-sm text-gray-500">
                      {route.distance_mi} mi • {timeDisplay}
                    </span>
                  </div>
                  <H3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                    {titleCase(route.origin_name)} {ui.routes.to} {titleCase(route.destination_name)}
                  </H3>
                  {cost && (
                    <p className="text-orange-600 font-bold text-lg mb-3">
                      {ui.routes.startingFrom.replace('${cost}', '$' + cost.toLocaleString())}
                    </p>
                  )}
                  <div className="text-orange-600 group-hover:text-orange-600 font-medium flex items-center">
                    {ui.routes.viewRoute}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
        </div>
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center px-6 py-3 border-2 border-orange-600 text-orange-600 font-semibold rounded-lg hover:bg-orange-600 hover:text-white transition-colors"
            >
              {showAll ? ui.routes.showLess : ui.routes.showAllRoutes.replace('{count}', String(relevantRoutes.length))}
              <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${showAll ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
        {location && (
          <div className="text-center mt-8">
            <Link
              href={`/${routesSlug}/${location.slug}`}
              className="inline-flex items-center px-6 py-3 border-2 border-orange-600 text-orange-600 font-semibold rounded-lg hover:bg-orange-600 hover:text-white transition-colors"
            >
              {ui.routes.viewAllLocationRoutes.replace('{name}', location.name)}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
