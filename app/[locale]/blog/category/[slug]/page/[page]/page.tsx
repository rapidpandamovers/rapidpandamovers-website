import { notFound } from 'next/navigation'
import BlogListPage from '../../../../BlogListPage'
import { getCategoryBySlug, getPostsByCategory, getCategories, categoryToSlug, isEditorialCategory } from '@/lib/blog'
import { locales } from '@/i18n/config'
import { getLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/config'
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

const POSTS_PER_PAGE = 12

export const dynamicParams = false;

export async function generateStaticParams() {
  return locales.flatMap(locale => {
    const categories = getCategories(locale)
    const params: { locale: string; slug: string; page: string }[] = []
    for (const cat of categories) {
      if (!isEditorialCategory(cat)) continue
      const slug = categoryToSlug(cat)
      const posts = getPostsByCategory(cat, locale)
      const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
      for (let p = 2; p <= totalPages; p++) {
        params.push({ locale, slug, page: String(p) })
      }
    }
    return params
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; page: string; locale: string }>
}): Promise<Metadata> {
  const { slug, page, locale: localeParam } = await params
  const locale = localeParam as Locale
  const category = getCategoryBySlug(slug, locale)
  if (!category) {
    return { title: 'Category Not Found' }
  }
  const pageNum = parseInt(page, 10)
  return generatePageMetadata({
    title: `${category} - Page ${pageNum} | Rapid Panda Movers Blog`,
    description: `${category} - Page ${pageNum}. Moving tips and guides. Expert advice for your Miami move.`,
    path: `/blog/category/${slug}/page/${pageNum}`,
    locale,
    noIndex: true,
  })
}

export default async function BlogCategoryPaginatedPage({
  params,
}: {
  params: Promise<{ slug: string; page: string }>
}) {
  const { slug, page } = await params
  const locale = await getLocale() as Locale
  const category = getCategoryBySlug(slug, locale)
  if (!category || !isEditorialCategory(category)) {
    notFound()
  }
  const pageNum = parseInt(page, 10)
  const posts = getPostsByCategory(category, locale)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
    notFound()
  }
  return <BlogListPage currentPage={pageNum} category={category} />
}
