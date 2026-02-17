import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Type definitions
export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  date: string
  updated: string
  readTime: string
  category: string
  image_folder: string | null
  featured: string | null
  image_keywords: string[]
  images: string[]
  service_link: string | null
  location_link: string | null
  status: string
  needs_ai_image: boolean
  content: string
}

export interface BlogPostSummary {
  id: number
  title: string
  slug: string
  date: string
  category: string
  excerpt?: string
  readTime?: string
  featured?: string | null
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

// Cache for posts to avoid re-reading files on every request
let postsCache: BlogPost[] | null = null
let indexCache: BlogPostSummary[] | null = null
// Cache for related posts to ensure consistency
const relatedPostsCache = new Map<string, BlogPost[]>()

/**
 * Get all posts from markdown files
 * Silently skips files that fail to parse to ensure the blog remains accessible
 */
export function getAllPosts(): BlogPost[] {
  if (postsCache) {
    return postsCache
  }

  try {
    const files = fs.readdirSync(postsDirectory)
      .filter(file => file.endsWith('.md'))
      .sort() // Sort by filename (which includes zero-padded ID)

    const posts: BlogPost[] = []

    for (const filename of files) {
      try {
        const filePath = path.join(postsDirectory, filename)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const { data, content } = matter(fileContents)

        // Validate required fields
        if (!data.id || !data.title || !data.slug || !data.date) {
          console.warn(`[Blog] Skipping ${filename}: missing required fields`)
          continue
        }

        posts.push({
          id: data.id as number,
          title: data.title as string,
          slug: data.slug as string,
          excerpt: data.excerpt as string || '',
          date: data.date as string,
          updated: data.updated as string || data.date as string,
          readTime: data.readTime as string || '3 min read',
          category: data.category as string || 'Moving Tips',
          image_folder: data.image_folder as string | null,
          featured: data.featured as string | null,
          image_keywords: (data.image_keywords as string[]) || [],
          images: (data.images as string[]) || [],
          service_link: data.service_link as string | null,
          location_link: data.location_link as string | null,
          status: data.status as string || 'pending',
          needs_ai_image: data.needs_ai_image as boolean || false,
          content: content.trim(),
        } as BlogPost)
      } catch (error) {
        // Log error but continue processing other files
        console.error(`[Blog] Failed to parse ${filename}:`, error instanceof Error ? error.message : String(error))
        continue
      }
    }

    postsCache = posts
    return posts
  } catch (error) {
    // If directory read fails, return empty array
    console.error('[Blog] Failed to read blog directory:', error instanceof Error ? error.message : String(error))
    return []
  }
}

/**
 * Get post summaries from index.json (lightweight, no content)
 */
export function getPostSummaries(): BlogPostSummary[] {
  if (indexCache) {
    return indexCache
  }

  try {
    const indexPath = path.join(postsDirectory, 'index.json')

    if (fs.existsSync(indexPath)) {
      const indexContents = fs.readFileSync(indexPath, 'utf8')
      indexCache = JSON.parse(indexContents) as BlogPostSummary[]
      return indexCache
    }

    // Fallback: build from posts
    const posts = getAllPosts()
    indexCache = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      date: post.date,
      category: post.category,
      excerpt: post.excerpt,
      readTime: post.readTime,
      featured: post.featured,
    }))

    return indexCache
  } catch (error) {
    console.error('[Blog] Failed to get post summaries:', error instanceof Error ? error.message : String(error))
    return []
  }
}

/**
 * Check if a post is published (date is today or earlier)
 */
export function isPublished(post: { date: string }): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const postDate = new Date(post.date)
  postDate.setHours(0, 0, 0, 0)
  return postDate <= today
}

/**
 * Get all published posts (filters out future-dated posts)
 */
export function getPublishedPosts(): BlogPost[] {
  return getAllPosts().filter(isPublished)
}

/**
 * Get a single post by slug (only if published)
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts()
  const post = posts.find(post => post.slug === slug) || null
  if (post && !isPublished(post)) return null
  return post
}

/**
 * Get a single post by ID
 */
export function getPostById(id: number): BlogPost | null {
  const posts = getAllPosts()
  return posts.find(post => post.id === id) || null
}

/**
 * Get all unique categories (from published posts only)
 */
export function getCategories(): string[] {
  try {
    const posts = getPublishedPosts()
    return Array.from(new Set(posts.map(post => post.category)))
  } catch (error) {
    console.error('[Blog] Failed to get categories:', error instanceof Error ? error.message : String(error))
    return []
  }
}

