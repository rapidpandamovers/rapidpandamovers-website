import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogListPage from '../../BlogListPage'
import { getLocationSlugs, getLocationNameBySlug, getPostsByLocation } from '../../../../lib/blog'

export async function generateStaticParams() {
  const slugs = getLocationSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const name = getLocationNameBySlug(slug)
  if (!name) {
    return { title: 'Location Not Found' }
  }
  return {
    title: `Moving Tips for ${name} | Rapid Panda Movers Blog`,
    description: `Moving tips, guides, and local insights for ${name}. Expert advice for your move.`,
  }
}

export default async function BlogLocationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const name = getLocationNameBySlug(slug)
  const posts = getPostsByLocation(slug)
  if (!name || posts.length === 0) {
    notFound()
  }
  return <BlogListPage currentPage={1} locationSlug={slug} locationName={name} />
}
