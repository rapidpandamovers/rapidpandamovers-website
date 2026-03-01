import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogListPage from '../../BlogListPage'
import { getServiceSlugsFromBlog, getPostsByService } from '@/lib/blog'
import { getServiceBySlug } from '@/lib/data'
import { locales, type Locale } from '@/i18n/config'
import { getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'
import { getCanonicalSlug, getTranslatedSlug } from '@/i18n/slug-map'

export async function generateStaticParams() {
  const slugs = getServiceSlugsFromBlog()
  return locales.flatMap(locale =>
    slugs.map((slug) => ({ locale, slug: getTranslatedSlug(slug, locale as Locale) }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale: localeParam } = await params
  const locale = localeParam as Locale
  const canonicalSlug = getCanonicalSlug(slug, locale)
  const service = getServiceBySlug(canonicalSlug)
  if (!service) {
    return { title: 'Service Not Found' }
  }
  return generatePageMetadata({
    title: `${service.name} Tips & Guides | Rapid Panda Movers Blog`,
    description: `Tips, guides, and expert advice about ${service.name.toLowerCase()}. Helpful resources for your move.`,
    path: `/blog/service/${slug}`,
    locale,
  })
}

export default async function BlogServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const locale = await getLocale() as Locale
  const canonicalSlug = getCanonicalSlug(slug, locale)
  const service = getServiceBySlug(canonicalSlug)
  const posts = getPostsByService(canonicalSlug, locale)
  if (!service || posts.length === 0) {
    notFound()
  }
  return <BlogListPage currentPage={1} serviceSlug={canonicalSlug} serviceName={service.name} />
}
