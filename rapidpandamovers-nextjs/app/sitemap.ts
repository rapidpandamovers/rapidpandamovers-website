import { allCities, allLongDistanceRoutes, allLocalRoutes, getServiceSlugs, getAllLocationServiceSlugs } from '@/lib/data';
import blogPosts from '@/data/blog.json';
import comparisons from '@/data/comparisons.json';
import alternatives from '@/data/alternatives.json';

export default async function sitemap() {
  const base = 'https://www.rapidpandamovers.com';
  const now = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: base, priority: 1.0 },
    { url: `${base}/about-us`, priority: 0.8 },
    { url: `${base}/services`, priority: 0.9 },
    { url: `${base}/locations`, priority: 0.8 },
    { url: `${base}/contact-us`, priority: 0.8 },
    { url: `${base}/quote`, priority: 0.9 },
    { url: `${base}/blog`, priority: 0.7 },
    { url: `${base}/faq`, priority: 0.6 },
    { url: `${base}/moving-rates`, priority: 0.7 },
    { url: `${base}/reviews`, priority: 0.6 },
    { url: `${base}/reservations`, priority: 0.7 },
    { url: `${base}/moving-checklist`, priority: 0.6 },
    { url: `${base}/moving-tips`, priority: 0.6 },
    { url: `${base}/moving-glossary`, priority: 0.5 },
    { url: `${base}/routes`, priority: 0.7 },
    { url: `${base}/compare`, priority: 0.7 },
    { url: `${base}/alternatives`, priority: 0.7 },
    { url: `${base}/why-choose-us`, priority: 0.7 },
    { url: `${base}/sitemap`, priority: 0.3 },
    { url: `${base}/privacy`, priority: 0.3 },
    { url: `${base}/terms`, priority: 0.3 },
  ].map(page => ({ ...page, lastModified: now }));

  // Blog posts
  const blogUrls = blogPosts.map((post: { slug: string }) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: now,
    priority: 0.6
  }));

  // Services
  const serviceUrls = getServiceSlugs().map(s => ({
    url: `${base}/${s}`,
    lastModified: now,
    priority: 0.9
  }));

  // Cities (active only)
  const allCitiesFlat = allCities.states.flatMap(state =>
    state.counties.flatMap(county =>
      county.cities.filter(c => c.is_active)
    )
  );

  const cityUrls = allCitiesFlat.map(c => ({
    url: `${base}/${c.slug}-movers`,
    lastModified: now,
    priority: 0.8
  }));

  // Neighborhoods (active only)
  const allNeighborhoods = allCitiesFlat.flatMap(city =>
    (city.neighborhoods || []).filter((n: any) => n.is_active !== false)
  );

  const neighborhoodUrls = allNeighborhoods.map((n: any) => ({
    url: `${base}/${n.slug}-movers`,
    lastModified: now,
    priority: 0.7
  }));

  // Long distance routes (active only, with -movers suffix)
  const longDistanceRouteUrls = allLongDistanceRoutes
    .filter(r => r.is_active !== false)
    .map(r => ({
      url: `${base}/${r.slug}-movers`,
      lastModified: now,
      priority: 0.7
    }));

  // Local routes (active only, with -movers suffix)
  const localRouteUrls = allLocalRoutes
    .filter((r: any) => r.is_active !== false)
    .map((r: any) => ({
      url: `${base}/${r.slug}-movers`,
      lastModified: now,
      priority: 0.6
    }));

  // Location-service pages (e.g., /miami-local-moving)
  const locationServiceUrls = getAllLocationServiceSlugs().map((slug: string) => ({
    url: `${base}/${slug}`,
    lastModified: now,
    priority: 0.7
  }));

  // Comparison pages
  const comparisonUrls = comparisons.comparisons.map((c: { slug: string }) => ({
    url: `${base}/compare/${c.slug}`,
    lastModified: now,
    priority: 0.6
  }));

  // Alternative pages
  const alternativeUrls = alternatives.alternatives.map((a: { slug: string }) => ({
    url: `${base}/alternatives/${a.slug}`,
    lastModified: now,
    priority: 0.6
  }));

  return [...staticPages, ...blogUrls, ...serviceUrls, ...cityUrls, ...neighborhoodUrls, ...longDistanceRouteUrls, ...localRouteUrls, ...locationServiceUrls, ...comparisonUrls, ...alternativeUrls];
}