/**
 * Convert category display name to URL slug (lowercase, spaces to hyphens, special chars removed)
 */
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, 'and')           // Replace & with "and"
    .replace(/[^a-z0-9\s-]/g, '')   // Remove special characters
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/-+/g, '-')            // Collapse multiple hyphens
    .replace(/^-|-$/g, '')          // Trim leading/trailing hyphens
}

/**
 * Resolve URL slug to category display name, or null if no category matches
 */
export function getCategoryBySlug(slug: string): string | null {
  const categories = getCategories()
  const normalized = decodeURIComponent(slug).toLowerCase()
  return categories.find(cat => categoryToSlug(cat) === normalized) ?? null
}

/**
 * Get published posts by category
 */
export function getPostsByCategory(category: string): BlogPost[] {
  return getPublishedPosts().filter(post => post.category === category)
}

// Editorial (non-service) categories shown as top-level pills
const EDITORIAL_CATEGORIES = ['Fun Facts', 'Home & Living', 'Lifestyle', 'Location Guide', 'Moving Tips']

/**
 * Check if a category name is editorial (not a service category)
 */
export function isEditorialCategory(category: string): boolean {
  return EDITORIAL_CATEGORIES.includes(category)
}

/**
 * Check if a service_link matches a service slug
 * "/senior-moving" matches "senior-moving"
 * "/miami-senior-moving" matches "senior-moving" (suffix match)
 */
function matchesServiceSlug(serviceLink: string, slug: string): boolean {
  return serviceLink === `/${slug}` ||
         serviceLink.endsWith(`-${slug}`) ||
         serviceLink.endsWith(`/${slug}`)
}

/**
 * Get published posts by service slug (matches service_link field)
 */
export function getPostsByService(serviceSlug: string): BlogPost[] {
  return getPublishedPosts().filter(post => {
    const serviceLink = post.service_link || ''
    return matchesServiceSlug(serviceLink, serviceSlug)
  })
}

/**
 * Get all unique service slugs that have published blog posts
 */
export function getServiceSlugsFromBlog(): string[] {
  const { allServices } = require('@/lib/data')
  const posts = getPublishedPosts()
  const slugs = new Set<string>()
  for (const service of allServices) {
    const hasPost = posts.some(post => {
      const serviceLink = post.service_link || ''
      return matchesServiceSlug(serviceLink, service.slug)
    })
    if (hasPost) {
      slugs.add(service.slug)
    }
  }
  return Array.from(slugs)
}

/**
 * Check if a location link matches a location slug precisely
 * /miami-movers matches "miami", but /miami-gardens-movers does NOT match "miami"
 */
function matchesLocationSlug(locationLink: string, slug: string): boolean {
  return locationLink === `/${slug}` ||
         locationLink === `/${slug}-movers` ||
         locationLink === `/locations/${slug}`
}

/**
 * Get published posts by location slug (matches location_link field)
 */
export function getPostsByLocation(slug: string): BlogPost[] {
  return getPublishedPosts().filter(post => {
    const locationLink = post.location_link || ''
    return matchesLocationSlug(locationLink, slug)
  })
}

/**
 * Extract location slug from a location_link value (e.g., "/kendall-movers" → "kendall")
 */
export function locationLinkToSlug(locationLink: string): string {
  return locationLink
    .replace(/^\//, '')        // Remove leading slash
    .replace(/^locations\//, '') // Remove locations/ prefix
    .replace(/-movers$/, '')   // Remove -movers suffix
}

/**
 * Get all unique location slugs that have published posts
 */
export function getLocationSlugs(): string[] {
  const posts = getPublishedPosts()
  const slugs = new Set<string>()
  for (const post of posts) {
    if (post.location_link) {
      slugs.add(locationLinkToSlug(post.location_link))
    }
  }
  return Array.from(slugs)
}

/**
 * Get location display name from slug using city/neighborhood data
 */
export function getLocationNameBySlug(slug: string): string | null {
  const { getCityBySlug, getNeighborhoodBySlug } = require('@/lib/data')
  const city = getCityBySlug(slug)
  if (city) return city.name
  const neighborhood = getNeighborhoodBySlug(slug)
  if (neighborhood) return neighborhood.name
  return null
}

/**
 * Get published posts sorted by date (newest first), then by ID (highest first) for same dates
 */
export function getPostsSortedByDate(): BlogPost[] {
  try {
    const posts = getPublishedPosts()
    return [...posts].sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime()
      if (dateCompare !== 0) return dateCompare
      // For same dates, sort by ID descending (higher ID = newer post)
      return b.id - a.id
    })
  } catch (error) {
    console.error('[Blog] Failed to get sorted posts:', error instanceof Error ? error.message : String(error))
    return []
  }
}

