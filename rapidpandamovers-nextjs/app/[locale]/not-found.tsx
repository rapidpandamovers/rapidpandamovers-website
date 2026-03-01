import { Link } from '@/i18n/routing'
import dynamic from 'next/dynamic'
import { getPostsSortedByDate } from '@/lib/blog'
import { getMessages } from 'next-intl/server'
import { H1, H2 } from '@/app/components/Heading'

const SearchSection = dynamic(() => import('@/app/components/SearchSection'))
const BlogSection = dynamic(() => import('@/app/components/BlogSection'))

export default async function NotFound() {
  const { ui } = (await getMessages()) as any
  const t = ui.notFound
  const posts = getPostsSortedByDate()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20">
        <div className="container mx-auto px-4 text-center">
          <H1 className="text-6xl md:text-8xl font-bold text-orange-500 mb-4">404</H1>
          <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t.title}
          </H2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            {t.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors text-shadow-sm"
            >
              {t.goHome}
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center px-6 py-3 border border-orange-600 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
            >
              {t.contactUs}
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <SearchSection
        placeholder={t.searchPlaceholder}
        posts={posts}
      />

      {/* Blog Section */}
      <BlogSection
        showCategories={false}
        maxPosts={3}
        showViewMore={true}
        viewMorePosition="bottom"
        viewMoreButtonText={t.viewAllArticles}
      />
    </div>
  )
}
