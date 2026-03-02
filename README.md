# Rapid Panda Movers - Next.js Website

A modern, bilingual (English/Spanish) website for Rapid Panda Movers, a Miami-based moving company. Built with Next.js 15.5, TypeScript, and Tailwind CSS 4.1. Migrated from WordPress/Avada and deployed on Cloudflare Pages.

## Features

- **Modern Tech Stack**: Next.js 15.5, TypeScript (strict), Tailwind CSS 4.1, React 19.1
- **Bilingual (i18n)**: Full English and Spanish support via next-intl v4 with localized content, routes, and slugs
- **30 Service Pages**: Comprehensive moving service coverage with structured data, FAQs, and location variants
- **SEO & Structured Data**: JSON-LD schemas for services, FAQs, reviews, routes, articles, breadcrumbs, and site navigation
- **Dynamic Routes**: Location pages, moving route pages, blog posts, competitor comparisons, and service comparisons
- **Review Aggregation**: Customer reviews from Google, Yelp, Trustpilot, BBB, and more with platform/location/service filtering
- **Contact & Quote Forms**: Email notifications via SMTP with Turnstile spam protection and rate limiting
- **Responsive Design**: Mobile-first with optimized images and Core Web Vitals performance
- **Blog System**: Markdown-based blog with English and Spanish posts, categories, and service/location tagging

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15.5 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4.2 (`@theme` syntax) |
| i18n | next-intl v4 (en, es) |
| Icons | Lucide React |
| UI | React 19.1 |
| Deployment | Cloudflare Pages |
| Spam Protection | Cloudflare Turnstile |

## Project Structure

```
rapidpandamovers-website/
├── app/
│   ├── [locale]/              # Localized pages (en, es)
│   │   ├── layout.tsx         # Main layout with Header/Footer
│   │   ├── page.tsx           # Homepage
│   │   ├── [slug]/            # Dynamic service/location pages
│   │   ├── about-us/
│   │   ├── alternatives/[slug]/
│   │   ├── blog/              # Blog listing + [slug] posts
│   │   ├── compare/[slug]/
│   │   ├── contact-us/
│   │   ├── faq/
│   │   ├── locations/[slug]/
│   │   ├── moving-checklist/
│   │   ├── moving-glossary/
│   │   ├── moving-rates/
│   │   ├── moving-routes/
│   │   ├── moving-tips/
│   │   ├── privacy/
│   │   ├── quote/
│   │   ├── reservations/
│   │   ├── reviews/
│   │   ├── search/
│   │   ├── services/
│   │   ├── terms/
│   │   └── why-choose-us/
│   ├── components/            # Shared React components
│   │   ├── Schema/            # JSON-LD structured data components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── ServicePage.tsx    # Reusable service page template
│   │   ├── LocationPage.tsx   # Reusable location page template
│   │   ├── RoutePage.tsx      # Reusable route page template
│   │   ├── ReviewSection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── BlogSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── QuoteForm.tsx
│   │   └── ...40+ components
│   ├── api/                   # API routes
│   │   ├── contact/
│   │   ├── newsletter/
│   │   ├── og/                # Dynamic OG image generation
│   │   ├── quote/
│   │   └── reservation/
│   └── globals.css            # Tailwind theme & global styles
├── content/
│   └── blog/
│       ├── en/                # English blog posts (markdown)
│       └── es/                # Spanish blog posts (markdown)
├── data/
│   ├── content.json           # Site content & metadata
│   ├── services.json          # 30 service definitions with FAQs
│   ├── reviews.json           # Customer reviews
│   ├── locations.json         # Service area locations
│   ├── local_routes.json      # Local moving routes with drive times
│   ├── long_distance_routes.json
│   ├── alternatives.json      # Competitor comparison data
│   ├── comparisons.json       # Service comparison data
│   ├── navigation.json        # Site navigation structure
│   ├── ui.json                # UI strings (English)
│   ├── metadata.json          # Page metadata
│   ├── blog-posts-en.json     # Blog post index (English)
│   ├── blog-posts-es.json     # Blog post index (Spanish)
│   └── es/                    # Spanish translations of all data files
├── i18n/
│   ├── config.ts              # Locale configuration
│   ├── request.ts             # next-intl request config
│   ├── routing.ts             # Localized routing
│   └── slug-map.ts            # URL slug translations (en ↔ es)
├── lib/
│   ├── blog.ts                # Blog utilities
│   ├── data.ts                # Data loading utilities
│   ├── email.ts               # SMTP email utilities
│   ├── metadata.ts            # SEO metadata helpers
│   ├── schema.ts              # JSON-LD schema generators
│   ├── validation.ts          # Form validation
│   ├── sanitize.ts            # Input sanitization
│   ├── rate-limit.ts          # API rate limiting
│   ├── turnstile.ts           # Cloudflare Turnstile verification
│   └── utils.ts               # General utilities
├── scripts/                   # Python & JS utility scripts
└── public/                    # Static assets & images
```

## Pages

