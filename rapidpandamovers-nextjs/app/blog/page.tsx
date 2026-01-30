'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import blogData from '../../data/blog.json'
import Hero from '../components/Hero'
import NewsletterSection from '../components/NewsletterSection'

const POSTS_PER_PAGE = 6

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Sort blog posts by date descending (newest first)
  const sortedBlog = [...blogData].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const categories = Array.from(new Set(sortedBlog.map(post => post.category)))

  // Filter posts by category
  const filteredPosts = selectedCategory
    ? sortedBlog.filter(post => post.category === selectedCategory)
    : sortedBlog

  // Get featured post (first post, only when showing all)
  const featuredPost = selectedCategory ? null : sortedBlog[0]

  // Posts for pagination (exclude featured if showing all)
  const postsForPagination = selectedCategory
    ? filteredPosts
    : filteredPosts.slice(1)

  // Pagination logic
  const totalPages = Math.ceil(postsForPagination.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = postsForPagination.slice(startIndex, startIndex + POSTS_PER_PAGE)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  const selectCategory = (category: string | null) => {
    setSelectedCategory(category)
    setCurrentPage(1)
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
          <button
            onClick={() => selectCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Posts
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => selectCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post (only when showing all posts) */}
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
                  <Link href={`/blog/${featuredPost.slug}`} className="hover:text-orange-100 transition-colors">
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-xl text-orange-100 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <Link
                  href={`/blog/${featuredPost.slug}`}
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

        {/* Category Header (when filtered) */}
        {selectedCategory && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedCategory}
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
                    <button
                      onClick={() => selectCategory(post.category)}
                      className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full hover:bg-orange-200 transition-colors"
                    >
                      {post.category}
                    </button>
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
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No posts found in this category.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-orange-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
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
