import { allCities, allRoutes, getServiceSlugs } from '@/lib/data';

export default async function sitemap() {
  const base = 'https://www.rapidpandamovers.com';
  const now = new Date().toISOString();

  const allCitiesFlat = allCities.states.flatMap(state => 
    state.counties.flatMap(county => county.cities)
  );
  
  const cityUrls = allCitiesFlat.map(c => ({
    url: `${base}/${c.slug}-movers`,
    lastModified: now,
    priority: 0.8
  }));

  const routeUrls = allRoutes.map(r => ({
    url: `${base}/${r.slug}`,
    lastModified: now,
    priority: 0.7
  }));

  const serviceUrls = getServiceSlugs().map(s => ({
    url: `${base}/${s}`,
    lastModified: now,
    priority: 0.9
  }));

  return [...cityUrls, ...routeUrls, ...serviceUrls];
}
