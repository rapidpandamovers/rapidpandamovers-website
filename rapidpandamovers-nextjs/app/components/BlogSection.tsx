import Link from 'next/link'
import { Calendar, Clock, ArrowRight, BookOpen, Lightbulb } from 'lucide-react'
import { getPostsSortedByDate } from '../../lib/blog'
import BlogPostCard from '../blog/BlogPostCard'
import FeaturedPostCard from '../blog/FeaturedPostCard'

interface BlogSectionProps {
  showFeatured?: boolean
  showCategories?: boolean
  maxPosts?: number
  className?: string
  // Filter by service (matches service_link in blog posts)
  serviceFilter?: string
  // Filter by location (matches location_link in blog posts)
  locationFilter?: string
  // Fallback location filter (used if primary locationFilter returns no results)
  locationFilterFallback?: string
  // Filter by category
  categoryFilter?: string
  // Fallback category filter (used if location filters return no results)
  categoryFilterFallback?: string
  // Custom title override
  title?: string
  // Custom subtitle override
  subtitle?: string
  // Hide the section header entirely
  hideHeader?: boolean
  // Show a "View More" link - either as a card in the grid or button at bottom
  showViewMore?: boolean
  // Position of the View More link: 'card' in grid, 'bottom' as button below
  viewMorePosition?: 'card' | 'bottom'
  // Link for the View More (defaults to /blog)
  viewMoreLink?: string
  // Title for the View More card (only used when position is 'card')
  viewMoreTitle?: string
  // Subtitle for the View More card (only used when position is 'card')
  viewMoreSubtitle?: string
  // Button text for View More (only used when position is 'bottom')
  viewMoreButtonText?: string
  // Exclude a specific post by slug (useful for related posts on a blog post page)
  excludeSlug?: string
  // Variant: 'default' centered header, 'compact' 2 posts + CTA box, 'left' left-aligned header with inline view more
  variant?: 'default' | 'compact' | 'left'
  // Show featured images on post cards
  showImages?: boolean
  // Show a Moving Tips CTA card alongside the viewMore card
  showTipsCard?: boolean
  // Show blog post excerpts
  showExcerpts?: boolean
  // Show category pill on post cards
  showCategoryPill?: boolean
}

