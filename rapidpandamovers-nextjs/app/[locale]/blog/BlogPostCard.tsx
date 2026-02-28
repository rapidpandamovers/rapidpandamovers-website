'use client'

import { useState } from 'react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { Calendar, Clock, ImageOff, ArrowRight } from 'lucide-react'
import BlogPostLink from './BlogPostLink'
import { useMessages, useLocale } from 'next-intl'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'
import { H2 } from '@/app/components/Heading'

const EDITORIAL_CATEGORIES = ['Fun Facts', 'Home & Living', 'Lifestyle', 'Location Guide', 'Moving Tips']

function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

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
  const { ui } = useMessages() as any
  const locale = useLocale() as Locale
  const [imageError, setImageError] = useState(false)
  const hasValidImage = post.featured && typeof post.featured === 'string' && post.featured.startsWith('/')

  return (
    <article className="bg-gray-50 rounded-4xl overflow-hidden flex flex-col group">
      <div className="p-6 pb-0 md:p-8 md:pb-0">
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
      <div className="p-6 pt-4 md:p-8 md:pt-4 flex flex-col flex-1">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{new Date(post.date + 'T00:00:00').toLocaleDateString()}</span>
          <span className="mx-2">&middot;</span>
          <Clock className="w-4 h-4 mr-1" />
          <span>{post.readTime}</span>
        </div>

        {showCategoryPill && (() => {
          const slug = categoryToSlug(post.category)
          const href = EDITORIAL_CATEGORIES.includes(post.category)
            ? `/blog/${getTranslatedSlug('category', locale)}/${encodeURIComponent(slug)}`
            : `/blog/${getTranslatedSlug('service', locale)}/${encodeURIComponent(slug)}`
          return (
            <Link
              href={href}
              className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full hover:bg-orange-200 transition-colors w-fit mb-3"
            >
              {ui?.blogCategories?.[post.category] || post.category}
            </Link>
          )
        })()}

        <H2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
          <BlogPostLink href={`/blog/${post.slug}`}>
            {post.title}
          </BlogPostLink>
        </H2>

        {showExcerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        <BlogPostLink
          href={`/blog/${post.slug}`}
          className="text-orange-600 hover:text-orange-800 font-medium inline-flex items-center mt-auto"
          aria-label={`${ui?.blog?.readFullArticle || 'Read Full Article'}: ${post.title}`}
        >
          {ui?.blog?.readFullArticle || 'Read Full Article'}
          <ArrowRight className="w-4 h-4 ml-1" />
        </BlogPostLink>
      </div>
    </article>
  )
}