/**
 * Get related posts based on category, service link, and keyword similarity
 * Results are cached to prevent re-computation on re-renders
 */
export function getRelatedPosts(slug: string, limit: number = 2): BlogPost[] {
  // Check cache first
  const cacheKey = `${slug}:${limit}`
  if (relatedPostsCache.has(cacheKey)) {
    return relatedPostsCache.get(cacheKey)!
  }

  const currentPost = getPostBySlug(slug)
  if (!currentPost) {
    relatedPostsCache.set(cacheKey, [])
    return []
  }

  const posts = getPublishedPosts()
  const otherPosts = posts.filter(post => post.slug !== slug)

  // Extract keywords from title (words 4+ chars, excluding common words)
  const commonWords = new Set(['your', 'with', 'from', 'that', 'this', 'have', 'will', 'what', 'when', 'where', 'which', 'their', 'about', 'into', 'more', 'some', 'them', 'been', 'were', 'being', 'these', 'those', 'would', 'could', 'should', 'before', 'after', 'during', 'through', 'between', 'under', 'over', 'such', 'here', 'there', 'each', 'every', 'both', 'most', 'other', 'some', 'just', 'only', 'also', 'very', 'even', 'back', 'well', 'much', 'then', 'than', 'make', 'made', 'like', 'time', 'year', 'good', 'best', 'tips', 'guide', 'ultimate', 'complete', 'essential', 'smooth', 'easy', 'simple', 'quick'])

  const getKeywords = (title: string): Set<string> => {
    return new Set(
      title.toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length >= 4 && !commonWords.has(word))
    )
  }

  const currentKeywords = getKeywords(currentPost.title)

  // Score each post for relevance
  const scoredPosts = otherPosts.map(post => {
    let score = 0

    // Same service link is highly relevant (+10)
    if (currentPost.service_link && post.service_link === currentPost.service_link) {
      score += 10
    }

    // Same location link is relevant (+8)
    if (currentPost.location_link && post.location_link === currentPost.location_link) {
      score += 8
    }

    // Same category (+5)
    if (post.category === currentPost.category) {
      score += 5
    }

    // Keyword overlap (+2 per matching keyword)
    const postKeywords = getKeywords(post.title)
    Array.from(currentKeywords).forEach(keyword => {
      if (postKeywords.has(keyword)) {
        score += 2
      }
    })

    // Bonus for having a featured image (+1)
    if (post.featured) {
      score += 1
    }

    return { post, score }
  })

  // Sort by score (highest first) with randomization among similar scores
  const sorted = scoredPosts.sort((a, b) => {
    // Group into score tiers (within 3 points is same tier)
    const tierA = Math.floor(a.score / 3)
    const tierB = Math.floor(b.score / 3)
    if (tierB !== tierA) return tierB - tierA
    // Within same tier, randomize
    return Math.random() - 0.5
  })

  // Take top candidates and pick randomly from them
  const topCandidates = sorted.filter(item => item.score >= sorted[0]?.score - 5).slice(0, limit * 3)

  // Shuffle top candidates and take limit
  for (let i = topCandidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [topCandidates[i], topCandidates[j]] = [topCandidates[j], topCandidates[i]]
  }

  const result = topCandidates.slice(0, limit).map(item => item.post)
  
  // Cache the result to prevent re-computation
  relatedPostsCache.set(cacheKey, result)
  
  return result
}

/**
 * Clear the cache (useful for development)
 */
export function clearCache(): void {
  postsCache = null
  indexCache = null
  relatedPostsCache.clear()
}

/**
 * Helper to generate srcset for responsive images
 */
export function getImageSrcSet(basePath: string, type: 'hero' | 'content' | 'grid' | 'thumb'): string {
  const sizes = {
    hero: [800, 1200, 1600, 2400],
    content: [400, 800, 1200],
    grid: [300, 600, 900],
    thumb: [150, 300]
  }

  return sizes[type].map(w => `${basePath}-${w}w.jpg ${w}w`).join(', ')
}

/**
 * Helper to get sizes attribute for responsive images
 */
export function getImageSizes(type: 'hero' | 'content' | 'grid' | 'thumb'): string {
  const sizesAttr = {
    hero: '100vw',
    content: '(max-width: 768px) 100vw, 800px',
    grid: '(max-width: 768px) 100vw, 33vw',
    thumb: '150px'
  }

  return sizesAttr[type]
}