export default function BlogSection({
  showFeatured = true,
  showCategories = true,
  maxPosts = 6,
  className = "",
  serviceFilter,
  locationFilter,
  locationFilterFallback,
  categoryFilter,
  categoryFilterFallback,
  title,
  subtitle,
  hideHeader = false,
  showViewMore = false,
  viewMorePosition = 'card',
  viewMoreLink = '/blog',
  viewMoreTitle = 'Explore More Articles',
  viewMoreSubtitle = 'Discover helpful tips and guides for your move',
  viewMoreButtonText = 'View All Articles',
  excludeSlug,
  variant = 'default',
  showImages = false,
  showTipsCard = false,
  showExcerpts = true,
  showCategoryPill = true,
}: BlogSectionProps) {
  // Get all posts sorted by date (from markdown files)
  const allPosts = getPostsSortedByDate()
  let filteredBlog = excludeSlug
    ? allPosts.filter(post => post.slug !== excludeSlug)
    : [...allPosts]

  // Apply filters - service_link values are like "/packing-services" or "/miami-packing-services"
  // We match if the service_link ends with the service slug
  if (serviceFilter) {
    filteredBlog = filteredBlog.filter(post => {
      const serviceLink = post.service_link || ''
      // Match exact slug or slug at end of path (e.g., /miami-packing-services matches packing-services)
      return serviceLink === `/${serviceFilter}` ||
             serviceLink.endsWith(`-${serviceFilter}`) ||
             serviceLink.endsWith(`/${serviceFilter}`)
    })
  }
  if (locationFilter) {
    // Helper to check if a location link matches a location slug precisely
    // /miami-movers matches "miami", but /miami-gardens-movers does NOT match "miami"
    const matchesLocation = (locationLink: string, slug: string): boolean => {
      return locationLink === `/${slug}` ||
             locationLink === `/${slug}-movers` ||
             locationLink === `/locations/${slug}`
    }

    const locationMatches = filteredBlog.filter(post => {
      const locationLink = post.location_link || ''
      return matchesLocation(locationLink, locationFilter)
    })

    // If no matches found and we have a fallback location, try that
    if (locationMatches.length === 0 && locationFilterFallback) {
      filteredBlog = filteredBlog.filter(post => {
        const locationLink = post.location_link || ''
        return matchesLocation(locationLink, locationFilterFallback)
      })
    } else {
      filteredBlog = locationMatches
    }
  }
  if (categoryFilter) {
    filteredBlog = filteredBlog.filter(post => post.category === categoryFilter)
  }

  // If no results after location/category filtering, fall back to category
  if (filteredBlog.length === 0 && categoryFilterFallback) {
    filteredBlog = allPosts.filter(post => post.category === categoryFilterFallback)
  }

  const sortedBlog = filteredBlog
  const categories = Array.from(new Set(allPosts.map(post => post.category)))
  
  // Don't render if no posts match filters
  if (sortedBlog.length === 0) {
    return null
  }

  // Compact variant: 3-column grid with 2 posts + 1 orange CTA box
  if (variant === 'compact') {
    const compactPosts = sortedBlog.slice(0, 2)
    return (
      <section className={`pt-20 ${className}`}>
        <div className="container mx-auto">
          {!hideHeader && (
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {title || 'Moving Tips & Insights'}
              </h2>
              {subtitle && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {compactPosts.map((post) => (
              showImages ? (
                <BlogPostCard key={post.id} post={post} showExcerpt={showExcerpts} showCategoryPill={showCategoryPill} />
              ) : (
                <article key={post.id} className="bg-gray-50 rounded-4xl p-8 flex flex-col">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span className="mx-2">·</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                  {showCategoryPill && (
                    <span className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full w-fit mb-3">
                      {post.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    <Link href={`/blog/${post.slug}`} className="hover:text-orange-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  {showExcerpts && (
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                  )}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-orange-500 hover:text-orange-600 font-medium inline-flex items-center mt-auto"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </article>
              )
            ))}

            {/* CTA Boxes */}
            <div className="flex flex-col gap-8">
              <div className="bg-orange-50 rounded-4xl p-8 flex flex-col flex-1">
                <div className="flex-1">
                  <BookOpen className="w-10 h-10 text-orange-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {viewMoreTitle}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {viewMoreSubtitle}
                  </p>
                </div>
                <Link
                  href={viewMoreLink}
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {viewMoreButtonText || 'Browse All Articles'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {showTipsCard && (
                <div className="bg-orange-50 rounded-4xl p-8 flex flex-col flex-1">
                  <div className="flex-1">
                    <Lightbulb className="w-10 h-10 text-orange-500 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      More Tips
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Expert advice to make your next move smooth
                    </p>
                  </div>
                  <Link
                    href="/moving-tips"
                    className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Browse Moving Tips
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Left variant: left-aligned header with inline view more button
  if (variant === 'left') {
    return (
      <section className={`pt-20 ${className}`}>
        <div className="container mx-auto">
          {!hideHeader && (
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {title || 'Moving Tips & Insights'}
                </h2>
                {subtitle && (
                  <p className="text-lg text-gray-600">
                    {subtitle}
                  </p>
                )}
              </div>
              {showViewMore && (
                <Link
                  href={viewMoreLink}
                  className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold mt-4 md:mt-0"
                >
                  {viewMoreButtonText || 'View All Articles'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              )}
            </div>
          )}

          {/* Featured Post */}
          {showFeatured && sortedBlog.length > 0 && (
            <div className="mb-16">
              <FeaturedPostCard post={sortedBlog[0]} />
            </div>
          )}

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedBlog.slice(showFeatured ? 1 : 0, showFeatured ? maxPosts + 1 : maxPosts).map((post) => (
              <BlogPostCard key={post.id} post={post} showExcerpt={showExcerpts} showCategoryPill={showCategoryPill} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`pt-20 ${className}`}>
      <div className="container mx-auto">
        {!hideHeader && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {title || 'Moving Tips & Insights'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle || 'Expert advice and practical tips to make your move smooth and affordable'}
            </p>
          </div>
        )}

        {/* Categories Filter */}
        {showCategories && !hideHeader && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              All Posts
            </button>
            {categories.map((category) => (
              <button key={category} className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                {category}
              </button>
            ))}
          </div>
        )}
        
        {/* Featured Post */}
        {showFeatured && sortedBlog.length > 0 && (
          <div className="mb-16">
            <FeaturedPostCard post={sortedBlog[0]} />
          </div>
        )}
        
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedBlog.slice(showFeatured ? 1 : 0, showFeatured ? maxPosts + 1 : maxPosts).map((post) => (
            <BlogPostCard key={post.id} post={post} showExcerpt={showExcerpts} showCategoryPill={showCategoryPill} />
          ))}

          {/* View More Card */}
          {showViewMore && viewMorePosition === 'card' && (
            <Link
              href={viewMoreLink}
              className="bg-orange-50 rounded-4xl p-8 flex flex-col group"
            >
              <div className="flex-1">
                <BookOpen className="w-10 h-10 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {viewMoreTitle}
                </h3>
                <p className="text-gray-600 mb-4">
                  {viewMoreSubtitle}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                {viewMoreButtonText || 'Browse All Articles'}
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          )}
        </div>

        {/* View More Button (bottom position) */}
        {showViewMore && viewMorePosition === 'bottom' && (
          <div className="text-center mt-12">
            <Link
              href={viewMoreLink}
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              {viewMoreButtonText}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
