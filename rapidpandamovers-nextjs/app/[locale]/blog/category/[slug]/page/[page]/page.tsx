import { notFound, redirect } from 'next/navigation'
import BlogListPage from '../../../../BlogListPage'
import { getCategoryBySlug, getPostsByCategory, getCategories, categoryToSlug, isEditorialCategory } from '@/lib/blog'
import { locales } from '@/i18n/config'
import { getLocale } from 'next-intl/server'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

const POSTS_PER_PAGE = 12

export async function generateStaticParams() {
  const categories = getCategories()
  const params: { slug: string; page: string }[] = []
  for (const cat of categories) {
    if (!isEditorialCategory(cat)) continue
    const slug = categoryToSlug(cat)
    const posts = getPostsByCategory(cat)
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    for (let p = 2; p <= totalPages; p++) {
      params.push({ slug, page: String(p) })
    }
  }
  return locales.flatMap(locale => params.map(p => ({ locale, ...p })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; page: string }>
}): Promise<Metadata> {
  const { slug, page } = await params
  const category = getCategoryBySlug(slug)
  if (!category) {
    return { title: 'Category Not Found' }
  }
  const pageNum = parseInt(page, 10)
  const locale = await getLocale() as Locale
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
  const category = getCategoryBySlug(slug)
  if (!category || !isEditorialCategory(category)) {
    notFound()
  }
  const locale = await getLocale() as Locale
  const pageNum = parseInt(page, 10)
  if (pageNum === 1) {
    redirect(`/blog/${getTranslatedSlug('category', locale)}/${encodeURIComponent(slug)}`)
  }
  const posts = getPostsByCategory(category)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
    notFound()
  }
  return <BlogListPage currentPage={pageNum} category={category} />
}
