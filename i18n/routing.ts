import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'
import { locales, defaultLocale } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
})

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)

/**
 * Static page slug translations (used by middleware and slug-map).
 * These are NOT typed pathnames — just a lookup table for translating
 * known static page slugs between locales.
 */
export const staticPathTranslations: Record<string, Record<string, string>> = {
  es: {
    'about-us': 'sobre-nosotros',
    'contact-us': 'contacto',
    'quote': 'cotizacion',
    'claims': 'reclamaciones',
    'reservations': 'reservaciones',
    'services': 'servicios',
    'locations': 'ubicaciones',
    'reviews': 'resenas',
    'faq': 'preguntas-frecuentes',
    'moving-rates': 'tarifas-de-mudanza',
    'moving-routes': 'rutas-de-mudanza',
    'moving-tips': 'consejos-de-mudanza',
    'moving-checklist': 'lista-de-mudanza',
    'moving-glossary': 'glosario-de-mudanza',
    'why-choose-us': 'por-que-elegirnos',
    'compare': 'comparar',
    'alternatives': 'alternativas',
    'privacy': 'privacidad',
    'terms': 'terminos',
    'sitemap': 'mapa-del-sitio',
    'page': 'pagina',
    'location': 'ubicacion',
    'service': 'servicio',
    'category': 'categoria',
  },
}
