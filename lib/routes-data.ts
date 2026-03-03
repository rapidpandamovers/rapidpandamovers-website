import longDistanceRoutes from '@/data/long_distance_routes.json';
import localRoutes from '@/data/local_routes.json';

export const allLongDistanceRoutes = longDistanceRoutes as typeof longDistanceRoutes;
export const allLocalRoutes = localRoutes as Array<typeof longDistanceRoutes[number]>;
export const allRoutes = [...longDistanceRoutes, ...(localRoutes as Array<typeof longDistanceRoutes[number]>)];

export const getRouteBySlug = (slug: string) => {
  const cleanSlug = slug.endsWith('-movers') ? slug.replace(/-movers$/, '') : slug;
  return allRoutes.find(r => r.slug === cleanSlug);
};
