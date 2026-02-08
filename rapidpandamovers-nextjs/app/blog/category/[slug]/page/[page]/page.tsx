import { notFound, redirect } from 'next/navigation'
import BlogListPage from '../../../../BlogListPage'
import { getCategoryBySlug, getPostsByCategory, getCategories, categoryToSlug } from '../../../../../../lib/blog'

const POSTS_PER_PAGE = 12

export async function generateStaticParams() {
  const categories = getCategories()
  const params: { slug: string; page: string }[] = []
  for (const cat of categories) {
    const slug = categoryToSlug(cat)
    const posts = getPostsByCategory(cat)
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
}): Promise<{ title: string; description: string }> {
  const { slug, page } = await params
  const category = getCategoryBySlug(slug)
  if (!category) {
    return { title: 'Category Not Found' }
  }
  const pageNum = parseInt(page, 10)
  return {
    title: `${category} - Page ${pageNum} | Rapid Panda Movers Blog`,
    description: `${category} - Page ${pageNum}. Moving tips and guides. Expert advice for your Miami move.`,
  }
}

export default async function BlogCategoryPaginatedPage({
  params,
}: {
  params: Promise<{ slug: string; page: string }>
}) {
  const { slug, page } = await params
  const category = getCategoryBySlug(slug)
  if (!category) {
    notFound()
  }
  const pageNum = parseInt(page, 10)
  if (pageNum === 1) {
    redirect(`/blog/category/${encodeURIComponent(slug)}`)
  }
  const posts = getPostsByCategory(category)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
    notFound()
  }
  return <BlogListPage currentPage={pageNum} category={category} />
}
