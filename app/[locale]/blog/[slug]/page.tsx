import React from 'react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import BlogSection from '@/app/components/BlogSection'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import ArticleSchema from '@/app/components/Schema/ArticleSchema'
import { notFound } from 'next/navigation'
import { getPublishedPosts, getPostBySlug, categoryToSlug, isEditorialCategory } from '@/lib/blog'
import { generateBlogMetadata } from '@/lib/metadata'
import BlogHeroImage from '@/app/[locale]/blog/BlogHeroImage'
import { locales } from '@/i18n/config'
import { getMessages, getLocale } from 'next-intl/server'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'
import { H2, H3 } from '@/app/components/Heading'

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    return locales.flatMap(locale => {
      const posts = getPublishedPosts(locale)
      return posts.map((post) => ({
        locale,
        slug: post.slug,
      }))
    })
  } catch (error) {
    console.error('[Blog] Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  try {
    const { slug, locale: localeParam } = await params
    const locale = localeParam as Locale
    const post = getPostBySlug(slug, locale)

    if (!post) {
      return {
        title: 'Post Not Found',
      }
    }
    return generateBlogMetadata(post, locale)
  } catch (error) {
    console.error('[Blog] Error generating metadata:', error)
    return {
      title: 'Blog Post | Rapid Panda Movers',
    }
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getLocale() as Locale
  const { content } = (await getMessages()) as any
  let post: ReturnType<typeof getPostBySlug> = null
  let slug: string = ''

  try {
    const paramsResult = await params
    slug = paramsResult.slug
    post = getPostBySlug(slug, locale)
  } catch (error) {
    console.error('[BlogPostPage] Error loading post:', error)
    notFound()
  }

  if (!post) {
    notFound()
  }

  // Parse inline markdown (bold and links) into React elements
  const parseInlineMarkdown = (text: string, keyPrefix: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = []
    const regex = /(\*\*\[[^\]]+\]\([^)]+\)\*\*|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g
    let lastIndex = 0
    let match
    let elementKey = 0

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        elements.push(text.slice(lastIndex, match.index))
      }

      const matched = match[0]

      if (matched.startsWith('**[') && matched.endsWith(')**')) {
        const innerLink = matched.slice(2, -2)
        const linkMatch = innerLink.match(/\[([^\]]+)\]\(([^)]+)\)/)
        if (linkMatch) {
          const [, linkText, url] = linkMatch
          const linkContent = <strong className="font-semibold">{linkText}</strong>

          if (url.startsWith('/')) {
            elements.push(
              <Link
                key={`${keyPrefix}-bl-${elementKey++}`}
                href={url}
                className="text-orange-700 hover:text-orange-800 underline decoration-orange-300"
              >
                {linkContent}
              </Link>
            )
          } else {
            elements.push(
              <a
                key={`${keyPrefix}-ba-${elementKey++}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-700 hover:text-orange-800 underline decoration-orange-300"
              >
                {linkContent}
              </a>
            )
          }
        }
      }
      else if (matched.startsWith('[')) {
        const linkMatch = matched.match(/\[([^\]]+)\]\(([^)]+)\)/)
        if (linkMatch) {
          const [, linkText, url] = linkMatch
          const cleanLinkText = linkText.replace(/\*\*/g, '')
          const isBold = linkText.includes('**')
          const linkContent = isBold ? (
            <strong className="font-semibold">{cleanLinkText}</strong>
          ) : cleanLinkText

          if (url.startsWith('/')) {
            elements.push(
              <Link
                key={`${keyPrefix}-l-${elementKey++}`}
                href={url}
                className="text-orange-700 hover:text-orange-800 underline decoration-orange-300"
              >
                {linkContent}
              </Link>
            )
          } else {
            elements.push(
              <a
                key={`${keyPrefix}-a-${elementKey++}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-700 hover:text-orange-800 underline decoration-orange-300"
              >
                {linkContent}
              </a>
            )
          }
        }
      }
      else if (matched.startsWith('**')) {
        const boldText = matched.slice(2, -2)
        elements.push(
          <strong key={`${keyPrefix}-b-${elementKey++}`} className="font-semibold text-gray-900">
            {boldText}
          </strong>
        )
      }

      lastIndex = regex.lastIndex
    }

    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex))
    }

    return elements.length > 0 ? elements : [text]
  }

  // Track image index for alternating float
  let imageIndex = 0

  // Parse and render formatted content with magazine layout
  const renderContent = () => {
    const lines = post.content.split('\n')
    const elements: React.ReactElement[] = []
    let listItems: string[] = []
    let currentKey = 0

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={currentKey++} className="my-6 space-y-3 pl-0">
            {listItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700 leading-relaxed">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-sm font-medium flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{parseInlineMarkdown(item, `li-${i}`)}</span>
              </li>
            ))}
          </ul>
        )
        listItems = []
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (!line) continue

      // H2 Headers - Magazine style with decorative element
      if (line.startsWith('## ')) {
        flushList()
        elements.push(
          <H2 key={currentKey++} className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-orange-500 rounded-full"></span>
            <span>{parseInlineMarkdown(line.replace('## ', ''), `h2-${currentKey}`)}</span>
          </H2>
        )
      }
      // H3 Headers
      else if (line.startsWith('### ')) {
        flushList()
        elements.push(
          <H3 key={currentKey++} className="text-xl font-bold text-gray-800 mt-8 mb-4 border-l-2 border-orange-300 pl-4">
            {parseInlineMarkdown(line.replace('### ', ''), `h3-${currentKey}`)}
          </H3>
        )
      }
      // List items
      else if (line.match(/^[-*]\s+/)) {
        listItems.push(line.replace(/^[-*]\s+/, ''))
      }
      // Numbered list items
      else if (line.match(/^\d+\.\s+/)) {
        listItems.push(line.replace(/^\d+\.\s+/, ''))
      }
      // Images - Alternating float layout with responsive srcset
      else if (line.match(/^!\[([^\]]*)\]\(([^)]+)\)/)) {
        flushList()
        const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
        if (imageMatch) {
          const [, alt, src] = imageMatch
          // Skip if this is the featured image
          if (src !== post.featured) {
            const floatClass = 'sm:float-right sm:ml-6 sm:mb-4'
            const isFirstBodyImage = imageIndex === 0
            imageIndex++

            // Generate srcset paths for responsive images
            const basePath = src.replace(/\.(webp|jpg|jpeg|png)$/, '')
            const ext = src.match(/\.(webp|jpg|jpeg|png)$/)?.[1] || 'webp'

            elements.push(
              <figure key={currentKey++} className={`my-6 ${floatClass} sm:w-64 md:w-80 lg:w-96`}>
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={src}
                    alt={alt || 'Blog post image'}
                    width={300}
                    height={225}
                    className="w-full h-auto hover:scale-105 transition-transform duration-300"
                    loading={isFirstBodyImage ? 'eager' : 'lazy'}
                    sizes="(max-width: 640px) 100vw, 300px"
                  />
                </div>
              </figure>
            )
          }
        }
      }
      // Regular paragraphs
      else {
        flushList()
        elements.push(
          <p key={currentKey++} className="mb-5 text-gray-700 leading-relaxed text-[17px]">
            {parseInlineMarkdown(line, `p-${currentKey}`)}
          </p>
        )
      }
    }

    flushList()
    return elements
  }

  // Breadcrumb items
  const categorySlug = categoryToSlug(post.category)
  const categoryHref = isEditorialCategory(post.category)
    ? `/blog/${getTranslatedSlug('category', locale)}/${categorySlug}`
    : `/blog/${getTranslatedSlug('service', locale)}/${categorySlug}`
  const breadcrumbItems = [
    { label: 'Blog', href: '/blog' },
    { label: post.category, href: categoryHref },
    { label: post.title },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Schema Markup */}
      <ArticleSchema
        title={post.title}
        description={post.excerpt}
        url={`/blog/${post.slug}`}
        image={post.featured || undefined}
        datePublished={post.date}
        dateModified={post.updated}
        locale={locale}
      />

      {/* Hero Section - Magazine Style with Rounded Box */}
      <div className="container mx-auto pt-5 pb-0">
        <BlogHeroImage
          featured={post.featured}
          title={post.title}
          category={post.category}
          date={post.date}
          readTime={post.readTime}
        />
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} showBackground={true} />

      {/* Article Content */}
      <article className="container mx-auto px-6 md:px-0">
        {/* Lead/Excerpt */}
        <div className="py-8 border-b border-gray-200">
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
            {post.excerpt}
          </p>
        </div>

        {/* Main Content */}
        <div className="py-10 overflow-hidden">
          {renderContent()}
          <div className="clear-both"></div>
        </div>

      </article>

      {/* Related Posts */}
      {(() => {
        const isService = !isEditorialCategory(post.category)
        const serviceSlug = isService ? categoryToSlug(post.category) : null
        return (
          <BlogSection
            variant="left"
            title={content.blog.relatedArticles.title}
            subtitle={content.blog.relatedArticles.subtitle}
            serviceFilter={isService ? serviceSlug! : undefined}
            categoryFilter={!isService ? post.category : undefined}
            excludeSlug={post.slug}
            showFeatured={false}
            showCategories={false}
            showExcerpts={true}
            showViewMore
            viewMoreButtonText={content.blog.relatedArticles.viewMoreButtonText}
            viewMoreLink={isService ? `/blog/${getTranslatedSlug('service', locale)}/${serviceSlug}` : `/blog/${getTranslatedSlug('category', locale)}/${categoryToSlug(post.category)}`}
            maxPosts={3}
          />
        )
      })()}
    </div>
  )
}
