import { notFound, redirect } from 'next/navigation'
import BlogListPage from '../../BlogListPage'
import blogData from '../../../../data/posts.json'

const POSTS_PER_PAGE = 12

// Generate static params for all pages
export async function generateStaticParams() {
  const sortedBlog = [...blogData].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  // Exclude featured post from pagination count
  const postsForPagination = sortedBlog.slice(1)
  const totalPages = Math.ceil(postsForPagination.length / POSTS_PER_PAGE)

  // Generate pages 2 through totalPages (page 1 is handled by /blog)
  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    page: String(i + 2),
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const pageNum = parseInt(page, 10)

  return {
    title: `Blog - Page ${pageNum} | Rapid Panda Movers`,
    description: `Moving tips, guides, and insights - Page ${pageNum}. Expert advice for your Miami move.`,
  }
}

export default async function BlogPaginatedPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const pageNum = parseInt(page, 10)

  // Redirect page 1 to /blog
  if (pageNum === 1) {
    redirect('/blog')
  }

  // Validate page number
  const sortedBlog = [...blogData].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const postsForPagination = sortedBlog.slice(1)
  const totalPages = Math.ceil(postsForPagination.length / POSTS_PER_PAGE)

  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
    notFound()
  }

  return <BlogListPage currentPage={pageNum} />
}
