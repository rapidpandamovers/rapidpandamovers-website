import cities from '@/data/locations.json';
import esLocations from '@/data/es/locations.json';
import services from '@/data/services.json';
import esServices from '@/data/es/services.json';
import comparisons from '@/data/comparisons.json';
import esComparisons from '@/data/es/comparisons.json';
import alternatives from '@/data/alternatives.json';
import esAlternatives from '@/data/es/alternatives.json';
import pageContent from '@/data/content.json';

export const allCities = cities;
export const allServices = services;
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
  const cities: Array<{ name: string; slug: string; population?: number }> = [];
  for (const state of allCities.states) {
    if (!state.is_active) continue;
    for (const county of state.counties) {
      if (!county.is_active) continue;
      for (const city of county.cities) {
        if (city.is_active) {
          cities.push({
            name: city.name,
            slug: city.slug,
            population: (city as Record<string, unknown>).population as number | undefined,
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

const localizedServicesMap: Record<string, typeof services> = {
  es: esServices as typeof services,
};

export const getLocalizedServices = (locale: string) => {
  const src = localizedServicesMap[locale] || allServices;
  return src
    .filter((service: any) => service.is_active !== false)
    .map((service: any) => ({
      name: service.name as string,
      slug: service.slug as string,
    }));
};

export const getLocalizedServiceBySlug = (slug: string, locale: string) => {
  const src = localizedServicesMap[locale] || allServices;
  return (src as any[]).find((service: any) => service.slug === slug) ?? null;
};

export const getLocalizedAllActiveServices = (locale: string) => {
  const src = localizedServicesMap[locale] || allServices;
  return (src as any[])
    .filter((service: any) => service.is_active !== false)
    .map((service: any) => ({
      name: service.name as string,
      slug: service.slug as string,
      description: service.description as string,
    }));
};

const localizedComparisonsMap: Record<string, typeof comparisons> = {
  es: esComparisons as typeof comparisons,
};

const localizedAlternativesMap: Record<string, typeof alternatives> = {
  es: esAlternatives as typeof alternatives,
};

const localizedLocationsMap: Record<string, typeof cities> = {
  es: esLocations as typeof cities,
};

export const getLocalizedComparisons = (locale: string) => {
  return (localizedComparisonsMap[locale] || comparisons).comparisons;
};

export const getLocalizedAlternatives = (locale: string) => {
  return (localizedAlternativesMap[locale] || alternatives).alternatives;
};

export const getLocalizedCityBySlug = (slug: string, locale: string) => {
  const cleanSlug = slug.endsWith('-movers') ? slug.replace(/-movers$/, '') : slug;
  const src = localizedLocationsMap[locale] || allCities;
  for (const state of src.states) {
    for (const county of state.counties) {
      const city = county.cities.find((c: any) => c.slug === cleanSlug);
      if (city) return city;
    }
  }
  return null;
};

export const getLocalizedNeighborhoodBySlug = (slug: string, locale: string) => {
  const cleanSlug = slug.endsWith('-movers') ? slug.replace(/-movers$/, '') : slug;
  const src = localizedLocationsMap[locale] || allCities;
  for (const state of src.states) {
    for (const county of state.counties) {
      for (const city of county.cities) {
        if (city.neighborhoods) {
          const neighborhood = city.neighborhoods.find((n: any) => n.slug === cleanSlug);
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

export const titleCase = (s: string) => {
  const parts = s.split('-');
  const lastPart = parts[parts.length - 1];

  // Check if last part is a 2-letter state code
  if (lastPart.length === 2 && /^[a-z]{2}$/i.test(lastPart)) {
    // Format as "City Name, ST"
    const cityParts = parts.slice(0, -1);
    const cityName = cityParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    return `${cityName}, ${lastPart.toUpperCase()}`;
  }

  // Regular title case
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

// Get the city name for a location slug (returns parent city name for neighborhoods)
export const getCityNameBySlug = (slug: string): string | null => {
  // Check if it's a city
  const city = getCityBySlug(slug);
  if (city) return city.name;

  // Check if it's a neighborhood
  const neighborhood = getNeighborhoodBySlug(slug);
  if (neighborhood?.parentCity) return neighborhood.parentCity.name;

  return null;
};

// Parse location-service slugs like "miami-local-moving" -> { location, service }
export const getLocationServiceBySlug = (slug: string) => {
  // Get all city and neighborhood slugs
  const allLocations: Array<{ slug: string; name: string; type: 'city' | 'neighborhood'; data: any }> = [];

  for (const state of allCities.states) {
    for (const county of state.counties) {
      for (const city of county.cities) {
        if (city.is_active !== false) {
          allLocations.push({ slug: city.slug, name: city.name, type: 'city', data: city });
        }
        if (city.neighborhoods) {
          for (const neighborhood of city.neighborhoods) {
            if (neighborhood.is_active !== false) {
              allLocations.push({
                slug: neighborhood.slug,
                name: neighborhood.name,
                type: 'neighborhood',
                data: { ...neighborhood, parentCity: city, county, state }
              });
            }
          }
        }
      }
    }
  }

  // Sort by slug length descending to match longest first (e.g., "coral-gables" before "coral")
  allLocations.sort((a, b) => b.slug.length - a.slug.length);

  // Try to match location-service pattern
  for (const location of allLocations) {
    if (slug.startsWith(location.slug + '-')) {
      const serviceSlug = slug.slice(location.slug.length + 1);
      const service = allServices.find(s => s.slug === serviceSlug);
      if (service) {
        return {
          location: location.data,
          locationType: location.type,
          service
        };
      }
    }
  }

  return null;
};

// Get all location-service slug combinations for static generation
export const getAllLocationServiceSlugs = () => {
  const slugs: string[] = [];
  const activeServices = allServices.filter(s => s.is_active !== false);

  for (const state of allCities.states) {
    for (const county of state.counties) {
      for (const city of county.cities) {
        if (city.is_active !== false) {
          for (const service of activeServices) {
            slugs.push(`${city.slug}-${service.slug}`);
          }
        }
        // Also generate for neighborhoods
        if (city.neighborhoods) {
          for (const neighborhood of city.neighborhoods) {
            if (neighborhood.is_active !== false) {
              for (const service of activeServices) {
                slugs.push(`${neighborhood.slug}-${service.slug}`);
              }
            }
          }
        }
      }
    }
  }

  return slugs;
};
