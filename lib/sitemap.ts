import { allCities, getServiceSlugs, getAllLocationServiceSlugs, getAllActiveCities } from '@/lib/data'
import { getPublishedPosts, getCategories, categoryToSlug, isEditorialCategory, getServiceSlugsFromBlog, getPostsByService, getLocationSlugs, getPostsByLocation } from '@/lib/blog'
import comparisons from '@/data/comparisons.json'
import alternatives from '@/data/alternatives.json'
import reviewsData from '@/data/reviews.json'
import { defaultLocale, type Locale } from '@/i18n/config'
import { translatePathname } from '@/i18n/slug-map'

const POSTS_PER_PAGE = 12
const REVIEWS_PER_PAGE = 9
const ROUTES_PER_PAGE = 24

const base = 'https://www.rapidpandamovers.com'

export const SITEMAP_IDS = [
  'en', 'es',
  'blog-en', 'blog-es',
  'services-en', 'services-es',
  'locations-en', 'locations-es',
  'routes-en', 'routes-es',
]

// ---------------------------------------------------------------------------
// Shared types and helpers
// ---------------------------------------------------------------------------

interface SitemapEntry {
  url: string
  lastModified: string | Date
  changeFrequency: string
  priority: number
  alternates: { languages: Record<string, string> }
}

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

/**
 * Generate a single sitemap entry for one locale with hreflang alternates.
 * `enPath` is always the English/canonical path (e.g., '/about-us').
 * `esPathOverride` bypasses translatePathname for data slugs that shouldn't
 * be translated (blog post slugs, comparison slugs, etc.).
 */
async function forLocale(
  locale: Locale,
  enPath: string,
  opts: { lastModified: string | Date; changeFrequency: ChangeFreq; priority: number },
  esPathOverride?: string
): Promise<SitemapEntry> {
  const enUrl = `${base}${enPath}`
  const esPath = esPathOverride ?? await translatePathname(enPath, 'en', 'es')
  const esUrl = `${base}/es${esPath}`

  return {
    url: locale === defaultLocale ? enUrl : esUrl,
    lastModified: opts.lastModified,
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: {
      languages: {
        en: enUrl,
        es: esUrl,
        'x-default': enUrl,
      },
    },
  }
}

// ---------------------------------------------------------------------------
// Area generators
// ---------------------------------------------------------------------------

async function getGeneralEntries(locale: Locale, now: string): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = []

  // Static pages
  const staticPaths: Array<[string, ChangeFreq, number]> = [
    ['', 'weekly', 1.0],
    ['/about-us', 'monthly', 0.8],
    ['/services', 'monthly', 0.9],
    ['/locations', 'monthly', 0.8],
    ['/contact-us', 'monthly', 0.8],
    ['/quote', 'monthly', 0.9],
    ['/blog', 'daily', 0.8],
    ['/faq', 'monthly', 0.6],
    ['/moving-rates', 'monthly', 0.7],
    ['/reviews', 'weekly', 0.7],
    ['/reservations', 'monthly', 0.7],
    ['/moving-checklist', 'monthly', 0.6],
    ['/moving-tips', 'monthly', 0.6],
    ['/moving-glossary', 'monthly', 0.5],
    ['/moving-routes', 'monthly', 0.7],
    ['/compare', 'monthly', 0.7],
    ['/alternatives', 'monthly', 0.7],
    ['/why-choose-us', 'monthly', 0.7],
    ['/claims', 'monthly', 0.5],
    ['/privacy', 'yearly', 0.3],
    ['/terms', 'yearly', 0.3],
  ]
  for (const [path, freq, priority] of staticPaths) {
    entries.push(await forLocale(locale, path, { lastModified: now, changeFrequency: freq, priority }))
  }

  // Reviews pagination
  const totalReviewPages = Math.ceil(reviewsData.reviews.length / REVIEWS_PER_PAGE)
  for (let page = 2; page <= totalReviewPages; page++) {
    entries.push(await forLocale(locale, `/reviews/page/${page}`, { lastModified: now, changeFrequency: 'weekly', priority: 0.5 }))
  }

  // Reviews platform pages + pagination
  const reviewPlatforms = Array.from(new Set(reviewsData.reviews.map(r => r.platform)))
  for (const platform of reviewPlatforms) {
    entries.push(await forLocale(locale, `/reviews/${platform}`, { lastModified: now, changeFrequency: 'weekly', priority: 0.6 }))
    const platformReviews = reviewsData.reviews.filter(r => r.platform === platform)
    const totalPages = Math.ceil(platformReviews.length / REVIEWS_PER_PAGE)
    for (let page = 2; page <= totalPages; page++) {
      entries.push(await forLocale(locale, `/reviews/${platform}/page/${page}`, { lastModified: now, changeFrequency: 'weekly', priority: 0.5 }))
    }
  }

  // Comparison pages (data slugs — only translate the structural prefix)
  for (const c of comparisons.comparisons) {
    const slug = (c as { slug: string }).slug
    entries.push(await forLocale(locale, `/compare/${slug}`, { lastModified: now, changeFrequency: 'monthly', priority: 0.6 }, `/comparar/${slug}`))
  }

  // Alternative pages (data slugs — only translate the structural prefix)
  for (const a of alternatives.alternatives) {
    const slug = (a as { slug: string }).slug
    entries.push(await forLocale(locale, `/alternatives/${slug}`, { lastModified: now, changeFrequency: 'monthly', priority: 0.6 }, `/alternativas/${slug}`))
  }

  return entries
}

