import { notFound, redirect } from 'next/navigation'
import BlogListPage from '../../BlogListPage'
import { getPostsSortedByDate } from '@/lib/blog'
import { locales } from '@/i18n/config'
import { generatePageMetadata } from '@/lib/metadata'
import { getLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/config'

const POSTS_PER_PAGE = 12

// Generate static params for all pages
export async function generateStaticParams() {
  const sortedBlog = getPostsSortedByDate()
  // Exclude featured post from pagination count
  const postsForPagination = sortedBlog.slice(1)
  const totalPages = Math.ceil(postsForPagination.length / POSTS_PER_PAGE)

  // Generate pages 2 through totalPages (page 1 is handled by /blog)
  const pages = Array.from({ length: totalPages - 1 }, (_, i) => ({
    page: String(i + 2),
  }))
  return locales.flatMap(locale => pages.map(p => ({ locale, ...p })))
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const pageNum = parseInt(page, 10)
  const locale = await getLocale() as Locale

  return generatePageMetadata({
    title: `Blog - Page ${pageNum} | Rapid Panda Movers`,
    description: `Moving tips, guides, and insights - Page ${pageNum}. Expert advice for your Miami move.`,
    path: `/blog/page/${pageNum}`,
    locale,
    noIndex: true,
  })
}

export default async function BlogPaginatedPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const pageNum = parseInt(page, 10)

  // Redirect page 1 to /blog
  if (pageNum === 1) {
    redirect('/blog')
  }

  // Validate page number
  const sortedBlog = getPostsSortedByDate()
  const postsForPagination = sortedBlog.slice(1)
  const totalPages = Math.ceil(postsForPagination.length / POSTS_PER_PAGE)

  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
    notFound()
  }

  return <BlogListPage currentPage={pageNum} />
}
