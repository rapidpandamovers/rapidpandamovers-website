import { getMessages, getLocale } from 'next-intl/server'
import { generatePageMetadata } from '@/lib/metadata'
import type { Locale } from '@/i18n/config'

export async function generateMetadata() {
  const locale = await getLocale() as Locale
  const { meta } = (await getMessages()) as any
  return generatePageMetadata({
    title: meta.quote.title,
    description: meta.quote.description,
    path: meta.quote.path,
    locale,
  })
}

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return children
}
