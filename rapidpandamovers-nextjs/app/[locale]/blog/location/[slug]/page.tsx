import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogListPage from '../../BlogListPage'
import { getLocationSlugs, getLocationNameBySlug, getPostsByLocation } from '@/lib/blog'
import { locales, type Locale } from '@/i18n/config'
import { getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'

export async function generateStaticParams() {
  const slugs = getLocationSlugs()
  return locales.flatMap(locale =>
    slugs.map((slug) => ({ locale, slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale: localeParam } = await params
  const locale = localeParam as Locale
  const name = getLocationNameBySlug(slug)
  if (!name) {
    return { title: 'Location Not Found' }
  }
  return generatePageMetadata({
    title: `Moving Tips for ${name} | Rapid Panda Movers Blog`,
    description: `Moving tips, guides, and local insights for ${name}. Expert advice for your move.`,
    path: `/blog/location/${slug}`,
    locale,
  })
}

export default async function BlogLocationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const name = getLocationNameBySlug(slug)
  const locale = await getLocale() as Locale
  const posts = getPostsByLocation(slug, locale)
  if (!name || posts.length === 0) {
    notFound()
  }
  return <BlogListPage currentPage={1} locationSlug={slug} locationName={name} />
}
