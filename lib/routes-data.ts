import longDistanceRoutes from '@/data/long_distance_routes.json';
import localRoutes from '@/data/local_routes.json';

export const allLongDistanceRoutes = longDistanceRoutes as typeof longDistanceRoutes;
export const allLocalRoutes = localRoutes as Array<typeof longDistanceRoutes[number]>;
export const allRoutes = [...longDistanceRoutes, ...(localRoutes as Array<typeof longDistanceRoutes[number]>)];

export const getRouteBySlug = (slug: string) => {
  const cleanSlug = slug.endsWith('-movers') ? slug.replace(/-movers$/, '') : slug;
  return allRoutes.find(r => r.slug === cleanSlug);
};

const ROUTES_PER_PAGE = 24;

/** Get all unique location slugs (origin + destination names) from active routes. */
export function getAllRouteLocations(): string[] {
  const active = allRoutes.filter(r => r.is_active !== false);
  const locations = new Set<string>();
  for (const r of active) {
    locations.add(r.origin_name.toLowerCase());
    locations.add(r.destination_name.toLowerCase());
  }
  return Array.from(locations);
}

/** Get the number of matching routes for a location slug. */
export function getRouteCountForLocation(location: string): number {
  const slug = location.toLowerCase();
  return allRoutes.filter(r =>
    r.is_active !== false && (
      r.origin_name.toLowerCase() === slug ||
      r.destination_name.toLowerCase() === slug ||
      r.origin_name.toLowerCase().includes(slug) ||
      r.destination_name.toLowerCase().includes(slug)
    )
  ).length;
}

/** Get total pages for a location. */
export function getTotalPagesForLocation(location: string): number {
  return Math.ceil(getRouteCountForLocation(location) / ROUTES_PER_PAGE);
}
