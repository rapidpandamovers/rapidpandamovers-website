import cities from '@/data/locations.json';
import services from '@/data/services.json';
import longDistanceRoutes from '@/data/long_distance_routes.json';
import localRoutes from '@/data/local_routes.json';
import pageContent from '@/data/content.json';

export const allCities = cities;
export const allServices = services;
export const allLongDistanceRoutes = longDistanceRoutes as typeof longDistanceRoutes;
export const allLocalRoutes = localRoutes as Array<typeof longDistanceRoutes[number]>;
// Combined routes for backwards compatibility
export const allRoutes = [...longDistanceRoutes, ...(localRoutes as Array<typeof longDistanceRoutes[number]>)];
export const allContent = pageContent;

export const getServiceBySlug = (slug: string) => {
  return allServices.find(service => service.slug === slug);
};

export const getServiceSlugs = () => {
  return allServices.map(service => service.slug);
};

export const getPageContent = (slug: string) => {
  // Check if slug matches a service
  const service = getServiceBySlug(slug);
  if (service) return service;
  
  // Return null if no match found
  return null;
};

export const getAllActiveCities = () => {
  const cities: Array<{ name: string; slug: string }> = [];
  for (const state of allCities.states) {
    if (!state.is_active) continue;
    for (const county of state.counties) {
      if (!county.is_active) continue;
      for (const city of county.cities) {
        if (city.is_active) {
          cities.push({
            name: city.name,
            slug: city.slug
          });
        }
      }
    }
  }
  return cities;
};

export const getAllActiveServices = () => {
  return allServices
    .filter(service => service.is_active)
    .map(service => ({
      name: service.name,
      slug: service.slug,
      description: service.description
    }));
};

export const getCityBySlug = (slug: string) => {
  // Handle slugs with or without -movers suffix
  const cleanSlug = slug.endsWith('-movers') ? slug.replace(/-movers$/, '') : slug;
  for (const state of allCities.states) {
    for (const county of state.counties) {
      const city = county.cities.find(c => c.slug === cleanSlug);
      if (city) return city;
    }
  }
  return null;
};

export const getRouteBySlug = (slug: string) => {
  // Handle slugs with or without -movers suffix
  const cleanSlug = slug.endsWith('-movers') ? slug.replace(/-movers$/, '') : slug;
  return allRoutes.find(r => r.slug === cleanSlug);
};

export const getNeighborhoodBySlug = (slug: string) => {
  // Handle slugs with or without -movers suffix
  const cleanSlug = slug.endsWith('-movers') ? slug.replace(/-movers$/, '') : slug;
  for (const state of allCities.states) {
    for (const county of state.counties) {
      for (const city of county.cities) {
        if (city.neighborhoods) {
          const neighborhood = city.neighborhoods.find(n => n.slug === cleanSlug);
          if (neighborhood) {
            return {
              ...neighborhood,
              parentCity: city,
              county: county,
              state: state
            };
          }
        }
      }
    }
  }
  return null;
};

export const titleCase = (s: string) =>
  s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
