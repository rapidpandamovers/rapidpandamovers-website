import { notFound, redirect } from 'next/navigation'
import BlogListPage from '../../../../BlogListPage'
import { getLocationSlugs, getLocationNameBySlug, getPostsByLocation } from '../../../../../../lib/blog'

const POSTS_PER_PAGE = 12

export async function generateStaticParams() {
  const slugs = getLocationSlugs()
  const params: { slug: string; page: string }[] = []
  for (const slug of slugs) {
    const posts = getPostsByLocation(slug)
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    for (let p = 2; p <= totalPages; p++) {
      params.push({ slug, page: String(p) })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; page: string }>
}): Promise<{ title: string; description?: string }> {
  const { slug, page } = await params
  const name = getLocationNameBySlug(slug)
  if (!name) {
    return { title: 'Location Not Found' }
  }
  const pageNum = parseInt(page, 10)
  return {
    title: `Moving Tips for ${name} - Page ${pageNum} | Rapid Panda Movers Blog`,
    description: `Moving tips for ${name} - Page ${pageNum}. Expert advice for your move.`,
  }
}

export default async function BlogLocationPaginatedPage({
  params,
}: {
  params: Promise<{ slug: string; page: string }>
}) {
  const { slug, page } = await params
  const name = getLocationNameBySlug(slug)
  if (!name) {
    notFound()
  }
  const pageNum = parseInt(page, 10)
  if (pageNum === 1) {
    redirect(`/blog/location/${encodeURIComponent(slug)}`)
  }
  const posts = getPostsByLocation(slug)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
    notFound()
  }
  return <BlogListPage currentPage={pageNum} locationSlug={slug} locationName={name} />
}
