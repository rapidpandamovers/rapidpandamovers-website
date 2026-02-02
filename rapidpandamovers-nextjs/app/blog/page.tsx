import { Metadata } from 'next'
import BlogListPage from './BlogListPage'

export const metadata: Metadata = {
  title: 'Blog | Rapid Panda Movers',
  description: 'Moving tips, guides, and insights from Miami\'s trusted moving company. Expert advice for your next move.',
}

export default function BlogPage() {
  return <BlogListPage currentPage={1} />
}
