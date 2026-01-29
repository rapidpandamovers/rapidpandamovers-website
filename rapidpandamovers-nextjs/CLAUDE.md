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

## Architecture

### App Router Structure

The site uses Next.js App Router with a standard layout pattern:

- `app/layout.tsx` - Root layout with `<Header>` and `<Footer>` wrapping all pages
- `app/page.tsx` - Homepage
- `app/[route]/page.tsx` - Individual pages
- `app/components/` - Shared React components (Header, Footer, Hero)
- `app/globals.css` - Global styles using Tailwind CSS 4.1 `@theme` directive

### Key Pages

Service pages: `/services`, `/local-moving`, `/apartment-moving`, `/packing-services`, `/long-distance`, `/commercial-moving`, `/storage-solutions`

Content pages: `/about`, `/contact`, `/quote`

Blog: `/blog` (listing) and `/blog/[slug]/page.tsx` (individual posts)

### Component Patterns

**Header Navigation:** The Header component (`app/components/Header.tsx`) uses a dropdown menu for services with hover states. The mobile menu is not yet implemented (see TODO comment in code).

**Hero Section:** Homepage uses a background image from the original WordPress site with an overlay and embedded quote form.

**Styling Convention:**
- Orange (#f97316) is the primary brand color
- Custom button utilities: `.btn-primary`, `.btn-secondary`
- Prose styles for blog content formatting
- Tailwind CSS 4.1 uses `@theme` directive in `globals.css` instead of traditional config file

### Data Management

Content is centralized in `data/content.json` with structure:
- `site` - Site metadata (title, phone, email, address)
- `hero` - Homepage hero content
- `services` - Array of service offerings
- `blog` - Array of blog posts with full content

### TypeScript Configuration

Path aliases are configured:
- `@/*` maps to root directory
- `moduleResolution: "bundler"` for Next.js compatibility
- Strict mode enabled

### Image Handling

Next.js Image component is configured to allow images from:
- `www.rapidpandamovers.com` (WordPress source)

See `next.config.js` for image domains.

## WordPress Migration Context

This site was migrated from WordPress. Original URLs and content structure were preserved for SEO. Blog posts were manually converted from WordPress HTML to React components.

## Important Notes

**Mobile Navigation:** The mobile menu button exists in Header but the menu panel is not implemented. When adding mobile navigation, ensure it matches the desktop dropdown structure.

**Form Handling:** Quote forms are currently static (no backend). When implementing form submission, ensure validation and proper error handling.

**SEO:** Each page should export metadata using Next.js Metadata API. Follow the pattern in existing pages for consistency.

**Content Updates:** To add new blog posts or services, update `data/content.json` and create corresponding page files in `app/blog/[slug]/page.tsx` or service route folders.
