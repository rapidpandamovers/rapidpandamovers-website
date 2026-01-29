import React from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import blogData from '../../../data/blog.json'

export async function generateStaticParams() {
  return blogData.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogData.find((p) => p.slug === slug)

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
  const post = blogData.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  // Parse and render formatted content
  const renderContent = () => {
    const lines = post.content.split('\n')
    const elements: React.ReactElement[] = []
    let listItems: string[] = []
    let currentKey = 0

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={currentKey++} className="mb-6 pl-6 space-y-2">
            {listItems.map((item, i) => (
              <li key={i} className="list-disc text-gray-700 leading-relaxed">
                {item.split('**').map((text, j) =>
                  j % 2 === 0 ? text : <strong key={j} className="font-semibold text-gray-800">{text}</strong>
                )}
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

      // Headers
      if (line.startsWith('## ')) {
        flushList()
        elements.push(
          <h2 key={currentKey++} className="text-2xl font-bold text-gray-800 mt-8 mb-4">
            {line.replace('## ', '')}
          </h2>
        )
      }
      else if (line.startsWith('### ')) {
        flushList()
        elements.push(
          <h3 key={currentKey++} className="text-xl font-bold text-gray-800 mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        )
      }
      // List items
      else if (line.match(/^[-*]\s+/)) {
        listItems.push(line.replace(/^[-*]\s+/, ''))
      }
      // Regular paragraphs
      else {
        flushList()
        elements.push(
          <p key={currentKey++} className="mb-4 text-gray-700 leading-relaxed">
            {line.split('**').map((text, j) =>
              j % 2 === 0 ? text : <strong key={j} className="font-semibold text-gray-800">{text}</strong>
            )}
          </p>
        )
      }
    }

    flushList()
    return elements
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center text-orange-500 hover:text-orange-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <article>
          <header className="mb-12">
            <div className="mb-4">
              <span className="inline-block bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              {post.title}
            </h1>

            <div className="flex items-center text-gray-600 mb-6">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
              <span className="mx-3">•</span>
              <Clock className="w-4 h-4 mr-2" />
              <span>{post.readTime}</span>
            </div>

            <p className="text-xl text-gray-600 leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          <div className="prose prose-lg max-w-none">
            {renderContent()}
          </div>

          <div className="bg-orange-50 rounded-lg p-8 mt-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to get started?</h3>
            <p className="text-gray-600 mb-6">
              Let Rapid Panda Movers handle your move with professionalism and care. Get your free quote today!
            </p>
            <Link
              href="/quote"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
            >
              Get Your Free Quote
            </Link>
          </div>
        </article>

        {/* Related Posts */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogData
              .filter((p) => p.slug !== post.slug && p.category === post.category)
              .slice(0, 2)
              .map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="text-sm text-orange-600 font-medium mb-2">
                    {relatedPost.category}
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {relatedPost.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {relatedPost.excerpt.substring(0, 100)}...
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
