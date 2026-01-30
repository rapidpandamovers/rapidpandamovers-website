# Reusable Components Documentation

This document describes the reusable components created for the Rapid Panda Movers website.

## AboutSection Component (Simplified)

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

- **Simple Layout**: Two-column layout with text and image
- **About Text**: Brief company description
- **Learn More Link**: Link to the full about page
- **Responsive Design**: Works on all screen sizes

## BlogSection Component

The `BlogSection` component displays blog posts with customizable features.

### Usage

```tsx
import BlogSection from './components/BlogSection'

// Basic usage (all features enabled)
<BlogSection />

// Customized usage
<BlogSection
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

## ContactSection Component

The `ContactSection` component provides a contact section with title, description, image, and contact information.

### Usage

```tsx
import ContactSection from './components/ContactSection'

// Basic usage
<ContactSection />

// Customized usage
<ContactSection 
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
<BlogSection 
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
<AboutSection />
```

### Blog Page
```tsx
// Full blog page with all features
<BlogSection />
```

### Custom About Section
```tsx
// About section without quote form and service areas
<AboutSection 
  showQuoteForm={false}
  showServiceAreas={false}
  showCTA={true}
/>
```

## Data Dependencies

- **BlogSection**: Requires `data/blog.json` with the following structure:
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