async function getBlogEntries(locale: Locale, now: string): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = []
  const localePosts = getPublishedPosts(locale)

  // Individual blog posts (blog slugs are locale-specific — need explicit overrides)
  const enPosts = getPublishedPosts('en')
  const blogSlugMap = (await import('@/data/blog-slug-map.json')).default as Record<string, string>
  for (const enPost of enPosts) {
    const dateStr = enPost.updated || enPost.date
    const lastMod = new Date(dateStr).toISOString()
    const enPath = `/blog/${enPost.slug}`
    const esSlug = blogSlugMap[enPost.slug] || enPost.slug
    entries.push(await forLocale(locale, enPath, { lastModified: lastMod, changeFrequency: 'monthly', priority: 0.6 }, `/blog/${esSlug}`))
  }

  // Blog pagination
  const totalBlogPages = Math.ceil(localePosts.length / POSTS_PER_PAGE)
  for (let page = 2; page <= totalBlogPages; page++) {
    entries.push(await forLocale(locale, `/blog/page/${page}`, { lastModified: now, changeFrequency: 'weekly', priority: 0.5 }))
  }

  // Blog category pages (editorial only) + pagination
  // Always use EN slugs as canonical — translatePathname handles ES conversion
  const enCategories = getCategories('en').filter(isEditorialCategory)
  for (const enCategory of enCategories) {
    const enSlug = categoryToSlug(enCategory)
    entries.push(await forLocale(locale, `/blog/category/${enSlug}`, { lastModified: now, changeFrequency: 'weekly', priority: 0.6 }))
    const enCategoryPosts = enPosts.filter(p => p.category === enCategory)
    const totalPages = Math.ceil(enCategoryPosts.length / POSTS_PER_PAGE)
    for (let page = 2; page <= totalPages; page++) {
      entries.push(await forLocale(locale, `/blog/category/${enSlug}/page/${page}`, { lastModified: now, changeFrequency: 'weekly', priority: 0.5 }))
    }
  }

  // Blog service pages + pagination (EN service slugs as canonical)
  const enServiceSlugs = getServiceSlugsFromBlog('en')
  for (const enSlug of enServiceSlugs) {
    entries.push(await forLocale(locale, `/blog/service/${enSlug}`, { lastModified: now, changeFrequency: 'weekly', priority: 0.6 }))
    const posts = getPostsByService(enSlug, 'en')
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    for (let page = 2; page <= totalPages; page++) {
      entries.push(await forLocale(locale, `/blog/service/${enSlug}/page/${page}`, { lastModified: now, changeFrequency: 'weekly', priority: 0.5 }))
    }
  }

  // Blog location pages + pagination (location slugs are the same in both locales)
  const blogLocationSlugs = getLocationSlugs('en')
  for (const slug of blogLocationSlugs) {
    entries.push(await forLocale(locale, `/blog/location/${slug}`, { lastModified: now, changeFrequency: 'weekly', priority: 0.6 }))
    const posts = getPostsByLocation(slug, 'en')
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    for (let page = 2; page <= totalPages; page++) {
      entries.push(await forLocale(locale, `/blog/location/${slug}/page/${page}`, { lastModified: now, changeFrequency: 'weekly', priority: 0.5 }))
    }
  }

  return entries
}

