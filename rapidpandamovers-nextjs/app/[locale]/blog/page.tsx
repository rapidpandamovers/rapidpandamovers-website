import BlogListPage from './BlogListPage'
import { getMessages, getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'
import type { Locale } from '@/i18n/config'

export async function generateMetadata() {
  const locale = await getLocale() as Locale
  const { meta } = (await getMessages()) as any
  return generatePageMetadata({
    title: meta.blog.title,
    description: meta.blog.description,
    path: meta.blog.path,
    locale,
  })
}

export default function BlogPage() {
  return <BlogListPage currentPage={1} />
}
