'use client';

import { useMemo } from 'react';
import { Link } from '@/i18n/routing';
import { titleCase } from '@/lib/data';
import { allLongDistanceRoutes, allLocalRoutes } from '@/lib/routes-data';
import { MapPin, Navigation, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMessages, useLocale } from 'next-intl';
import { getTranslatedSlug } from '@/i18n/slug-map';
import type { Locale } from '@/i18n/config';
import { H3 } from '@/app/components/Heading';

const ROUTES_PER_PAGE = 24;

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

function getRouteCost(route: Route): number | undefined {
  if (route.avg_cost_usd) return route.avg_cost_usd;
  if (route.house_sizes?.['1_bedroom']?.min_cost) return route.house_sizes['1_bedroom'].min_cost;
  return undefined;
}

interface RoutesContentProps {
  currentPage: number;
  fromLocation?: string;
  routeType?: 'long-distance' | 'local' | null;
}

export default function RoutesContent({ currentPage, fromLocation, routeType }: RoutesContentProps) {
  const { ui } = useMessages() as any;
  const locale = useLocale() as Locale;
  const movingRoutesSlug = getTranslatedSlug('moving-routes', locale);

  const longDistanceRoutes = useMemo(() =>
    allLongDistanceRoutes.filter(r => r.is_active !== false),
    []
  );

  const localRoutes = useMemo(() =>
    allLocalRoutes.filter(r => r.is_active !== false),
    []
  );

  // Filter routes based on location
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

  // Determine which route types to show
  const showLongDistance = !routeType || routeType === 'long-distance';
  const showLocal = !routeType || routeType === 'local';

  // Combine filtered routes: long distance first, then local
  const allFilteredRoutes = useMemo(() => {
    const routes: Route[] = [];
    if (showLongDistance) routes.push(...filteredLongDistance);
    if (showLocal) routes.push(...filteredLocal);
    return routes;
  }, [filteredLongDistance, filteredLocal, showLongDistance, showLocal]);

  // Pagination
  const totalPages = Math.ceil(allFilteredRoutes.length / ROUTES_PER_PAGE);
  const startIndex = (currentPage - 1) * ROUTES_PER_PAGE;
  const paginatedRoutes = allFilteredRoutes.slice(startIndex, startIndex + ROUTES_PER_PAGE);

  // Generate page URL with path-based segments
  const pageSlug = getTranslatedSlug('page', locale);
  const typeSlug = routeType ? getTranslatedSlug(routeType, locale) : null;
  const getPageUrl = (page: number) => {
    if (fromLocation) {
      return page === 1 ? `/${movingRoutesSlug}/${fromLocation}` : `/${movingRoutesSlug}/${fromLocation}/${pageSlug}/${page}`;
    }
    if (typeSlug) {
      return page === 1 ? `/${movingRoutesSlug}/${typeSlug}` : `/${movingRoutesSlug}/${typeSlug}/${pageSlug}/${page}`;
    }
    return page === 1 ? `/${movingRoutesSlug}` : `/${movingRoutesSlug}/${pageSlug}/${page}`;
  };

  // Pagination numbers (same logic as reviews/blog)
  const getPaginationNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const edgeCount = 1;
    const surroundCount = 1;

    const showEllipsisStart = currentPage > edgeCount + surroundCount + 1;
    const showEllipsisEnd = currentPage < totalPages - edgeCount - surroundCount;

    for (let i = 1; i <= Math.min(edgeCount, totalPages); i++) {
      pages.push(i);
    }

    if (showEllipsisStart) {
      pages.push('...');
    }

    for (let i = Math.max(edgeCount + 1, currentPage - surroundCount); i <= Math.min(totalPages - edgeCount, currentPage + surroundCount); i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (showEllipsisEnd) {
      pages.push('...');
    }

    for (let i = Math.max(totalPages - edgeCount + 1, edgeCount + 1); i <= totalPages; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    return pages;
  };

  return (
    <>
      {/* Filter indicator */}
      {fromLocation && (
        <div className="pt-20">
          <div className="container mx-auto">
            <div className="bg-orange-50 rounded-2xl p-4 flex items-center justify-center gap-2 text-orange-700">
              <MapPin className="w-5 h-5" />
              <span>{ui.routes.showingRoutesFrom.split('{location}')[0]}<strong>{titleCase(fromLocation)}</strong>{ui.routes.showingRoutesFrom.split('{location}')[1]}</span>
              <Link
                href={`/${movingRoutesSlug}`}
                className="ml-4 text-sm underline hover:no-underline"
              >
                {ui.routes.viewAll}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Route type tabs */}
      {!fromLocation && (
        <div className="pt-20">
          <div className="container mx-auto">
            <div className="flex justify-center gap-2 md:gap-3">
              <Link
                href={`/${movingRoutesSlug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !routeType
                    ? 'bg-orange-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {ui.routes.allRoutes}
              </Link>
              <Link
                href={`/${movingRoutesSlug}/${getTranslatedSlug('long-distance', locale)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  routeType === 'long-distance'
                    ? 'bg-orange-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {ui.routes.longDistance}
              </Link>
              <Link
                href={`/${movingRoutesSlug}/${getTranslatedSlug('local', locale)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  routeType === 'local'
                    ? 'bg-orange-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {ui.routes.local}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Routes Grid */}
      {paginatedRoutes.length > 0 && (
        <section className="pt-10">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedRoutes.map((route, index) => {
                  const hours = Math.floor(route.drive_time_min / 60);
                  const mins = route.drive_time_min % 60;
                  const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
                  const cost = getRouteCost(route);
                  return (
                    <Link
                      key={index}
                      href={`/${getTranslatedSlug(`${route.slug}-movers`, locale)}`}
                      className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-700 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Navigation className="w-6 h-6 text-orange-700" />
                        <span className="text-sm text-gray-500">
                          {route.distance_mi} mi &bull; {timeDisplay}
                        </span>
                      </div>
                      <H3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-700 transition-colors">
                        {titleCase(route.origin_name)} {ui.routes.to} {titleCase(route.destination_name)}
                      </H3>
                      {cost && (
                        <p className="text-orange-700 font-bold text-lg mb-3">
                          {ui.routes.startingFrom.replace('{cost}', cost.toLocaleString())}
                        </p>
                      )}
                      <div className="text-orange-700 group-hover:text-orange-700 font-medium flex items-center">
                        {ui.routes.viewRoute}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <>
                <div className="flex items-center justify-center gap-1 md:gap-2 mt-12">
                  {currentPage > 1 ? (
                    <Link
                      href={getPageUrl(currentPage - 1)}
                      className="flex items-center px-2 py-2 md:px-4 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-700 hover:text-orange-700 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 md:mr-1" />
                      <span className="hidden md:inline">{ui.pagination.previous}</span>
                    </Link>
                  ) : (
                    <span className="flex items-center px-2 py-2 md:px-4 rounded-lg border border-gray-300 bg-white text-gray-400 cursor-not-allowed opacity-50">
                      <ChevronLeft className="w-4 h-4 md:mr-1" />
                      <span className="hidden md:inline">{ui.pagination.previous}</span>
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    {getPaginationNumbers().map((page, idx) => (
                      typeof page === 'string' ? (
                        <span key={`ellipsis-${idx}`} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-500 text-sm md:text-base">
                          ...
                        </span>
                      ) : (
                        <Link
                          key={page}
                          href={getPageUrl(page)}
                          className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg font-medium text-sm md:text-base transition-colors ${
                            currentPage === page
                              ? 'bg-orange-700 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-700 hover:text-orange-700'
                          }`}
                        >
                          {page}
                        </Link>
                      )
                    ))}
                  </div>

                  {currentPage < totalPages ? (
                    <Link
                      href={getPageUrl(currentPage + 1)}
                      className="flex items-center px-2 py-2 md:px-4 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-700 hover:text-orange-700 transition-colors"
                    >
                      <span className="hidden md:inline">{ui.pagination.next}</span>
                      <ChevronRight className="w-4 h-4 md:ml-1" />
                    </Link>
                  ) : (
                    <span className="flex items-center px-2 py-2 md:px-4 rounded-lg border border-gray-300 bg-white text-gray-400 cursor-not-allowed opacity-50">
                      <span className="hidden md:inline">{ui.pagination.next}</span>
                      <ChevronRight className="w-4 h-4 md:ml-1" />
                    </span>
                  )}
                </div>

                <p className="text-center text-gray-500 mt-4">
                  {ui.pagination.pageIndicator.replace('{current}', String(currentPage)).replace('{total}', String(totalPages)).replace('{count}', String(allFilteredRoutes.length)).replace('{itemType}', ui.routes.itemType)}
                </p>
              </>
            )}
          </div>
        </section>
      )}

      {/* No results message */}
      {allFilteredRoutes.length === 0 && fromLocation && (
        <div className="pt-20">
          <div className="container mx-auto text-center">
            <p className="text-xl text-gray-600 mb-4">
              {ui.routes.noRoutesFound.replace('{location}', titleCase(fromLocation))}
            </p>
            <Link
              href={`/${movingRoutesSlug}`}
              className="inline-flex items-center px-6 py-3 bg-orange-700 text-white font-semibold rounded-lg hover:bg-orange-800 transition-colors"
            >
              {ui.routes.viewAllRoutes}
            </Link>
          </div>
        </div>
      )}

      {/* Page out of range for filtered results */}
      {paginatedRoutes.length === 0 && allFilteredRoutes.length > 0 && (
        <div className="pt-20">
          <div className="container mx-auto text-center">
            <p className="text-xl text-gray-600 mb-4">
              {ui.routes.noRoutesOnPage}
            </p>
            <Link
              href={getPageUrl(1)}
              className="inline-flex items-center px-6 py-3 bg-orange-700 text-white font-semibold rounded-lg hover:bg-orange-800 transition-colors"
            >
              {ui.routes.viewPage1}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
