import { MetadataRoute } from 'next'
import { allCities, allLongDistanceRoutes, allLocalRoutes, getServiceSlugs, getAllLocationServiceSlugs, getAllActiveCities } from '@/lib/data'
import { getPublishedPosts, getCategories, categoryToSlug, isEditorialCategory, getServiceSlugsFromBlog, getPostsByService, getLocationSlugs, getPostsByLocation } from '@/lib/blog'
import comparisons from '@/data/comparisons.json'
import alternatives from '@/data/alternatives.json'
import reviewsData from '@/data/reviews.json'

const POSTS_PER_PAGE = 12
const REVIEWS_PER_PAGE = 9
const ROUTES_PER_PAGE = 24

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
    { url: `${base}/moving-routes`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/compare`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/alternatives`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/why-choose-us`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Blog posts from markdown files (the authoritative source)
  const allBlogPosts = getPublishedPosts()
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

  // Blog category pages (editorial only)
  const categories = getCategories().filter(isEditorialCategory)
  const categoryUrls: MetadataRoute.Sitemap = categories.map(category => ({
    url: `${base}/blog/category/${categoryToSlug(category)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Blog category pagination pages (editorial only)
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

  // Blog service pages
  const serviceSlugs = getServiceSlugsFromBlog()
  const serviceBlogUrls: MetadataRoute.Sitemap = serviceSlugs.map(slug => ({
    url: `${base}/blog/service/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Blog service pagination pages
  const serviceBlogPaginationUrls: MetadataRoute.Sitemap = []
  for (const slug of serviceSlugs) {
    const posts = getPostsByService(slug)
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    for (let page = 2; page <= totalPages; page++) {
      serviceBlogPaginationUrls.push({
        url: `${base}/blog/service/${slug}/page/${page}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.5,
      })
    }
  }

  // Blog location pages
  const locationSlugs = getLocationSlugs()
  const locationBlogUrls: MetadataRoute.Sitemap = locationSlugs.map(slug => ({
    url: `${base}/blog/location/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Blog location pagination pages
  const locationBlogPaginationUrls: MetadataRoute.Sitemap = []
  for (const slug of locationSlugs) {
    const posts = getPostsByLocation(slug)
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    for (let page = 2; page <= totalPages; page++) {
      locationBlogPaginationUrls.push({
        url: `${base}/blog/location/${slug}/page/${page}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.5,
      })
    }
  }

  // Reviews pagination pages
  const totalReviewPages = Math.ceil(reviewsData.reviews.length / REVIEWS_PER_PAGE)
  const reviewsPaginationUrls: MetadataRoute.Sitemap = []
  for (let page = 2; page <= totalReviewPages; page++) {
    reviewsPaginationUrls.push({
      url: `${base}/reviews/page/${page}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    })
  }

  // Reviews platform pages (e.g., /reviews/google)
  const reviewPlatforms = Array.from(new Set(reviewsData.reviews.map(r => r.platform)))
  const reviewsPlatformUrls: MetadataRoute.Sitemap = reviewPlatforms.map(platform => ({
    url: `${base}/reviews/${platform}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Reviews platform pagination pages (e.g., /reviews/google/page/2)
  const reviewsPlatformPaginationUrls: MetadataRoute.Sitemap = []
  for (const platform of reviewPlatforms) {
    const platformReviews = reviewsData.reviews.filter(r => r.platform === platform)
    const totalPages = Math.ceil(platformReviews.length / REVIEWS_PER_PAGE)
    for (let page = 2; page <= totalPages; page++) {
      reviewsPlatformPaginationUrls.push({
        url: `${base}/reviews/${platform}/page/${page}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.5,
      })
    }
  }

  // Services
  const serviceUrls: MetadataRoute.Sitemap = getServiceSlugs().map(s => ({
    url: `${base}/${s}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  // Services by location (e.g., /services/miami, /services/wynwood)
  const activeCities = getAllActiveCities()
  const allActiveNeighborhoodSlugs = allCities.states.flatMap(state =>
    state.counties.flatMap(county =>
      county.cities.filter(c => c.is_active).flatMap(city =>
        (city.neighborhoods || [])
          .filter((n: { is_active?: boolean }) => n.is_active !== false)
          .map((n: { slug: string }) => n.slug)
      )
    )
  )
  const servicesLocationUrls: MetadataRoute.Sitemap = [
    ...activeCities.map(city => ({
      url: `${base}/services/${city.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...allActiveNeighborhoodSlugs.map(slug => ({
      url: `${base}/services/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]

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

  // Moving routes pagination pages (e.g., /moving-routes/page/2)
  const totalActiveRoutes =
    allLongDistanceRoutes.filter(r => r.is_active !== false).length +
    allLocalRoutes.filter((r: { is_active?: boolean }) => r.is_active !== false).length
  const totalRoutePages = Math.ceil(totalActiveRoutes / ROUTES_PER_PAGE)
  const routesPaginationUrls: MetadataRoute.Sitemap = []
  for (let page = 2; page <= totalRoutePages; page++) {
    routesPaginationUrls.push({
      url: `${base}/moving-routes/page/${page}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    })
  }

  // Moving routes by location (e.g., /moving-routes/miami, /moving-routes/wynwood)
  const routesLocationUrls: MetadataRoute.Sitemap = [
    ...activeCities.map(city => ({
      url: `${base}/moving-routes/${city.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...allActiveNeighborhoodSlugs.map(slug => ({
      url: `${base}/moving-routes/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ]

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
    ...serviceBlogUrls,
    ...serviceBlogPaginationUrls,
    ...locationBlogUrls,
    ...locationBlogPaginationUrls,
    ...reviewsPaginationUrls,
    ...reviewsPlatformUrls,
    ...reviewsPlatformPaginationUrls,
    ...serviceUrls,
    ...servicesLocationUrls,
    ...cityUrls,
    ...neighborhoodUrls,
    ...longDistanceRouteUrls,
    ...localRouteUrls,
    ...routesPaginationUrls,
    ...routesLocationUrls,
    ...locationServiceUrls,
    ...comparisonUrls,
    ...alternativeUrls,
  ]
}
