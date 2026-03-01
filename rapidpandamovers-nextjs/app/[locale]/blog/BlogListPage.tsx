import { Link } from '@/i18n/routing'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getPostsSortedByDate, getCategories, categoryToSlug, getPostsByLocation, getPostsByService, getLocationSlugs, getLocationNameBySlug } from '@/lib/blog'
import Hero from '@/app/components/Hero'
import ResourceSection from '@/app/components/ResourceSection'
import NewsletterSection from '@/app/components/NewsletterSection'
import BlogPostCard from './BlogPostCard'
import BlogCategoryFilter from './BlogCategoryFilter'
import FeaturedPostCard from './FeaturedPostCard'
import { getMessages, getLocale } from 'next-intl/server'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'
import { H2 } from '@/app/components/Heading'

const POSTS_PER_PAGE = 12

interface BlogListPageProps {
  currentPage: number
  category?: string | null
  locationSlug?: string | null
  locationName?: string | null
  serviceSlug?: string | null
  serviceName?: string | null
}

export default async function BlogListPage({ currentPage, category = null, locationSlug = null, locationName = null, serviceSlug = null, serviceName = null }: BlogListPageProps) {
  const locale = await getLocale() as Locale;
  const { content, ui } = (await getMessages()) as any;
  // Get posts sorted by date descending (newest first)
  // Handle errors gracefully - if parsing fails, show empty state
  let sortedBlog: ReturnType<typeof getPostsSortedByDate> = []
  let categories: ReturnType<typeof getCategories> = []

  try {
    sortedBlog = getPostsSortedByDate(locale)
    categories = getCategories(locale)
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
    ? getPostsByService(serviceSlug, locale).sort(dateSorter)
    : locationSlug
      ? getPostsByLocation(locationSlug, locale).sort(dateSorter)
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
  const pageSlug = getTranslatedSlug('page', locale)
  const serviceSegment = getTranslatedSlug('service', locale)
  const locationSegment = getTranslatedSlug('location', locale)
  const categorySegment = getTranslatedSlug('category', locale)
  // serviceSlug is the canonical English slug (for data lookups); translate for URLs
  const translatedServiceSlug = serviceSlug ? getTranslatedSlug(serviceSlug, locale) : null
  const getPageUrl = (page: number) => {
    if (translatedServiceSlug) {
      if (page === 1) return `/blog/${serviceSegment}/${encodeURIComponent(translatedServiceSlug)}`
      return `/blog/${serviceSegment}/${encodeURIComponent(translatedServiceSlug)}/${pageSlug}/${page}`
    }
    if (locationSlug) {
      if (page === 1) return `/blog/${locationSegment}/${encodeURIComponent(locationSlug)}`
      return `/blog/${locationSegment}/${encodeURIComponent(locationSlug)}/${pageSlug}/${page}`
    }
    if (category) {
      const slug = categoryToSlug(category)
      if (page === 1) return `/blog/${categorySegment}/${encodeURIComponent(slug)}`
      return `/blog/${categorySegment}/${encodeURIComponent(slug)}/${pageSlug}/${page}`
    }
    if (page === 1) return '/blog'
    return `/blog/${pageSlug}/${page}`
  }

  // Generate pagination numbers
  const getPaginationNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = []
    const edgeCount = 1 // Show 1 page at each end
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
        title={content.blog.hero.title}
        description={content.blog.hero.description}
        cta={content.blog.hero.cta}
      />

      <div className="container mx-auto pt-20">

        {/* Categories Filter */}
        <BlogCategoryFilter
          categories={categories}
          activeCategory={category}
          locations={getLocationSlugs(locale).map(s => ({ slug: s, name: getLocationNameBySlug(s) || s })).filter(l => l.name !== l.slug).sort((a, b) => a.name.localeCompare(b.name))}
          activeLocation={locationSlug}
          activeService={translatedServiceSlug}
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
            <H2 className="text-2xl font-bold text-gray-800">
              {serviceName ? (ui?.blog?.tipsAndGuides?.replace('{name}', serviceName) ?? `${serviceName} Tips & Guides`) : locationName ? (ui?.blog?.movingTipsFor?.replace('{name}', locationName) ?? `Moving Tips for ${locationName}`) : (ui?.blogCategories?.[category || ''] || category)}
            </H2>
            <p className="text-gray-600 mt-2">
              {(() => {
                const count = filteredPosts.length
                const postWord = count !== 1 ? (ui?.blog?.postPlural ?? 'posts') : (ui?.blog?.postSingular ?? 'post')
                if (serviceName || locationName) {
                  const name = serviceName ? serviceName.toLowerCase() : locationName
                  return ui?.blog?.postsAbout?.replace('{count}', String(count)).replace('{postWord}', postWord).replace('{name}', name) ?? `${count} ${postWord} about ${name}`
                }
                return ui?.blog?.postsInCategory?.replace('{count}', String(count)).replace('{postWord}', postWord) ?? `${count} ${postWord} in this category`
              })()}
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
            <p className="text-gray-600 text-lg">{ui?.blog?.noPostsFound || 'No posts found in this category.'}</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 md:gap-2 mt-12">
            {currentPage > 1 ? (
              <Link
                href={getPageUrl(currentPage - 1)}
                className="flex items-center px-2 py-2 md:px-4 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 md:mr-1" />
                <span className="hidden md:inline">{ui?.pagination?.previous || 'Previous'}</span>
              </Link>
            ) : (
              <span className="flex items-center px-2 py-2 md:px-4 rounded-lg border border-gray-300 bg-white text-gray-400 cursor-not-allowed opacity-50">
                <ChevronLeft className="w-4 h-4 md:mr-1" />
                <span className="hidden md:inline">{ui?.pagination?.previous || 'Previous'}</span>
              </span>
            )}

            <div className="flex items-center gap-1">
              {getPaginationNumbers().map((page, idx) => (
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-500 text-sm md:text-base">
                    ...
                  </span>
                ) : (
                  <Link
                    key={page}
                    href={getPageUrl(page as number)}
                    className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg font-medium text-sm md:text-base transition-colors ${
                      currentPage === page
                        ? 'bg-orange-600 text-white text-shadow-sm'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600'
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
                className="flex items-center px-2 py-2 md:px-4 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600 transition-colors"
              >
                <span className="hidden md:inline">{ui?.pagination?.next || 'Next'}</span>
                <ChevronRight className="w-4 h-4 md:ml-1" />
              </Link>
            ) : (
              <span className="flex items-center px-2 py-2 md:px-4 rounded-lg border border-gray-300 bg-white text-gray-400 cursor-not-allowed opacity-50">
                <span className="hidden md:inline">{ui?.pagination?.next || 'Next'}</span>
                <ChevronRight className="w-4 h-4 md:ml-1" />
              </span>
            )}
          </div>
        )}

        {/* Page indicator */}
        {totalPages > 1 && (
          <p className="text-center text-gray-500 mt-4">
            {ui?.pagination?.pageIndicator?.replace('{current}', String(currentPage)).replace('{total}', String(totalPages)).replace('{count}', String(filteredPosts.length)).replace('{itemType}', ui?.blog?.itemTypes ?? 'posts') ?? `Page ${currentPage} of ${totalPages} (${filteredPosts.length} posts)`}
          </p>
        )}

      </div>

      {/* Resources Section */}
      <ResourceSection
        title={content.blog.resourceSection.title}
        subtitle={content.blog.resourceSection.subtitle}
        variant="grid"
        pathname="/blog"
      />

      <NewsletterSection />

    </div>
  )
}
