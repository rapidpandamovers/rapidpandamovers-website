# Rapid Panda Movers - Next.js Website

A modern, responsive website for Rapid Panda Movers built with Next.js 15.5 and Tailwind CSS 4.1, migrated from WordPress.

## Features

- **Modern Tech Stack**: Next.js 15.5, TypeScript, Tailwind CSS 4.1, React 19.1
- **Responsive Design**: Mobile-first design that works on all devices
- **SEO Optimized**: Proper meta tags, semantic HTML, dynamic routes
- **Review Aggregation**: Pulls reviews from Google, Yelp, Trustpilot, BBB, Facebook, and more
- **Dynamic Routes**: Location pages, service pages, and moving route pages
- **Contact Forms**: Email notifications via SMTP

## Pages

### Main Pages
- **Home** (`/`) - Landing page with services overview
- **About** (`/about-us`) - Company information
- **Services** (`/services`) - All services listing
- **Contact** (`/contact-us`) - Contact form and info
- **Quote** (`/quote`) - Get a moving quote

### Service Pages
- `/local-moving` - Local moving services
- `/long-distance` - Long distance moving
- `/apartment-moving` - Apartment moving
- `/commercial-moving` - Commercial/office moving
- `/packing-services` - Packing services
- `/storage-solutions` - Storage options

### Resource Pages
- `/blog` - Blog listing
- `/faq` - Frequently asked questions
- `/reviews` - Customer reviews
- `/moving-tips` - Moving advice
- `/moving-checklist` - Packing checklist
- `/moving-glossary` - Moving terms
- `/moving-rates` - Pricing information

### Dynamic Pages
- `/blog/[slug]` - Individual blog posts
- `/routes/[slug]` - Moving route pages (e.g., miami-to-orlando)
- `/locations/[slug]` - Location-specific pages
- `/alternatives/[slug]` - Competitor comparisons
- `/compare/[slug]` - Service comparisons

## Tech Stack

- **Framework**: Next.js 15.5 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4.1 with `@theme` syntax
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Project Structure

```
rapidpandamovers-nextjs/
├── app/
│   ├── components/           # Reusable React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── ReviewSection.tsx
│   │   ├── ResourceSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── MapSection.tsx
│   │   ├── AboutSection.tsx
│   │   └── BlogSection.tsx
│   ├── api/
│   │   └── contact/          # Contact form API
│   ├── blog/                 # Blog pages
│   ├── routes/               # Moving route pages
│   ├── [slug]/               # Dynamic service pages
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── data/
│   ├── content.json          # Site content
│   ├── reviews.json          # Customer reviews
│   ├── services.json         # Service definitions
│   ├── local_routes.csv      # Local moving routes
│   └── long_distance_routes.csv
├── scripts/
│   ├── fetch_reviews.py      # API-based review fetcher
│   ├── scrape_reviews.py     # Web scraper for reviews
│   ├── generate_local_routes.py
│   ├── generate_long_distance_routes.py
│   └── update_drive_times.py
├── lib/
│   ├── data.ts               # Data utilities
│   └── email.ts              # Email utilities
└── public/                   # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Python 3.8+ (for scripts)

### Installation

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd rapidpandamovers-nextjs
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Visit [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Python Scripts

```bash
# Install Python dependencies
pip install requests beautifulsoup4 lxml python-dotenv googlemaps

# Fetch reviews via APIs (requires API keys)
python scripts/fetch_reviews.py

# Scrape reviews without APIs
python scripts/scrape_reviews.py

# Generate route data
python scripts/generate_local_routes.py
python scripts/generate_long_distance_routes.py

# Update drive times (requires GOOGLE_MAPS_API_KEY)
python scripts/update_drive_times.py
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Google Maps
GOOGLE_MAPS_API_KEY=your-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-embed-key

# SMTP (for contact form)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
CONTACT_EMAIL=info@rapidpandamovers.com

# Review APIs (optional)
GOOGLE_PLACES_API_KEY=your-key
YELP_API_KEY=your-key
TRUSTPILOT_API_KEY=your-key

# Review Scraper URLs (no API needed)
YELP_URL=https://www.yelp.com/biz/your-business
TRUSTPILOT_URL=https://www.trustpilot.com/review/yourdomain.com
```

See `.env.example` for all available options.

## Components

See [COMPONENTS.md](./COMPONENTS.md) for detailed component documentation.

Key components:
- **ReviewSection** - Display reviews with platform/location/service filtering
- **ResourceSection** - Links to resource pages, auto-hides current page
- **ContactSection** - Split layout with contact info and form
- **MapSection** - Google Maps embed for routes
- **Hero** - Configurable hero section

## Data Management

### Content
Edit `data/content.json` to update:
- Site metadata (title, phone, email, address)
- Hero section content
- Services information
- Blog posts

### Reviews
Reviews are stored in `data/reviews.json` with rich metadata:
- Platform (Google, Yelp, Facebook, etc.)
- Location (city, neighborhood, ZIP)
- Services mentioned
- Routes (for route-specific reviews)

Populate reviews using:
```bash
python scripts/fetch_reviews.py    # With API keys
python scripts/scrape_reviews.py   # Without API keys
```

### Routes
Route data in CSV/JSON format with:
- Origin/destination cities and ZIP codes
- Distance and drive time
- Company travel time

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
```bash
npm run build
# Deploy .next folder
```

## Design System

- **Primary Color**: Orange (#f97316)
- **Secondary Theme**: Black (alternating sections)
- **Section Pattern**: White bg → Black bg → Orange bg
- **Buttons**: Orange on white/black, White on orange
- **Typography**: Getai Grotesk for headings, Inter for body text
- **Spacing**: Consistent Tailwind spacing scale
- **Components**: Responsive, mobile-first design

## Support

- Email: info@rapidpandamovers.com
- Phone: (305) 747-4181

## License

Proprietary - Rapid Panda Movers
