# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5 website for Rapid Panda Movers, a Miami-based moving company. The site was migrated from WordPress/Avada theme to a modern React/TypeScript stack.

**Tech Stack:**
- Next.js 15.5 with App Router
- TypeScript (strict mode enabled)
- Tailwind CSS 4.1 (using new `@theme` syntax)
- Lucide React for icons
- React 19.1

## Development Commands

**Development:**
```bash
npm run dev          # Start dev server at http://localhost:3000
```

**Build & Production:**
```bash
npm run build        # Build for production
npm run start        # Start production server
```

**Linting:**
```bash
npm run lint         # Run Next.js linter
```

**Scripts:**
```bash
# Review fetching (requires API keys in .env)
python scripts/fetch_reviews.py      # Fetch reviews via APIs
python scripts/scrape_reviews.py     # Scrape reviews without APIs

# Route data
python scripts/generate_local_routes.py
python scripts/generate_long_distance_routes.py
python scripts/update_drive_times.py  # Requires GOOGLE_MAPS_API_KEY
```

## Architecture

### App Router Structure

The site uses Next.js App Router with a standard layout pattern:

- `app/layout.tsx` - Root layout with `<Header>` and `<Footer>` wrapping all pages
- `app/page.tsx` - Homepage
- `app/[slug]/page.tsx` - Dynamic service/location pages
- `app/components/` - Shared React components
- `app/globals.css` - Global styles using Tailwind CSS 4.1 `@theme` directive

### Key Pages

**Service pages:** `/services`, `/local-moving`, `/apartment-moving`, `/packing-services`, `/long-distance`, `/commercial-moving`, `/storage-solutions`

**Content pages:** `/about-us`, `/contact-us`, `/quote`, `/why-choose-us`

**Resource pages:** `/faq`, `/blog`, `/moving-tips`, `/moving-checklist`, `/moving-glossary`, `/moving-rates`, `/reviews`

**Dynamic pages:**
- `/blog/[slug]` - Individual blog posts
- `/routes/[slug]` - Moving route pages (e.g., miami-to-orlando)
- `/locations/[slug]` - Location pages
- `/alternatives/[slug]` - Competitor comparison pages
- `/compare/[slug]` - Service comparison pages

### Key Components

| Component | Description |
|-----------|-------------|
| `Header` | Site navigation with dropdown menus |
| `Footer` | Site footer with links and contact info |
| `Hero` | Configurable hero section with background image |
| `ReviewSection` | Displays reviews with platform/location/service filtering |
| `ResourceSection` | Links to resource pages, auto-hides current page |
| `ContactSection` | Split layout with contact info and form |
| `MapSection` | Google Maps embed with origin/destination support |
| `AboutSection` | Company about section |
| `BlogSection` | Blog post grid with filtering |

See `COMPONENTS.md` for detailed component documentation.

### Component Patterns

**Header Navigation:** The Header component uses dropdown menus for services with hover states.

**Hero Section:** Configurable hero with title, description, CTA button, and optional background image.

**ReviewSection:** Client component that filters reviews by platform, city, neighborhood, service, or route. Pulls from `data/reviews.json`.

**ResourceSection:** Client component that uses `usePathname()` to detect current page and hide its own link. Three variants: default, compact, grid.

**Styling Convention:**
- Orange (#f97316) is the primary brand color
- Black is the secondary theme color (for alternating sections)
- Headings use the display font (Getai Grotesk)
- Section backgrounds alternate: white → black → orange
- Button utilities:
  - `.btn-primary`: Orange button with white text (use on white/black backgrounds)
  - `.btn-secondary`: White button with orange text (use on orange backgrounds)
- Tailwind CSS 4.1 uses `@theme` directive in `globals.css`

### Data Management

**Content Files:**
- `data/content.json` - Site metadata, hero content, services, blog posts
- `data/reviews.json` - Customer reviews with platform/location/service metadata
- `data/services.json` - Service definitions
- `data/local_routes.csv/json` - Local moving routes with drive times
- `data/long_distance_routes.csv/json` - Interstate moving routes

**Review Data Structure:**
```json
{
  "reviews": [{
    "id": "1",
    "author": "Name",
    "rating": 5,
    "text": "...",
    "date": "2024-11-15",
    "platform": "google",
    "verified": true,
    "location": {"city": "miami", "neighborhood": "brickell", "zip": "33129"},
    "services": ["local-moving", "packing-services"],
    "route": null
  }],
  "platforms": {...},
  "stats": {...}
}
```

### Environment Variables

See `.env.example` for all available configuration:

- `GOOGLE_MAPS_API_KEY` - For drive time calculations
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - For map embeds
- `SMTP_*` - Email configuration for contact forms
- Review API keys: `GOOGLE_PLACES_API_KEY`, `YELP_API_KEY`, `TRUSTPILOT_API_KEY`, `BBB_API_KEY`, `FACEBOOK_ACCESS_TOKEN`
- Review scraper URLs: `YELP_URL`, `TRUSTPILOT_URL`, `BBB_URL`, `CONSUMERAFFAIRS_URL`, `HIREAHELPER_URL`, `ANGI_URL`, `THUMBTACK_URL`, `MOVERSCOM_URL`

### TypeScript Configuration

Path aliases are configured:
- `@/*` maps to root directory
- `moduleResolution: "bundler"` for Next.js compatibility
- Strict mode enabled

### Image Handling

Next.js Image component is configured to allow images from:
- `www.rapidpandamovers.com` (WordPress source)

See `next.config.js` for image domains.

## Scripts

### Review Scripts

**API-based fetcher (`scripts/fetch_reviews.py`):**
- Google Places API, Yelp Fusion API, Trustpilot API, BBB API, Facebook Graph API
- Extracts service types and locations from review text
- Outputs to `data/reviews.json`

**Web scraper (`scripts/scrape_reviews.py`):**
- Scrapes Yelp, Trustpilot, BBB, Google, ConsumerAffairs, HireAHelper, Angi, Thumbtack, Movers.com
- No API keys required, uses BeautifulSoup
- Respects rate limits

### Route Scripts

- `scripts/generate_local_routes.py` - Generates local route combinations
- `scripts/generate_long_distance_routes.py` - Generates interstate routes
- `scripts/update_drive_times.py` - Updates drive times via Google Distance Matrix API

## WordPress Migration Context

This site was migrated from WordPress. Original URLs and content structure were preserved for SEO. Blog posts were manually converted from WordPress HTML to React components.

## Important Notes

**Form Handling:** Contact forms submit to `/api/contact` which sends emails via SMTP. Configure SMTP settings in `.env`.

**SEO:** Each page should export metadata using Next.js Metadata API. Follow the pattern in existing pages for consistency.

**Content Updates:**
- Blog posts: Update `data/content.json` and create page in `app/blog/[slug]/page.tsx`
- Reviews: Run `python scripts/fetch_reviews.py` or `python scripts/scrape_reviews.py`
- Routes: Update CSV files and run generation scripts