async function getServicesEntries(locale: Locale, now: string): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = []

  // Individual service pages
  for (const slug of getServiceSlugs()) {
    entries.push(await forLocale(locale, `/${slug}`, { lastModified: now, changeFrequency: 'monthly', priority: 0.9 }))
  }

  // Services by location (cities + neighborhoods)
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

  for (const city of activeCities) {
    entries.push(await forLocale(locale, `/services/${city.slug}`, { lastModified: now, changeFrequency: 'monthly', priority: 0.7 }))
  }
  for (const slug of allActiveNeighborhoodSlugs) {
    entries.push(await forLocale(locale, `/services/${slug}`, { lastModified: now, changeFrequency: 'monthly', priority: 0.6 }))
  }

  // Location-service combo pages
  for (const slug of getAllLocationServiceSlugs()) {
    entries.push(await forLocale(locale, `/${slug}`, { lastModified: now, changeFrequency: 'monthly', priority: 0.7 }))
  }

  return entries
}

async function getLocationsEntries(locale: Locale, now: string): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = []

  const allCitiesFlat = allCities.states.flatMap(state =>
    state.counties.flatMap(county =>
      county.cities.filter(c => c.is_active)
    )
  )

  // City pages
  for (const city of allCitiesFlat) {
    entries.push(await forLocale(locale, `/${city.slug}-movers`, { lastModified: now, changeFrequency: 'monthly', priority: 0.8 }))
  }

  // Neighborhood pages
  const allNeighborhoods = allCitiesFlat.flatMap(city =>
    (city.neighborhoods || []).filter((n: { is_active?: boolean }) => n.is_active !== false)
  )
  for (const n of allNeighborhoods) {
    entries.push(await forLocale(locale, `/${(n as { slug: string }).slug}-movers`, { lastModified: now, changeFrequency: 'monthly', priority: 0.7 }))
  }

  return entries
}

