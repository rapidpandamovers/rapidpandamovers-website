import { Metadata } from 'next'
import BlogListPage from './BlogListPage'
import content from '@/data/content.json'

export const metadata: Metadata = {
  title: content.blog.meta.title,
  description: content.blog.meta.description,
}

export default function BlogPage() {
  return <BlogListPage currentPage={1} />
}
