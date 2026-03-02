# Reusable Components Documentation

This document describes the reusable components created for the Rapid Panda Movers website.

## Table of Contents

- [ReviewSection](#reviewsection-component)
- [ResourceSection](#resourcesection-component)
- [ContactSection](#contactsection-component)
- [MapSection](#mapsection-component)
- [TravelSection](#travelsection-component)
- [InfoSection](#infosection-component)
- [SightSection](#sightsection-component)
- [AboutSection](#aboutsection-component)
- [BlogSection](#blogsection-component)
- [Hero](#hero-component)

---

## ReviewSection Component

The `ReviewSection` component displays customer reviews with filtering capabilities by platform, location, service, and route.

### Usage

```tsx
import ReviewSection from './components/ReviewSection'

// Basic usage
<ReviewSection />

// With filtering
<ReviewSection
  city="miami"
  service="local-moving"
  limit={6}
/>

// Full-featured reviews page
<ReviewSection
  title="What Our Customers Say"
  subtitle="Real reviews from real customers"
  limit={12}
  showPlatformFilter={true}
  showAllLink={false}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `city` | string | - | Filter reviews by city (e.g., "miami", "brickell") |
| `neighborhood` | string | - | Filter reviews by neighborhood |
| `service` | string | - | Filter reviews by service type (e.g., "local-moving") |
| `route` | string | - | Filter reviews by route (e.g., "miami-to-orlando") |
| `title` | string | "What Our Customers Say" | Section title |
| `subtitle` | string | Default text | Section subtitle |
| `limit` | number | 6 | Maximum number of reviews to display |
| `showPlatformFilter` | boolean | false | Show platform filter buttons |
| `showAllLink` | boolean | true | Show "View All Reviews" link |
| `className` | string | "" | Additional CSS classes |
| `variant` | "default" \| "compact" \| "carousel" | "default" | Display variant |

### Features

- **Platform Icons**: Google, Yelp, Facebook, Trustpilot, BBB, Thumbtack, ConsumerAffairs, HireAHelper, Angi, Movers.com
- **Smart Filtering**: Filter by location, service, or route for contextual reviews
- **Rating Stats**: Shows average rating, total reviews, and 5-star percentage
- **Verified Badges**: Displays verification status for reviews
- **Service Tags**: Shows which services each review mentions

### Data Source

Reads from `data/reviews.json`. Use `scripts/fetch_reviews.py` or `scripts/scrape_reviews.py` to populate.

---

## ResourceSection Component

The `ResourceSection` component displays links to resource pages and automatically hides the link to the current page.

### Usage

```tsx
import ResourceSection from './components/ResourceSection'

// Basic usage
<ResourceSection />

// Compact variant
<ResourceSection variant="compact" title="More Resources" />

// Grid variant with limited items
<ResourceSection variant="grid" maxItems={4} />

// Custom title and subtitle
<ResourceSection
  title="Learn More"
  subtitle="Explore our helpful guides"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "Helpful Resources" | Section title |
| `subtitle` | string | "Everything you need..." | Section subtitle |
| `className` | string | "" | Additional CSS classes |
| `maxItems` | number | - | Limit number of displayed resources |
| `variant` | "default" \| "compact" \| "grid" | "default" | Display variant |

### Features

- **Auto-Hide Current Page**: Uses `usePathname()` to detect and hide the current page's link
- **Three Variants**:
  - `default`: Horizontal cards with icons and arrows
  - `compact`: Pill-style links
  - `grid`: Card grid layout
- **Linked Resources**: FAQ, Blog, Moving Tips, Moving Checklist, Moving Glossary, Moving Rates, Reviews

---

## ContactSection Component

The `ContactSection` component provides a split-layout contact section with contact info on the left and a form on the right.

### Usage

```tsx
import ContactSection from './components/ContactSection'

// Basic usage
<ContactSection />

// Custom styling
<ContactSection className="bg-white" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | "" | Additional CSS classes |

### Features

- **Split Layout**: Contact info on left, form on right
- **Contact Information**: Phone, email, address with icons
- **Business Hours**: Displays operating hours
- **Contact Form**: Name, email, phone, service type, message fields
- **Form Submission**: Submits to `/api/contact` endpoint

---

## MapSection Component

The `MapSection` component displays a Google Maps embed showing the route between two locations.

### Usage

```tsx
import MapSection from './components/MapSection'

// Basic usage (local route)
<MapSection
  origin="Miami"
  destination="Fort Lauderdale"
  originZip="33101"
  destinationZip="33301"
/>

// Long-distance route with state codes
<MapSection
  origin="Miami"
  destination="Atlanta"
  originZip="33101"
  destinationZip="30301"
  originState="FL"
  destinationState="GA"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `origin` | string | required | Origin city name |
| `destination` | string | required | Destination city name |
| `originZip` | string | - | Origin ZIP code (preferred for accuracy) |
| `destinationZip` | string | - | Destination ZIP code |
| `originState` | string | "FL" | Origin state code |
| `destinationState` | string | "FL" | Destination state code |
| `className` | string | "" | Additional CSS classes |

### Features

- **Google Maps Embed**: Shows directions between two points
- **ZIP Code Support**: Uses ZIP codes for accurate location matching
- **Multi-State Support**: Works with interstate routes
- **Responsive**: Full-width map with proper aspect ratio

---

## TravelSection Component

The `TravelSection` component displays route information including distance, drive time, cost, and links to origin/destination pages.

### Usage

```tsx
import TravelSection from './components/TravelSection'

// Basic usage
<TravelSection
  origin="Miami"
  destination="Orlando"
  originSlug="miami"
  destinationSlug="orlando"
  distanceMiles={235}
  driveTimeMinutes={210}
  startingCost={1200}
/>

// Long-distance route (destination has no page)
<TravelSection
  origin="Miami"
  destination="Atlanta"
  originSlug="miami"
  destinationSlug="atlanta-ga"
  distanceMiles={662}
  driveTimeMinutes={580}
  destinationHasPage={false}
/>

// Without location cards entirely
<TravelSection
  origin="Miami"
  destination="Atlanta"
  distanceMiles={662}
  driveTimeMinutes={580}
  showLocationLinks={false}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `origin` | string | required | Origin city name |
| `destination` | string | required | Destination city name |
| `originSlug` | string | - | Origin slug for location link |
| `destinationSlug` | string | - | Destination slug for location link |
| `distanceMiles` | number | required | Distance in miles |
| `driveTimeMinutes` | number | required | Drive time in minutes |
| `startingCost` | number | - | Starting cost in USD |
| `showLocationLinks` | boolean | true | Show origin/destination cards |
| `originHasPage` | boolean | true | Whether origin has a location page (renders as link if true) |
| `destinationHasPage` | boolean | true | Whether destination has a location page (renders as link if true) |
| `className` | string | "" | Additional CSS classes |

### Features

- **Info Cards**: Distance, drive time, and optional starting cost
- **Auto-formatted Time**: Converts minutes to "Xh Ym" format
- **Conditional Location Links**: Origin and destination cards can be links or static based on `originHasPage`/`destinationHasPage` props
- **Long-Distance Support**: For out-of-state routes, destination cards render without links while keeping the visual layout
- **Responsive Grid**: Adapts card layout based on content

---

## InfoSection Component

The `InfoSection` component provides a flexible info section with title, description, optional breadcrumbs, and customizable content.

### Usage

```tsx
import InfoSection from './components/InfoSection'

// Basic usage
<InfoSection
  title="Professional Moving Services in"
  titleHighlight="Miami"
/>

// Location page with full info
<InfoSection
  title="Professional Moving Services in"
  titleHighlight="Brickell"
  subtitle="Serving Brickell and the greater Miami area"
  info="ZIP Codes: 33129, 33130, 33131"
  breadcrumbs={[
    { label: "Miami Movers", href: "/miami-movers" },
    { label: "Miami-Dade County" },
    { label: "Florida" },
  ]}
/>

// City page with population and location description
<InfoSection
  title="Professional Moving Services in"
  titleHighlight="Miami"
  description="Rapid Panda Movers provides comprehensive moving services throughout Miami and the surrounding areas."
  locationDescription="Miami is the vibrant heart of South Florida, known for its stunning beaches, Art Deco architecture, and diverse cultural heritage."
  info="Serving Miami (Population: 442,241)"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | required | Title text before highlight |
| `titleHighlight` | string | - | Orange highlighted text in title |
| `titleSuffix` | string | "" | Text after the highlighted portion |
| `subtitle` | string | - | Subtitle below main title |
| `description` | string | - | Main description paragraph |
| `locationDescription` | string | - | About the location, displayed in a highlighted box |
| `info` | string | - | Additional info line (e.g., population, ZIP codes) |
| `breadcrumbs` | BreadcrumbItem[] | - | Array of breadcrumb items with label and optional href |
| `className` | string | "" | Additional CSS classes |

### Features

- **Flexible Title**: Supports plain text, highlighted text, and suffix portions
- **Location Description Box**: Displays location info from locations.json in a highlighted section
- **Breadcrumb Navigation**: Optional breadcrumb links with icons for hierarchy display
- **Responsive Layout**: Centered content with max-width container
- **Conditional Rendering**: All optional props gracefully hide when not provided

---

## SightSection Component

The `SightSection` component displays cards featuring landmarks and popular sights for a location, with images, descriptions, and optional links.

### Usage

```tsx
import SightSection from './components/SightSection'

// Basic usage with sights data
<SightSection
  sights={[
    {
      name: "Vizcaya Museum",
      slug: "vizcaya-museum",
      description: "Historic Italian Renaissance villa and gardens",
      image: "/images/sights/vizcaya-museum.jpg",
      category: "museum"
    }
  ]}
  locationName="Miami"
/>

// With all options
<SightSection
  title="Explore Miami"
  subtitle="Discover the best attractions"
  sights={sightsData}
  showArrows={true}
  maxItems={6}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sights` | Sight[] | required | Array of sight objects |
| `title` | string | "Popular Sights in {locationName}" | Section title |
| `subtitle` | string | Auto-generated | Section subtitle |
| `locationName` | string | - | Name of location for default title |
| `showArrows` | boolean | true | Show navigation arrows |
| `maxItems` | number | - | Limit number of displayed sights |
| `className` | string | "" | Additional CSS classes |

### Sight Object

```typescript
interface Sight {
  name: string           // Name of the sight
  slug: string           // URL-friendly identifier
  description: string    // Brief description
  image: string          // Image path (e.g., "/images/sights/xxx.jpg")
  address?: string       // Optional street address
  website?: string       // Optional website URL
  category?: 'landmark' | 'park' | 'museum' | 'entertainment' | 'shopping' | 'dining' | 'beach' | 'nature'
}
```

### Features

- **Scrollable Cards**: Horizontal scroll with navigation arrows
- **Category Badges**: Color-coded category labels on each card
- **Image Display**: Next.js Image optimization with hover zoom effect
- **Address & Links**: Optional address display and external website links
- **Responsive**: Cards adapt to different screen sizes

### Data Source

Sights data is stored in `data/locations.json` under each city's `sights` array. Run `scripts/download_sight_images.py` to download placeholder images.

---

## AboutSection Component

The `AboutSection` component provides a simple about section with paragraph, image, and link to the full about page.

### Usage

```tsx
import AboutSection from './components/AboutSection'

// Basic usage
<AboutSection />

// With custom styling
<AboutSection className="bg-gray-50" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | "" | Additional CSS classes |

### Features

- **Two-Column Layout**: Text on left, image on right
- **Company Description**: Brief about text
- **Learn More Link**: Link to full about page
- **Responsive Design**: Stacks on mobile

---

## BlogSection Component

The `BlogSection` component displays blog posts with optional featured post, category filtering, and newsletter signup.

### Usage

```tsx
import BlogSection from './components/BlogSection'

// Full blog page
<BlogSection />

// Homepage preview
<BlogSection
  showFeatured={true}
  showCategories={false}
  showNewsletter={false}
  maxPosts={3}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showFeatured` | boolean | true | Show featured post section |
| `showCategories` | boolean | true | Show category filter buttons |
| `showNewsletter` | boolean | true | Show newsletter signup |
| `maxPosts` | number | 6 | Maximum posts to display |
| `className` | string | "" | Additional CSS classes |

### Features

- **Featured Post**: Large highlighted post with gradient
- **Category Filter**: Filter by post category
- **Posts Grid**: Responsive grid layout
- **Newsletter Signup**: Email subscription form

---

## Hero Component

The `Hero` component provides a configurable hero section with background image, title, description, and CTA.

### Usage

```tsx
import Hero from './components/Hero'

// Basic usage
<Hero
  title="Welcome to Rapid Panda Movers"
  description="Your trusted moving partner"
  cta="Get a Quote"
/>

// With background image
<Hero
  title="Professional Moving Services"
  description="Serving Miami and beyond"
  cta="Contact Us"
  backgroundImage="/images/hero-bg.jpg"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | required | Hero title |
| `description` | string | - | Hero description text |
| `cta` | string | - | CTA button text |
| `ctaLink` | string | "/quote" | CTA button link |
| `backgroundImage` | string | - | Background image URL |
| `className` | string | "" | Additional CSS classes |

---

## Data Dependencies

### ReviewSection
Requires `data/reviews.json`:
```json
{
  "reviews": [{
    "id": "1",
    "author": "John D.",
    "rating": 5,
    "text": "Great service!",
    "date": "2024-11-15",
    "platform": "google",
    "verified": true,
    "location": {"city": "miami", "neighborhood": "brickell", "zip": "33129"},
    "services": ["local-moving", "packing-services"],
    "route": null
  }],
  "platforms": {
    "google": {"name": "Google", "icon": "google", "color": "#4285F4", "url": "..."}
  },
  "stats": {
    "total_reviews": 150,
    "average_rating": 4.9,
    "five_star_percentage": 95
  }
}
```

### BlogSection
Requires `data/blog.json` or blog data in `data/content.json`:
```json
[{
  "id": "string",
  "title": "string",
  "excerpt": "string",
  "slug": "string",
  "date": "string",
  "category": "string",
  "readTime": "string"
}]
```

---

## Styling

All components use Tailwind CSS classes and follow the design system:

- **Primary Color**: Orange (#f97316)
- **Secondary Theme**: Black (for alternating sections)
- **Heading Font**: Getai Grotesk (applied to all h1-h6 elements)
- **Body Font**: Inter
- **Section Backgrounds**: Alternate between white → black → orange
- **Consistent Spacing**: Standard padding/margin scale
- **Responsive**: Mobile-first design
- **Hover Effects**: Smooth transitions on interactive elements

### Button Classes
- `.btn-primary`: Orange background, white text (use on white/black backgrounds)
- `.btn-secondary`: White background, orange text (use on orange backgrounds)
