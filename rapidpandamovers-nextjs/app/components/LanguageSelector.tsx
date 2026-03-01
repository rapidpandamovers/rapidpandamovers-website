'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { translatePathname } from '@/i18n/slug-map'
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
    </svg>
  )
}

const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
}

const localeCodes: Record<string, string> = {
  en: 'EN',
  es: 'ES',
}

export function LanguageSelectorHeader() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  async function onChange(nextLocale: string) {
    const translatedPath = await translatePathname(pathname, locale as Locale, nextLocale as Locale)
    router.replace(translatedPath, { locale: nextLocale })
  }

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors uppercase">
        <GlobeIcon className="w-4 h-4" />
        <span className="text-sm font-bold">{localeCodes[locale]}</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className="absolute right-0 mt-2 w-44 bg-orange-600 rounded-4xl overflow-hidden border-2 border-orange-600 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="bg-white rounded-b-4xl py-2">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => onChange(loc)}
              className={`block w-full text-left pl-6 pr-6 py-2 text-sm hover:text-orange-600 hover:translate-x-1 transition-all duration-200 ${
                loc === locale ? 'text-orange-600 font-semibold' : 'text-gray-700'
              }`}
            >
              {languageNames[loc]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function LanguageSelectorFooter() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  async function onChange(nextLocale: string) {
    const translatedPath = await translatePathname(pathname, locale as Locale, nextLocale as Locale)
    router.replace(translatedPath, { locale: nextLocale })
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      {locales.map((loc, index) => (
        <span key={loc}>
          {index > 0 && <span className="text-gray-500 mr-2">|</span>}
          <button
            onClick={() => onChange(loc)}
            className={`hover:text-orange-400 transition-colors ${
              loc === locale ? 'text-white font-semibold' : 'text-gray-400'
            }`}
          >
            {languageNames[loc]}
          </button>
        </span>
      ))}
    </div>
  )
}
