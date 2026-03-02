import { notFound, redirect } from 'next/navigation'
import BlogListPage from '../../../../BlogListPage'
import { getServiceSlugsFromBlog, getPostsByService } from '@/lib/blog'
import { getServiceBySlug } from '@/lib/data'
import { locales } from '@/i18n/config'
import { getLocale } from 'next-intl/server'
import { getCanonicalSlug, getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

const POSTS_PER_PAGE = 12

export async function generateStaticParams() {
  const slugs = getServiceSlugsFromBlog()
  return locales.flatMap(locale => {
    const params: { locale: string; slug: string; page: string }[] = []
    for (const enSlug of slugs) {
      const posts = getPostsByService(enSlug, locale)
      const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
      const translatedSlug = getTranslatedSlug(enSlug, locale as Locale)
      for (let p = 2; p <= totalPages; p++) {
        params.push({ locale, slug: translatedSlug, page: String(p) })
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
  const canonicalSlug = getCanonicalSlug(slug, locale)
  const service = getServiceBySlug(canonicalSlug)
  if (!service) {
    return { title: 'Service Not Found' }
  }
  const pageNum = parseInt(page, 10)
  return generatePageMetadata({
    title: `${service.name} Tips & Guides - Page ${pageNum} | Rapid Panda Movers Blog`,
    description: `${service.name} tips and guides - Page ${pageNum}. Expert advice for your move.`,
    path: `/blog/service/${slug}/page/${pageNum}`,
    locale,
    noIndex: true,
  })
}

export default async function BlogServicePaginatedPage({
  params,
}: {
  params: Promise<{ slug: string; page: string }>
}) {
  const locale = await getLocale() as Locale
  const { slug, page } = await params
  const canonicalSlug = getCanonicalSlug(slug, locale)
  const service = getServiceBySlug(canonicalSlug)
  if (!service) {
    notFound()
  }
  const pageNum = parseInt(page, 10)
  if (pageNum === 1) {
    redirect(`/blog/${getTranslatedSlug('service', locale)}/${encodeURIComponent(slug)}`)
  }
  const posts = getPostsByService(canonicalSlug, locale)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
    notFound()
  }
  return <BlogListPage currentPage={pageNum} serviceSlug={canonicalSlug} serviceName={service.name} />
}
