import Link from 'next/link'
import { Calendar, Clock, Tag, ArrowRight, BookOpen } from 'lucide-react'
import { getPostsSortedByDate } from '../../lib/blog'

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
}: BlogSectionProps) {
  // Get all posts sorted by date (from markdown files)
  const allPosts = getPostsSortedByDate()
  let filteredBlog = [...allPosts]

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
             locationLink === `/${slug}-movers`
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

  return (
    <div className={`py-20 ${className}`}>
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
            <article className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl overflow-hidden text-white">
              <div className="p-8 md:p-12">
                <div className="flex items-center text-orange-100 mb-4">
                  <Tag className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{sortedBlog[0].category}</span>
                  <span className="mx-3">•</span>
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">{new Date(sortedBlog[0].date).toLocaleDateString()}</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <Link href={`/blog/${sortedBlog[0].slug}`} className="hover:text-orange-100 transition-colors">
                    {sortedBlog[0].title}
                  </Link>
                </h2>

                <p className="text-xl text-orange-100 mb-6 leading-relaxed">
                  {sortedBlog[0].excerpt}
                </p>

                <Link
                  href={`/blog/${sortedBlog[0].slug}`}
                  className="inline-flex items-center bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Read Full Article
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          </div>
        )}
        
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedBlog.slice(showFeatured ? 1 : 0, showFeatured ? maxPosts + 1 : maxPosts).map((post) => (
            <article key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="p-6">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center group"
                >
                  Read More
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}

          {/* View More Card */}
          {showViewMore && viewMorePosition === 'card' && (
            <Link
              href={viewMoreLink}
              className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg overflow-hidden text-white hover:from-orange-600 hover:to-red-600 transition-all group flex flex-col justify-between"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="mb-4">
                  <BookOpen className="w-10 h-10 text-orange-100" />
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-orange-100 transition-colors">
                    {viewMoreTitle}
                  </h3>

                  <p className="text-orange-100 mb-4">
                    {viewMoreSubtitle}
                  </p>
                </div>

                <div className="inline-flex items-center text-white font-semibold group-hover:translate-x-1 transition-transform">
                  Browse All Articles
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
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
    </div>
  )
}
