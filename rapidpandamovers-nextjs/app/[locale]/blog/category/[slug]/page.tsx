import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogListPage from '../../BlogListPage'
import { getCategoryBySlug, getCategories, categoryToSlug, isEditorialCategory } from '@/lib/blog'
import { locales, type Locale } from '@/i18n/config'
import { getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'

export async function generateStaticParams() {
  return locales.flatMap(locale => {
    const categories = getCategories(locale)
    return categories
      .filter(cat => isEditorialCategory(cat))
      .map(cat => ({
        locale,
        slug: categoryToSlug(cat),
      }))
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale() as Locale
  const category = getCategoryBySlug(slug, locale)
  if (!category) {
    return { title: 'Category Not Found' }
  }
  return generatePageMetadata({
    title: `${category} | Rapid Panda Movers Blog`,
    description: `Moving tips and guides in ${category}. Expert advice for your Miami move.`,
    path: `/blog/category/${slug}`,
    locale,
  })
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const locale = await getLocale() as Locale
  const category = getCategoryBySlug(slug, locale)
  if (!category || !isEditorialCategory(category)) {
    notFound()
  }
  return <BlogListPage currentPage={1} category={category} />
}
