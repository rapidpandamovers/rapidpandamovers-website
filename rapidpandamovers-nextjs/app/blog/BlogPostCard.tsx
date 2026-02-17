'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ImageOff, ArrowRight } from 'lucide-react'
import BlogPostLink from './BlogPostLink'

interface BlogPostCardProps {
  post: {
    id: number
    slug: string
    title: string
    excerpt: string
    date: string
    readTime: string
    category: string
    featured?: string | null
  }
  showExcerpt?: boolean
  showCategoryPill?: boolean
}

export default function BlogPostCard({ post, showExcerpt = true, showCategoryPill = true }: BlogPostCardProps) {
  const [imageError, setImageError] = useState(false)
  const hasValidImage = post.featured && typeof post.featured === 'string' && post.featured.startsWith('/')

  return (
    <article className="bg-gray-50 rounded-4xl overflow-hidden flex flex-col group">
      <div className="p-8 pb-0">
        {hasValidImage && !imageError ? (
          <BlogPostLink href={`/blog/${post.slug}`}>
            <div className="relative h-48 overflow-hidden rounded-2xl">
              <Image
                src={post.featured!}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            </div>
          </BlogPostLink>
        ) : (
          <BlogPostLink href={`/blog/${post.slug}`}>
            <div className="relative h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <ImageOff className="w-12 h-12 text-orange-300" />
            </div>
          </BlogPostLink>
        )}
      </div>
      <div className="p-8 pt-4 flex flex-col flex-1">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{new Date(post.date).toLocaleDateString()}</span>
          <span className="mx-2">&middot;</span>
          <Clock className="w-4 h-4 mr-1" />
          <span>{post.readTime}</span>
        </div>

        {showCategoryPill && (
          <Link
            href={`/blog/category/${encodeURIComponent(post.category.toLowerCase().replace(/\s+/g, '-'))}`}
            className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full hover:bg-orange-200 transition-colors w-fit mb-3"
          >
            {post.category}
          </Link>
        )}

        <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
          <BlogPostLink href={`/blog/${post.slug}`}>
            {post.title}
          </BlogPostLink>
        </h2>

        {showExcerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        <BlogPostLink
          href={`/blog/${post.slug}`}
          className="text-orange-500 hover:text-orange-600 font-medium inline-flex items-center mt-auto"
        >
          Read More
          <ArrowRight className="w-4 h-4 ml-1" />
        </BlogPostLink>
      </div>
    </article>
  )
}
