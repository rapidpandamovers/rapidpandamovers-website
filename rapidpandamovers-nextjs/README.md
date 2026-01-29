# Rapid Panda Movers - Next.js Website

A modern, responsive website for Rapid Panda Movers built with Next.js 15.5 and Tailwind CSS 4.1, migrated from WordPress.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 15.5, TypeScript, and Tailwind CSS 4.1
- **Responsive Design**: Mobile-first responsive design that works on all devices
- **SEO Optimized**: Proper meta tags, semantic HTML, and optimized performance
- **Fast Loading**: Static generation for optimal performance
- **Professional UI**: Clean, modern interface with smooth animations

## 📄 Pages

- **Home** (`/`) - Main landing page with services overview and contact form
- **Blog** (`/blog`) - Blog listing page
- **Blog Post** (`/blog/budget-apartment-moving`) - Individual blog post example
- **Apartment Moving** (`/apartment-moving`) - Service page for apartment moving
- **Quote** (`/quote`) - Contact form for getting moving quotes

## 🛠 Tech Stack

- **Framework**: Next.js 15.5 with App Router
- **Styling**: Tailwind CSS 4.1 with PostCSS
- **Language**: TypeScript
- **Icons**: Lucide React
- **Deployment**: Ready for Vercel, Netlify, or any static hosting

## 📁 Project Structure

```
rapidpandamovers-nextjs/
├── app/
│   ├── components/          # Reusable React components
│   │   ├── Header.tsx      # Site header with navigation
│   │   ├── Footer.tsx      # Site footer
│   │   └── Hero.tsx        # Homepage hero section
│   ├── blog/               # Blog pages
│   │   ├── page.tsx       # Blog listing
│   │   └── budget-apartment-moving/
│   │       └── page.tsx   # Individual blog post
│   ├── apartment-moving/   # Service pages
│   │   └── page.tsx
│   ├── quote/             # Quote request page
│   │   └── page.tsx
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx          # Homepage
├── data/
│   └── content.json      # Site content and configuration
├── scripts/
│   └── extract-wordpress-content.js  # WordPress migration helper
└── public/               # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: Blue color palette (`primary-50` to `primary-900`)
- **Secondary**: Purple color palette (`secondary-50` to `secondary-900`)
- **Grays**: Standard gray scale for text and backgrounds

### Components
- **Buttons**: `.btn-primary` and `.btn-secondary` utility classes
- **Typography**: Responsive text scaling with proper hierarchy
- **Forms**: Consistent form styling with focus states
- **Cards**: Clean card layouts for services and blog posts

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd rapidpandamovers-nextjs
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Visit [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📝 Content Management

Content is stored in `data/content.json` for easy management. This includes:

- Site metadata (title, description, contact info)
- Hero section content
- Services information
- Blog posts data

To add new content:

1. **Add blog posts**: Update the `blog` array in `content.json`
2. **Add services**: Update the `services` array
3. **Update site info**: Modify the `site` object

## 🔄 WordPress Migration

This site was migrated from WordPress using the following process:

1. **Content Extraction**: WordPress content was extracted from the database dump
2. **Theme Conversion**: Avada theme elements were converted to React components
3. **URL Structure**: Maintained original URL structure for SEO
4. **Content Migration**: Blog posts and pages were manually converted
5. **Form Migration**: Contact forms were rebuilt in React

### Migration Scripts

- `scripts/extract-wordpress-content.js` - Helper script for extracting WP content

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify

### Other Hosts
1. Run `npm run build` 
2. Upload the generated files to your hosting provider

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Bundle Size**: Optimized with code splitting and tree shaking
- **Images**: Next.js Image component for optimal loading

## 🔧 Customization

### Adding New Pages
1. Create a new folder in `app/`
2. Add `page.tsx` file
3. Update navigation in `Header.tsx`

### Styling
- Global styles in `app/globals.css`
- Component-specific styles using Tailwind classes
- Custom utilities defined in Tailwind config

### SEO
- Update metadata in each page's default export
- Modify `layout.tsx` for site-wide SEO settings

## 📞 Support

For questions or issues:
- Email: info@rapidpandamovers.com
- Phone: (305) 555-0123

## 📄 License

This project is proprietary to Rapid Panda Movers.

---

Built with ❤️ by the Rapid Panda Movers team