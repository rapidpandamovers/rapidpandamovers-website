import { allCities, allRoutes, allServices, titleCase } from '@/lib/data';

export function buildLinkBlocks(slug: string) {
  const blocks: { title: string; items: { href: string; label: string }[] }[] = [];

  // City page → show routes & services
  // Handle slugs with or without -movers suffix
  const cleanSlug = slug.endsWith('-movers') ? slug.replace(/-movers$/, '') : slug;
  let city = null;
  for (const state of allCities.states) {
    for (const county of state.counties) {
      const foundCity = county.cities.find(c => c.slug === cleanSlug);
      if (foundCity) {
        city = foundCity;
        break;
      }
    }
    if (city) break;
  }
  
  if (city) {
    const cityName = city.name;
    const routes = allRoutes.filter(r => r.origin_name === city.name.toLowerCase());
    blocks.push({
      title: `Popular routes from ${cityName}`,
      items: routes.map(r => ({
        href: `/${r.slug}`,
        label: `${titleCase(r.origin_name)} to ${titleCase(r.destination_name)} Movers`
      }))
    });
    blocks.push({
      title: `Moving services in ${cityName}`,
      items: allServices.map(s => ({
        href: `/${s.slug}-${city.slug}-movers`,
        label: `${s.name} in ${cityName}`
      }))
    });
  }

  // Route page → link back to city pages
  const route = allRoutes.find(r => r.slug === slug);
  if (route) {
    blocks.push({
      title: `Origin & destination`,
      items: [
        { href: `/${route.origin_name}-movers`, label: `${titleCase(route.origin_name)} Movers` },
        { href: `/${route.destination_name}-movers`, label: `${titleCase(route.destination_name)} Movers` }
      ]
    });
  }

  return blocks;
}