async function getRoutesEntries(locale: Locale, now: string): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = []
  const { allLongDistanceRoutes, allLocalRoutes } = await import('@/lib/routes-data')

  // Long distance routes
  const activeLongDistance = allLongDistanceRoutes.filter(r => r.is_active !== false)
  for (const r of activeLongDistance) {
    entries.push(await forLocale(locale, `/${r.slug}-movers`, { lastModified: now, changeFrequency: 'monthly', priority: 0.7 }))
  }

  // Local routes
  const activeLocal = allLocalRoutes.filter((r: { is_active?: boolean }) => r.is_active !== false)
  for (const r of activeLocal) {
    entries.push(await forLocale(locale, `/${(r as { slug: string }).slug}-movers`, { lastModified: now, changeFrequency: 'monthly', priority: 0.6 }))
  }

  // Route type pages
  entries.push(await forLocale(locale, `/moving-routes/long-distance`, { lastModified: now, changeFrequency: 'monthly', priority: 0.7 }))
  entries.push(await forLocale(locale, `/moving-routes/local`, { lastModified: now, changeFrequency: 'monthly', priority: 0.7 }))

  // Routes pagination (all)
  const totalActiveRoutes = activeLongDistance.length + activeLocal.length
  const totalRoutePages = Math.ceil(totalActiveRoutes / ROUTES_PER_PAGE)
  for (let page = 2; page <= totalRoutePages; page++) {
    entries.push(await forLocale(locale, `/moving-routes/page/${page}`, { lastModified: now, changeFrequency: 'monthly', priority: 0.5 }))
  }

  // Routes pagination (long-distance)
  const totalLdPages = Math.ceil(activeLongDistance.length / ROUTES_PER_PAGE)
  for (let page = 2; page <= totalLdPages; page++) {
    entries.push(await forLocale(locale, `/moving-routes/long-distance/page/${page}`, { lastModified: now, changeFrequency: 'monthly', priority: 0.5 }))
  }

  // Routes pagination (local)
  const totalLocalPages = Math.ceil(activeLocal.length / ROUTES_PER_PAGE)
  for (let page = 2; page <= totalLocalPages; page++) {
    entries.push(await forLocale(locale, `/moving-routes/local/page/${page}`, { lastModified: now, changeFrequency: 'monthly', priority: 0.5 }))
  }

  // Routes by location (cities + neighborhoods)
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

  for (const city of activeCities) {
    entries.push(await forLocale(locale, `/moving-routes/${city.slug}`, { lastModified: now, changeFrequency: 'monthly', priority: 0.6 }))
  }
  for (const slug of allActiveNeighborhoodSlugs) {
    entries.push(await forLocale(locale, `/moving-routes/${slug}`, { lastModified: now, changeFrequency: 'monthly', priority: 0.5 }))
  }

  return entries
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getEntriesForId(id: string): Promise<SitemapEntry[]> {
  const buildDate = process.env.BUILD_DATE || new Date().toISOString().split('T')[0]

  let area: string
  let locale: Locale
  if (id === 'en' || id === 'es') {
    area = 'general'
    locale = id as Locale
  } else {
    const lastDash = id.lastIndexOf('-')
    area = id.slice(0, lastDash)
    locale = id.slice(lastDash + 1) as Locale
  }

  switch (area) {
    case 'general':
      return getGeneralEntries(locale, buildDate)
    case 'blog':
      return getBlogEntries(locale, buildDate)
    case 'services':
      return getServicesEntries(locale, buildDate)
    case 'locations':
      return getLocationsEntries(locale, buildDate)
    case 'routes':
      return getRoutesEntries(locale, buildDate)
    default:
      return []
  }
}

/**
 * Serialize sitemap entries to XML urlset format.
 */
export function entriesToXml(entries: SitemapEntry[]): string {
  const hasAlternates = entries.some(e => Object.keys(e.alternates?.languages ?? {}).length > 0)

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'
  if (hasAlternates) {
    xml += ' xmlns:xhtml="http://www.w3.org/1999/xhtml"'
  }
  xml += '>\n'

  for (const entry of entries) {
    xml += '<url>\n'
    xml += `<loc>${entry.url}</loc>\n`
    if (entry.alternates?.languages) {
      for (const [lang, href] of Object.entries(entry.alternates.languages)) {
        xml += `<xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />\n`
      }
    }
    if (entry.lastModified) {
      const date = entry.lastModified instanceof Date
        ? entry.lastModified.toISOString()
        : entry.lastModified
      xml += `<lastmod>${date}</lastmod>\n`
    }
    if (entry.changeFrequency) {
      xml += `<changefreq>${entry.changeFrequency}</changefreq>\n`
    }
    if (typeof entry.priority === 'number') {
      xml += `<priority>${entry.priority}</priority>\n`
    }
    xml += '</url>\n'
  }

  xml += '</urlset>\n'
  return xml
}

/**
 * Generate sitemap index XML.
 */
export function sitemapIndexXml(): string {
  const buildDate = process.env.BUILD_DATE || new Date().toISOString().split('T')[0]

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  for (const id of SITEMAP_IDS) {
    xml += '<sitemap>\n'
    xml += `<loc>${base}/sitemap/${id}.xml</loc>\n`
    xml += `<lastmod>${buildDate}</lastmod>\n`
    xml += '</sitemap>\n'
  }

  xml += '</sitemapindex>\n'
  return xml
}
