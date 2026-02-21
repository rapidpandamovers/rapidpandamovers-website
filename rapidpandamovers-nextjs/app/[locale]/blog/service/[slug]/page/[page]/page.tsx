import { notFound, redirect } from 'next/navigation'
import BlogListPage from '../../../../BlogListPage'
import { getServiceSlugsFromBlog, getPostsByService } from '@/lib/blog'
import { getServiceBySlug } from '@/lib/data'
import { locales } from '@/i18n/config'
import { getLocale } from 'next-intl/server'
import { getTranslatedSlug } from '@/i18n/slug-map'
import type { Locale } from '@/i18n/config'
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

const POSTS_PER_PAGE = 12

export async function generateStaticParams() {
  const slugs = getServiceSlugsFromBlog()
  const params: { slug: string; page: string }[] = []
  for (const slug of slugs) {
    const posts = getPostsByService(slug)
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
  const service = getServiceBySlug(slug)
  if (!service) {
    return { title: 'Service Not Found' }
  }
  const pageNum = parseInt(page, 10)
  const locale = await getLocale() as Locale
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
  const service = getServiceBySlug(slug)
  if (!service) {
    notFound()
  }
  const pageNum = parseInt(page, 10)
  if (pageNum === 1) {
    redirect(`/blog/${getTranslatedSlug('service', locale)}/${encodeURIComponent(slug)}`)
  }
  const posts = getPostsByService(slug)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
    notFound()
  }
  return <BlogListPage currentPage={pageNum} serviceSlug={slug} serviceName={service.name} />
}
