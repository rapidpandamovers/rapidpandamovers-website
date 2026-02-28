'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Calendar, Tag, ImageOff } from 'lucide-react'
import BlogPostLink from './BlogPostLink'
import { useMessages } from 'next-intl'
import { H2 } from '@/app/components/Heading'

interface FeaturedPostCardProps {
  post: {
    slug: string
    title: string
    excerpt: string
    date: string
    category: string
    featured?: string | null
  }
}

export default function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  const { ui } = useMessages() as any
  const [imageError, setImageError] = useState(false)
  const hasValidImage = post.featured && typeof post.featured === 'string' && post.featured.startsWith('/')

  return (
    <article className="bg-orange-600 rounded-4xl overflow-hidden text-white group text-shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
      {/* Image - left */}
      <div className="p-6 pb-0 md:p-8 md:pb-0 lg:pb-8 lg:pr-0">
        <div className="relative min-h-[240px] lg:min-h-full overflow-hidden rounded-2xl">
          {hasValidImage && !imageError ? (
            <BlogPostLink href={`/blog/${post.slug}`}>
              <Image
                src={post.featured!}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            </BlogPostLink>
          ) : (
            <div className="absolute inset-0 bg-orange-700 flex items-center justify-center">
              <ImageOff className="w-16 h-16 text-orange-300" />
            </div>
          )}
        </div>
      </div>

      {/* Content - right */}
      <div className="lg:col-span-2 flex flex-col justify-center p-6 md:p-8 lg:py-8 lg:pr-8 lg:pl-0">
        <div className="flex items-center text-white/80 mb-4">
          <Tag className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">{ui?.blogCategories?.[post.category] || post.category}</span>
          <span className="mx-3">&bull;</span>
          <Calendar className="w-4 h-4 mr-1" />
          <span className="text-sm">{new Date(post.date + 'T00:00:00').toLocaleDateString()}</span>
        </div>

        <H2 className="text-3xl md:text-4xl font-bold mb-4">
          <BlogPostLink href={`/blog/${post.slug}`} className="hover:text-white/80 transition-colors">
            {post.title}
          </BlogPostLink>
        </H2>

        <p className="text-xl text-white/80 mb-6 leading-relaxed">
          {post.excerpt}
        </p>

        <BlogPostLink
          href={`/blog/${post.slug}`}
          className="inline-flex items-center bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors w-fit text-shadow-none"
        >
          {ui?.blog?.readFullArticle || 'Read Full Article'}
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </BlogPostLink>
      </div>
      </div>
    </article>
  )
}
