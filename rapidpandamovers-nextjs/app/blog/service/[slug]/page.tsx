import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogListPage from '../../BlogListPage'
import { getServiceSlugsFromBlog, getPostsByService } from '../../../../lib/blog'
import { getServiceBySlug } from '../../../../lib/data'

export async function generateStaticParams() {
  const slugs = getServiceSlugsFromBlog()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) {
    return { title: 'Service Not Found' }
  }
  return {
    title: `${service.name} Tips & Guides | Rapid Panda Movers Blog`,
    description: `Tips, guides, and expert advice about ${service.name.toLowerCase()}. Helpful resources for your move.`,
  }
}

export default async function BlogServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  const posts = getPostsByService(slug)
  if (!service || posts.length === 0) {
    notFound()
  }
  return <BlogListPage currentPage={1} serviceSlug={slug} serviceName={service.name} />
}
