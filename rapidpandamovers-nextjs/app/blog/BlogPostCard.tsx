'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ImageOff } from 'lucide-react'
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
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const [imageError, setImageError] = useState(false)
  const hasValidImage = post.featured && typeof post.featured === 'string' && post.featured.startsWith('/')

  return (
    <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
      {hasValidImage && !imageError ? (
        <BlogPostLink href={`/blog/${post.slug}`}>
          <div className="relative h-48 overflow-hidden">
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
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
            <ImageOff className="w-12 h-12 text-orange-300" />
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
  )
}