### Main Pages
- `/` - Homepage
- `/about-us` - Company information
- `/services` - All services listing
- `/contact-us` - Contact form and info
- `/quote` - Moving quote request
- `/reservations` - Move reservation form
- `/why-choose-us` - Value propositions

### Service Pages (30 services)
- `/local-moving` - Local Moving
- `/long-distance-moving` - Long Distance Moving
- `/residential-moving` - Residential Moving
- `/commercial-moving` - Commercial Moving
- `/packing-services` - Packing Services
- `/apartment-moving` - Apartment Moving
- `/furniture-moving` - Furniture Moving
- `/full-service-moving` - Full-Service Moving
- `/labor-only-moving` - Labor Only Moving
- `/same-day-moving` - Same Day Moving
- `/last-minute-moving` - Last Minute Moving
- `/hourly-moving` - Hourly Moving
- `/office-moving` - Office Moving
- `/storage-solutions` - Storage Solutions
- `/junk-removal` - Junk Removal
- `/piano-moving`, `/pool-table-moving`, `/hot-tub-moving`, `/appliance-moving`
- `/safe-moving`, `/antique-moving`, `/art-moving`, `/white-glove-moving`
- `/celebrity-moving`, `/military-moving`, `/senior-moving`, `/student-moving`
- `/special-needs-moving`, `/same-building-moving`, `/specialty-item-moving`

### Resource Pages
- `/blog` - Blog listing with categories and filtering
- `/faq` - Frequently asked questions
- `/reviews` - Customer reviews with platform/service filtering
- `/moving-tips` - Moving advice articles
- `/moving-checklist` - Packing checklist
- `/moving-glossary` - Moving terminology
- `/moving-rates` - Pricing information
- `/moving-routes` - Moving route directory

### Dynamic Pages
- `/blog/[slug]` - Individual blog posts
- `/routes/[slug]` - Moving route pages (e.g., miami-to-orlando)
- `/locations/[slug]` - Location-specific pages
- `/services/[location]` - Service area pages (e.g., services/miami)
- `/alternatives/[slug]` - Competitor comparison pages
- `/compare/[slug]` - Service comparison pages
- `/[slug]` - Dynamic service pages and location+service combos

All pages are available in both English and Spanish via the `[locale]` prefix (Spanish URLs use translated slugs).

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- Python 3.8+ (for data scripts only)

### Installation

```bash
git clone <repository-url>
cd rapidpandamovers-website
npm install
cp .env.example .env  # Edit with your values
```

### Development

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Python Scripts

```bash
pip install requests beautifulsoup4 lxml python-dotenv googlemaps

# Reviews
python scripts/fetch_reviews.py       # Fetch via APIs (requires keys)
python scripts/scrape_reviews.py      # Scrape without APIs

# Routes
python scripts/generate_local_routes.py
python scripts/generate_long_distance_routes.py
python scripts/update_drive_times.py  # Requires GOOGLE_MAPS_API_KEY

# Blog
python scripts/generate_blog_posts.py
python scripts/validate_blog_translations.py
```

## Environment Variables

See `.env.example` for all options. Key variables:

```env
# Google Maps
GOOGLE_MAPS_API_KEY=your-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-embed-key

# SMTP (contact/quote forms)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
CONTACT_EMAIL=info@rapidpandamovers.com

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key

# Review APIs (optional)
GOOGLE_PLACES_API_KEY=your-key
YELP_API_KEY=your-key
```

## i18n (Internationalization)

- **Locales**: English (default, no URL prefix) and Spanish (`/es/` prefix)
- **Content**: Separate data files in `data/` (English) and `data/es/` (Spanish)
- **Blog**: Markdown files in `content/blog/en/` and `content/blog/es/`
- **URL slugs**: Translated between languages via `i18n/slug-map.ts`
- **Server components**: `const { content } = (await getMessages()) as any`
- **Client components**: `const { ui, content } = useMessages() as any`

## Structured Data (Schema Markup)

Service pages include JSON-LD schemas for:
- `ServiceSchema` - Service type, area served, provider info
- `FAQSchema` - FAQ page markup (5 Q&As per service)
- `ReviewSchema` - Aggregate ratings and individual reviews
- `ArticleSchema` - Blog post structured data
- `BreadcrumbSchema` - Navigation breadcrumbs
- `RouteSchema` - Moving route information
- `WebSiteSchema` - Site-level search and organization data
- `NavigationSchema` - Site navigation links

## Design System

- **Primary Color**: Orange (#f97316 / orange-700)
- **Secondary Theme**: Black (alternating sections)
- **Section Pattern**: White → Black → Orange backgrounds
- **Buttons**: `.btn-primary` (orange) and `.btn-secondary` (white)
- **Typography**: Getai Grotesk Display for headings, system font for body
- **Layout**: Mobile-first, responsive with Tailwind breakpoints

## Deployment

Deployed on **Cloudflare Pages** with:
- Automatic builds from the main branch
- Edge caching and CDN
- Cloudflare Turnstile for form protection

## Components

See [COMPONENTS.md](./COMPONENTS.md) for detailed component documentation.

## License

Proprietary - Rapid Panda Movers
