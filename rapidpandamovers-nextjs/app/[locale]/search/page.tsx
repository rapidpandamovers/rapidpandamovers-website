import SearchSection from '@/app/components/SearchSection'
import BlogSection from '@/app/components/BlogSection'
import { getMessages, getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'
import type { Locale } from '@/i18n/config'
import { getPostsSortedByDate } from '@/lib/blog'
import { H1 } from '@/app/components/Heading'

export async function generateMetadata() {
  const locale = await getLocale() as Locale
  const { meta } = (await getMessages()) as any
  return generatePageMetadata({
    title: meta.search.title,
    description: meta.search.description,
    path: meta.search.path,
    locale,
  })
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const { ui } = (await getMessages()) as any
  const posts = getPostsSortedByDate()

  return (
    <div className="min-h-screen">
      <section className="pt-20">
        <div className="container mx-auto px-4 text-center">
          <H1 className="text-3xl md:text-4xl font-bold text-orange-700 mb-4">
            {ui.search.findTitle}
          </H1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            {ui.search.findSubtitle}
          </p>
        </div>
      </section>

      <SearchSection
        showBackground={false}
        posts={posts}
        initialQuery={q}
      />

      <BlogSection
        showCategories={false}
        showViewMore
        viewMoreLink="/blog"
        maxPosts={3}
      />
    </div>
  )
}
