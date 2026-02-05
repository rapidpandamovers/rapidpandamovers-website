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

/**
 * Get all posts from markdown files
 */
export function getAllPosts(): BlogPost[] {
  if (postsCache) {
    return postsCache
  }

  const files = fs.readdirSync(postsDirectory)
    .filter(file => file.endsWith('.md'))
    .sort() // Sort by filename (which includes zero-padded ID)

  const posts = files.map(filename => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
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
    } as BlogPost
  })

  postsCache = posts
  return posts
}

/**
 * Get post summaries from index.json (lightweight, no content)
 */
export function getPostSummaries(): BlogPostSummary[] {
  if (indexCache) {
    return indexCache
  }

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
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts()
  return posts.find(post => post.slug === slug) || null
}

/**
 * Get a single post by ID
 */
export function getPostById(id: number): BlogPost | null {
  const posts = getAllPosts()
  return posts.find(post => post.id === id) || null
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  const posts = getAllPosts()
  return Array.from(new Set(posts.map(post => post.category)))
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category: string): BlogPost[] {
  const posts = getAllPosts()
  return posts.filter(post => post.category === category)
}

/**
 * Get posts sorted by date (newest first), then by ID (highest first) for same dates
 */
export function getPostsSortedByDate(): BlogPost[] {
  const posts = getAllPosts()
  return [...posts].sort((a, b) => {
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime()
    if (dateCompare !== 0) return dateCompare
    // For same dates, sort by ID descending (higher ID = newer post)
    return b.id - a.id
  })
}

/**
 * Get related posts based on category, service link, and keyword similarity
 */
export function getRelatedPosts(slug: string, limit: number = 2): BlogPost[] {
  const currentPost = getPostBySlug(slug)
  if (!currentPost) return []

  const posts = getAllPosts()
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

  return topCandidates.slice(0, limit).map(item => item.post)
}

/**
 * Clear the cache (useful for development)
 */
export function clearCache(): void {
  postsCache = null
  indexCache = null
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
