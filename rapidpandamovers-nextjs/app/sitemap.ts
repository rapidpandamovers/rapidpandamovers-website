import { MetadataRoute } from 'next'
import { allCities, allLongDistanceRoutes, allLocalRoutes, getServiceSlugs, getAllLocationServiceSlugs } from '@/lib/data'
import { getAllPosts, getCategories, categoryToSlug } from '@/lib/blog'
import comparisons from '@/data/comparisons.json'
import alternatives from '@/data/alternatives.json'

const POSTS_PER_PAGE = 12

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.rapidpandamovers.com'
  const now = new Date().toISOString()

  // Static pages with appropriate change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/about-us`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/locations`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact-us`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/quote`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/moving-rates`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/reviews`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/reservations`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/moving-checklist`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/moving-tips`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/moving-glossary`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/routes`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/compare`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/alternatives`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/why-choose-us`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Blog posts from markdown files (the authoritative source)
  const allBlogPosts = getAllPosts()
  const blogUrls: MetadataRoute.Sitemap = allBlogPosts.map(post => {
    // Convert date string to ISO format for consistency
    const dateStr = post.updated || post.date
    const lastMod = new Date(dateStr).toISOString()
    return {
      url: `${base}/blog/${post.slug}`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.6,
    }
  })

  // Blog pagination pages
  const totalBlogPages = Math.ceil(allBlogPosts.length / POSTS_PER_PAGE)
  const blogPaginationUrls: MetadataRoute.Sitemap = []
  for (let page = 2; page <= totalBlogPages; page++) {
    blogPaginationUrls.push({
      url: `${base}/blog/page/${page}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    })
  }

  // Blog category pages
  const categories = getCategories()
  const categoryUrls: MetadataRoute.Sitemap = categories.map(category => ({
    url: `${base}/blog/category/${categoryToSlug(category)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Blog category pagination pages
  const categoryPaginationUrls: MetadataRoute.Sitemap = []
  for (const category of categories) {
    const categoryPosts = allBlogPosts.filter(p => p.category === category)
    const totalPages = Math.ceil(categoryPosts.length / POSTS_PER_PAGE)
    for (let page = 2; page <= totalPages; page++) {
      categoryPaginationUrls.push({
        url: `${base}/blog/category/${categoryToSlug(category)}/page/${page}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.5,
      })
    }
  }

  // Reviews pagination pages (estimate based on review count)
  const reviewsPaginationUrls: MetadataRoute.Sitemap = []
  // Assuming we have about 100 reviews, so 5 pages
  for (let page = 2; page <= 5; page++) {
    reviewsPaginationUrls.push({
      url: `${base}/reviews/page/${page}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    })
  }

  // Services
  const serviceUrls: MetadataRoute.Sitemap = getServiceSlugs().map(s => ({
    url: `${base}/${s}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  // Cities (active only)
  const allCitiesFlat = allCities.states.flatMap(state =>
    state.counties.flatMap(county =>
      county.cities.filter(c => c.is_active)
    )
  )

  const cityUrls: MetadataRoute.Sitemap = allCitiesFlat.map(c => ({
    url: `${base}/${c.slug}-movers`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Neighborhoods (active only)
  const allNeighborhoods = allCitiesFlat.flatMap(city =>
    (city.neighborhoods || []).filter((n: { is_active?: boolean }) => n.is_active !== false)
  )

  const neighborhoodUrls: MetadataRoute.Sitemap = allNeighborhoods.map((n: { slug: string }) => ({
    url: `${base}/${n.slug}-movers`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Long distance routes (active only, with -movers suffix)
  const longDistanceRouteUrls: MetadataRoute.Sitemap = allLongDistanceRoutes
    .filter(r => r.is_active !== false)
    .map(r => ({
      url: `${base}/${r.slug}-movers`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

  // Local routes (active only, with -movers suffix)
  const localRouteUrls: MetadataRoute.Sitemap = allLocalRoutes
    .filter((r: { is_active?: boolean }) => r.is_active !== false)
    .map((r: { slug: string }) => ({
      url: `${base}/${r.slug}-movers`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

  // Location-service pages (e.g., /miami-local-moving)
  const locationServiceUrls: MetadataRoute.Sitemap = getAllLocationServiceSlugs().map((slug: string) => ({
    url: `${base}/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Comparison pages
  const comparisonUrls: MetadataRoute.Sitemap = comparisons.comparisons.map((c: { slug: string }) => ({
    url: `${base}/compare/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // Alternative pages
  const alternativeUrls: MetadataRoute.Sitemap = alternatives.alternatives.map((a: { slug: string }) => ({
    url: `${base}/alternatives/${a.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...blogUrls,
    ...blogPaginationUrls,
    ...categoryUrls,
    ...categoryPaginationUrls,
    ...reviewsPaginationUrls,
    ...serviceUrls,
    ...cityUrls,
    ...neighborhoodUrls,
    ...longDistanceRouteUrls,
    ...localRouteUrls,
    ...locationServiceUrls,
    ...comparisonUrls,
    ...alternativeUrls,
  ]
}
