import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale
  }

  // Load messages from data/ files based on locale
  // English: data/ui.json, data/navigation.json, data/metadata.json
  // Spanish: data/es/ui.json, data/es/navigation.json, data/es/metadata.json
  const prefix = locale === 'en' ? '' : `${locale}/`

  const [ui, nav, meta, content] = await Promise.all([
    import(`@/data/${prefix}ui.json`).then(m => m.default),
    import(`@/data/${prefix}navigation.json`).then(m => m.default),
    import(`@/data/${prefix}metadata.json`).then(m => m.default),
    import(`@/data/${prefix}content.json`).then(m => m.default),
  ])

  return {
    locale,
    messages: { ui, nav, meta, content },
  }
})
