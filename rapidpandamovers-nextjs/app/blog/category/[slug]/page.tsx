import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogListPage from '../../BlogListPage'
import { getCategoryBySlug, getCategories, categoryToSlug, isEditorialCategory } from '../../../../lib/blog'

export async function generateStaticParams() {
  const categories = getCategories()
  return categories
    .filter(cat => isEditorialCategory(cat))
    .map((cat) => ({
      slug: categoryToSlug(cat),
    }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) {
    return { title: 'Category Not Found' }
  }
  return {
    title: `${category} | Rapid Panda Movers Blog`,
    description: `Moving tips and guides in ${category}. Expert advice for your Miami move.`,
  }
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category || !isEditorialCategory(category)) {
    notFound()
  }
  return <BlogListPage currentPage={1} category={category} />
}
