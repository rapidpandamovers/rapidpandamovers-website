# Reusable Components Documentation

This document describes the reusable components created for the Rapid Panda Movers website.

## AboutUs Component (Simplified)

The `AboutUs` component provides a simple about section with paragraph, image, and link to the full about page.

### Usage

```tsx
import AboutUs from './components/AboutUs'

// Basic usage
<AboutUs />

// With custom styling
<AboutUs className="bg-gray-50" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | "" | Additional CSS classes |

### Features

- **Simple Layout**: Two-column layout with text and image
- **About Text**: Brief company description
- **Learn More Link**: Link to the full about page
- **Responsive Design**: Works on all screen sizes

## AboutUsFull Component

The `AboutUsFull` component provides the complete about page with all sections.

### Usage

```tsx
import AboutUsFull from './components/AboutUsFull'

// Full about page
<AboutUsFull />
```

### Features

- **Hero Section**: Background image with company introduction and quote form
- **About Content**: Mission, values, and why choose us sections
- **Service Areas**: Grid of cities served (Miami-Dade County)
- **CTA Section**: Call-to-action with quote and contact links

## RecentPosts Component

The `RecentPosts` component displays blog posts with customizable features.

### Usage

```tsx
import RecentPosts from './components/RecentPosts'

// Basic usage (all features enabled)
<RecentPosts />

// Customized usage
<RecentPosts 
  showFeatured={true}
  showCategories={false}
  showNewsletter={false}
  maxPosts={3}
  className="bg-gray-50"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showFeatured` | boolean | true | Show/hide the featured post section |
| `showCategories` | boolean | true | Show/hide the category filter buttons |
| `showNewsletter` | boolean | true | Show/hide the newsletter signup section |
| `maxPosts` | number | 6 | Maximum number of posts to display |
| `className` | string | "" | Additional CSS classes |

### Features

- **Featured Post**: Large highlighted post with gradient background
- **Category Filter**: Filter buttons for different post categories
- **Posts Grid**: Responsive grid of blog posts
- **Newsletter Signup**: Email subscription form

## MovingChecklist Component

The `MovingChecklist` component displays a process checklist with default values or loads process steps from services.json.

### Usage

```tsx
import MovingChecklist from './components/MovingChecklist'

// Basic usage with default steps
<MovingChecklist />

// With custom title and description
<MovingChecklist 
  title="Our Moving Process"
  description="Follow our proven process for a smooth move"
/>

// Load steps from specific service
<MovingChecklist serviceSlug="local-moving" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `serviceSlug` | string | undefined | Service slug to load process_steps from services.json |
| `title` | string | "Our Moving Process" | Section title |
| `description` | string | "Follow our proven process..." | Section description |
| `className` | string | "" | Additional CSS classes |

### Features

- **Default Steps**: 4-step default moving process
- **Service Integration**: Loads process_steps from services.json by service slug
- **Visual Design**: Step-by-step visual process with connecting lines
- **Responsive Layout**: Works on all screen sizes

## ContactUs Component

The `ContactUs` component provides a contact section with title, description, image, and contact information.

### Usage

```tsx
import ContactUs from './components/ContactUs'

// Basic usage
<ContactUs />

// Customized usage
<ContactUs 
  title="Get In Touch"
  description="Ready to start your move? Contact us today!"
  imageUrl="/custom-image.jpg"
  imageAlt="Custom contact image"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "Contact Us" | Section title |
| `description` | string | "Ready to make your move?..." | Section description |
| `imageUrl` | string | Default contact image | Contact section image |
| `imageAlt` | string | "Contact Us - Rapid Panda Movers" | Image alt text |
| `className` | string | "" | Additional CSS classes |

### Features

- **Contact Information**: Phone, email, and address display
- **Customizable Content**: Title, description, and image
- **Visual Design**: Two-column layout with contact details and image
- **Responsive Layout**: Works on all screen sizes

## Examples

### Homepage with Recent Posts
```tsx
// Show 3 recent posts without categories or newsletter
<RecentPosts 
  showFeatured={true}
  showCategories={false}
  showNewsletter={false}
  maxPosts={3}
  className="bg-gray-50"
/>
```

### About Page
```tsx
// Full about page with all sections
<AboutUs />
```

### Blog Page
```tsx
// Full blog page with all features
<RecentPosts />
```

### Custom About Section
```tsx
// About section without quote form and service areas
<AboutUs 
  showQuoteForm={false}
  showServiceAreas={false}
  showCTA={true}
/>
```

## Data Dependencies

- **RecentPosts**: Requires `data/blog.json` with the following structure:
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "excerpt": "string",
      "slug": "string",
      "date": "string",
      "category": "string",
      "readTime": "string"
    }
  ]
  ```

## Styling

Both components use Tailwind CSS classes and are fully responsive. They follow the existing design system with:
- Orange and blue color scheme
- Consistent spacing and typography
- Hover effects and transitions
- Mobile-first responsive design
