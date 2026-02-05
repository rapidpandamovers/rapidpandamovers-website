import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock } from 'lucide-react'
import QuoteSection from '../../components/QuoteSection'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, getRelatedPosts } from '../../../lib/blog'
import BackToBlogLink from './BackToBlogLink'
import BlogHeroImage from '../BlogHeroImage'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Rapid Panda Movers Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

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
                className="text-orange-500 hover:text-orange-600 underline decoration-orange-300"
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
                className="text-orange-500 hover:text-orange-600 underline decoration-orange-300"
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
                className="text-orange-500 hover:text-orange-600 underline decoration-orange-300"
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
                className="text-orange-500 hover:text-orange-600 underline decoration-orange-300"
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
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-sm font-medium flex-shrink-0 mt-0.5">
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
          <h2 key={currentKey++} className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-orange-500 rounded-full"></span>
            {parseInlineMarkdown(line.replace('## ', ''), `h2-${currentKey}`)}
          </h2>
        )
      }
      // H3 Headers
      else if (line.startsWith('### ')) {
        flushList()
        elements.push(
          <h3 key={currentKey++} className="text-xl font-bold text-gray-800 mt-8 mb-4 border-l-2 border-orange-300 pl-4">
            {parseInlineMarkdown(line.replace('### ', ''), `h3-${currentKey}`)}
          </h3>
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
            const floatClass = imageIndex % 2 === 0
              ? 'sm:float-left sm:mr-6 sm:mb-4'
              : 'sm:float-right sm:ml-6 sm:mb-4'
            const isFirstBodyImage = imageIndex === 0
            imageIndex++

            // Generate srcset paths for responsive images
            const basePath = src.replace(/\.(webp|jpg|jpeg|png)$/, '')
            const ext = src.match(/\.(webp|jpg|jpeg|png)$/)?.[1] || 'webp'

            elements.push(
              <figure key={currentKey++} className={`my-6 ${floatClass} sm:w-64 md:w-72`}>
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Magazine Style with Rounded Box */}
      <div className="container mx-auto pt-8">
        <BackToBlogLink />

        <BlogHeroImage
          featured={post.featured}
          title={post.title}
          category={post.category}
          date={post.date}
          readTime={post.readTime}
        />
      </div>

      {/* Article Content */}
      <article className="container mx-auto">
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

        <QuoteSection
          title="Ready to get started?"
          subtitle="Let Rapid Panda Movers handle your move with professionalism and care."
        />
      </article>

      {/* Related Posts */}
      <div className="py-16">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
            Related Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getRelatedPosts(slug, 2).map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                {relatedPost.featured && (
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={relatedPost.featured}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="text-sm text-orange-600 font-medium mb-2">
                    {relatedPost.category}
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                    {relatedPost.title}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
