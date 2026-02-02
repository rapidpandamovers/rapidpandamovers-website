import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import blogData from '../../data/posts.json'
import Hero from '../components/Hero'
import NewsletterSection from '../components/NewsletterSection'
import BlogPostLink from './BlogPostLink'

const POSTS_PER_PAGE = 12

interface BlogListPageProps {
  currentPage: number
  category?: string | null
}

export default function BlogListPage({ currentPage, category = null }: BlogListPageProps) {
  // Sort blog posts by date descending (newest first)
  const sortedBlog = [...blogData].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const categories = Array.from(new Set(sortedBlog.map(post => post.category)))

  // Filter posts by category
  const filteredPosts = category
    ? sortedBlog.filter(post => post.category === category)
    : sortedBlog

  // Get featured post (first post, only on page 1 when showing all)
  const featuredPost = (!category && currentPage === 1) ? sortedBlog[0] : null

  // Posts for pagination (exclude featured if showing all on page 1)
  const postsForPagination = category
    ? filteredPosts
    : filteredPosts.slice(1)

  // Pagination logic
  const totalPages = Math.ceil(postsForPagination.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = postsForPagination.slice(startIndex, startIndex + POSTS_PER_PAGE)

  // Generate page URL
  const getPageUrl = (page: number) => {
    if (page === 1) return '/blog'
    return `/blog/page/${page}`
  }

  // Generate pagination numbers
  const getPaginationNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = []
    const showEllipsisStart = currentPage > 3
    const showEllipsisEnd = currentPage < totalPages - 2

    // Always show first page
    pages.push(1)

    // Show ellipsis or page 2
    if (showEllipsisStart) {
      pages.push('...')
    } else if (totalPages > 1) {
      pages.push(2)
    }

    // Show pages around current
    for (let i = Math.max(3, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
      if (!pages.includes(i)) pages.push(i)
    }

    // Show ellipsis or second-to-last page
    if (showEllipsisEnd) {
      pages.push('...')
    } else if (totalPages > 2 && !pages.includes(totalPages - 1)) {
      pages.push(totalPages - 1)
    }

    // Always show last page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero
        title="Moving Guides & Insights"
        description="Expert advice and practical tips to make your move smooth and affordable"
        cta="Get Your Free Quote"
      />

      <div className="container mx-auto px-4 py-16">

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Link
            href="/blog"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !category
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Posts
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/blog/category/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-'))}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Featured Post (only on page 1 when showing all posts) */}
        {featuredPost && (
          <div className="mb-16">
            <article className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl overflow-hidden text-white">
              <div className="p-8 md:p-12">
                <div className="flex items-center text-orange-100 mb-4">
                  <Tag className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{featuredPost.category}</span>
                  <span className="mx-3">•</span>
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">{new Date(featuredPost.date).toLocaleDateString()}</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <BlogPostLink href={`/blog/${featuredPost.slug}`} className="hover:text-orange-100 transition-colors">
                    {featuredPost.title}
                  </BlogPostLink>
                </h2>

                <p className="text-xl text-orange-100 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <BlogPostLink
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Read Full Article
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </BlogPostLink>
              </div>
            </article>
          </div>
        )}

        {/* Category Header (when filtered) */}
        {category && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {category}
            </h2>
            <p className="text-gray-600 mt-2">
              {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} in this category
            </p>
          </div>
        )}

        {/* Blog Posts Grid */}
        {paginatedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPosts.map((post) => (
              <article key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
                {post.image && (
                  <BlogPostLink href={`/blog/${post.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </BlogPostLink>
                )}
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
                    <Link
                      href={`/blog/category/${encodeURIComponent(post.category.toLowerCase().replace(/\s+/g, '-'))}`}
                      className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full hover:bg-orange-200 transition-colors"
                    >
                      {post.category}
                    </Link>
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
                    <BlogPostLink href={`/blog/${post.slug}`}>
                      {post.title}
                    </BlogPostLink>
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <BlogPostLink
                    href={`/blog/${post.slug}`}
                    className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center group"
                  >
                    Read More
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </BlogPostLink>
                </div>
              </article>
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
                className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
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
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
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
                className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
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
            Page {currentPage} of {totalPages} ({postsForPagination.length} posts)
          </p>
        )}

      </div>

      <NewsletterSection />
    </div>
  )
}
