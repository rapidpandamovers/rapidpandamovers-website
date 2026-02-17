import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getPostsSortedByDate, getCategories, categoryToSlug, getPostsByLocation, getPostsByService, getLocationSlugs, getLocationNameBySlug } from '../../lib/blog'
import Hero from '../components/Hero'
import ResourceSection from '../components/ResourceSection'
import NewsletterSection from '../components/NewsletterSection'
import BlogPostCard from './BlogPostCard'
import BlogCategoryFilter from './BlogCategoryFilter'
import FeaturedPostCard from './FeaturedPostCard'

const POSTS_PER_PAGE = 12

interface BlogListPageProps {
  currentPage: number
  category?: string | null
  locationSlug?: string | null
  locationName?: string | null
  serviceSlug?: string | null
  serviceName?: string | null
}

export default function BlogListPage({ currentPage, category = null, locationSlug = null, locationName = null, serviceSlug = null, serviceName = null }: BlogListPageProps) {
  // Get posts sorted by date descending (newest first)
  // Handle errors gracefully - if parsing fails, show empty state
  let sortedBlog: ReturnType<typeof getPostsSortedByDate> = []
  let categories: ReturnType<typeof getCategories> = []

  try {
    sortedBlog = getPostsSortedByDate()
    categories = getCategories()
  } catch (error) {
    console.error('[BlogListPage] Error loading posts:', error)
    // sortedBlog and categories remain empty arrays
  }

  // Filter posts by category, location, or service
  const dateSorter = (a: { date: string; id: number }, b: { date: string; id: number }) => {
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime()
    if (dateCompare !== 0) return dateCompare
    return b.id - a.id
  }

  const filteredPosts = serviceSlug
    ? getPostsByService(serviceSlug).sort(dateSorter)
    : locationSlug
      ? getPostsByLocation(locationSlug).sort(dateSorter)
      : category
        ? sortedBlog.filter(post => post.category === category)
        : sortedBlog

  // Get featured post (first post, only on page 1 when showing all)
  const featuredPost = (!category && !locationSlug && !serviceSlug && currentPage === 1) ? sortedBlog[0] : null

  // Posts for pagination (exclude featured if showing all on page 1)
  const postsForPagination = (category || serviceSlug || locationSlug)
    ? filteredPosts
    : filteredPosts.slice(1)

  // Pagination logic
  const totalPages = Math.ceil(postsForPagination.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = postsForPagination.slice(startIndex, startIndex + POSTS_PER_PAGE)

  // Generate page URL (include category/location/service slug when filtering)
  const getPageUrl = (page: number) => {
    if (serviceSlug) {
      if (page === 1) return `/blog/service/${encodeURIComponent(serviceSlug)}`
      return `/blog/service/${encodeURIComponent(serviceSlug)}/page/${page}`
    }
    if (locationSlug) {
      if (page === 1) return `/blog/location/${encodeURIComponent(locationSlug)}`
      return `/blog/location/${encodeURIComponent(locationSlug)}/page/${page}`
    }
    if (category) {
      const slug = categoryToSlug(category)
      if (page === 1) return `/blog/category/${encodeURIComponent(slug)}`
      return `/blog/category/${encodeURIComponent(slug)}/page/${page}`
    }
    if (page === 1) return '/blog'
    return `/blog/page/${page}`
  }

  // Generate pagination numbers
  const getPaginationNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = []
    const edgeCount = 2 // Show 2 pages at each end
    const surroundCount = 1 // Show 1 page on each side of current

    const showEllipsisStart = currentPage > edgeCount + surroundCount + 1
    const showEllipsisEnd = currentPage < totalPages - edgeCount - surroundCount

    // Always show first edgeCount pages
    for (let i = 1; i <= Math.min(edgeCount, totalPages); i++) {
      pages.push(i)
    }

    // Show ellipsis if needed
    if (showEllipsisStart) {
      pages.push('...')
    }

    // Show pages around current
    for (let i = Math.max(edgeCount + 1, currentPage - surroundCount); i <= Math.min(totalPages - edgeCount, currentPage + surroundCount); i++) {
      if (!pages.includes(i)) pages.push(i)
    }

    // Show ellipsis if needed
    if (showEllipsisEnd) {
      pages.push('...')
    }

    // Always show last edgeCount pages
    for (let i = Math.max(totalPages - edgeCount + 1, edgeCount + 1); i <= totalPages; i++) {
      if (!pages.includes(i)) pages.push(i)
    }

    return pages
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title="Moving Guides & Insights"
        description="Expert advice and practical tips to make your move smooth and affordable"
        cta="Get Your Free Quote"
      />

      <div className="container mx-auto pt-20">

        {/* Categories Filter */}
        <BlogCategoryFilter
          categories={categories}
          activeCategory={category}
          locations={getLocationSlugs().map(s => ({ slug: s, name: getLocationNameBySlug(s) || s })).filter(l => l.name !== l.slug).sort((a, b) => a.name.localeCompare(b.name))}
          activeLocation={locationSlug}
          activeService={serviceSlug}
        />

        {/* Featured Post (only on page 1 when showing all posts) */}
        {featuredPost && (
          <div className="mb-16">
            <FeaturedPostCard post={featuredPost} />
          </div>
        )}

        {/* Category/Location/Service Header (when filtered) */}
        {(category || locationName || serviceName) && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {serviceName ? `${serviceName} Tips & Guides` : locationName ? `Moving Tips for ${locationName}` : category}
            </h2>
            <p className="text-gray-600 mt-2">
              {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} {serviceName ? `about ${serviceName.toLowerCase()}` : locationName ? `about ${locationName}` : 'in this category'}
            </p>
          </div>
        )}

        {/* Blog Posts Grid */}
        {paginatedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No posts found in this category.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {currentPage > 1 ? (
              <Link
                href={getPageUrl(currentPage - 1)}
                className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-500 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Link>
            ) : (
              <span className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-400 cursor-not-allowed opacity-50">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </span>
            )}

            <div className="flex items-center gap-1">
              {getPaginationNumbers().map((page, idx) => (
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-gray-500">
                    ...
                  </span>
                ) : (
                  <Link
                    key={page}
                    href={getPageUrl(page as number)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-500'
                    }`}
                  >
                    {page}
                  </Link>
                )
              ))}
            </div>

            {currentPage < totalPages ? (
              <Link
                href={getPageUrl(currentPage + 1)}
                className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-500 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            ) : (
              <span className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-400 cursor-not-allowed opacity-50">
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            )}
          </div>
        )}

        {/* Page indicator */}
        {totalPages > 1 && (
          <p className="text-center text-gray-500 mt-4">
            Page {currentPage} of {totalPages} ({filteredPosts.length} posts)
          </p>
        )}

      </div>

      {/* Resources Section */}
      <ResourceSection
        title="More Moving Resources"
        subtitle="Explore our comprehensive guides and services for a successful move"
        variant="grid"
      />

      <NewsletterSection />

    </div>
  )
}
