import Link from 'next/link'
import { Calendar, Clock, Tag } from 'lucide-react'
import blogData from '../../data/blog.json'

interface BlogSectionProps {
  showFeatured?: boolean
  showCategories?: boolean
  maxPosts?: number
  className?: string
}

export default function BlogSection({
  showFeatured = true,
  showCategories = true,
  maxPosts = 6,
  className = ""
}: BlogSectionProps) {
  // Sort blog posts by date descending (newest first)
  const sortedBlog = [...blogData].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const categories = Array.from(new Set(sortedBlog.map(post => post.category)))
  
  return (
    <div className={`py-20 ${className}`}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Moving Tips & Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert advice and practical tips to make your move smooth and affordable
          </p>
        </div>
        
        {/* Categories Filter */}
        {showCategories && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              All Posts
            </button>
            {categories.map((category) => (
              <button key={category} className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                {category}
              </button>
            ))}
          </div>
        )}
        
        {/* Featured Post */}
        {showFeatured && sortedBlog.length > 0 && (
          <div className="mb-16">
            <article className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl overflow-hidden text-white">
              <div className="p-8 md:p-12">
                <div className="flex items-center text-orange-100 mb-4">
                  <Tag className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{sortedBlog[0].category}</span>
                  <span className="mx-3">•</span>
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">{new Date(sortedBlog[0].date).toLocaleDateString()}</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <Link href={`/blog/${sortedBlog[0].slug}`} className="hover:text-orange-100 transition-colors">
                    {sortedBlog[0].title}
                  </Link>
                </h2>

                <p className="text-xl text-orange-100 mb-6 leading-relaxed">
                  {sortedBlog[0].excerpt}
                </p>

                <Link
                  href={`/blog/${sortedBlog[0].slug}`}
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
        
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedBlog.slice(showFeatured ? 1 : 0, maxPosts + (showFeatured ? 0 : 1)).map((post) => (
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
                  <span className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                    {post.category}
                  </span>
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
      </div>
    </div>
  )
}
