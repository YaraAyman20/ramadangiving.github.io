# Ramadan Giving - Next.js Website

A modern, performant website for Ramadan Giving organization built with Next.js 15, TypeScript, and static export for GitHub Pages deployment.

## Features

- 🚀 **Next.js 15** with App Router
- 📝 **TypeScript** for type safety
- 🎨 **Modern UI/UX** with responsive design
- 📱 **Mobile-first** approach
- 🖼️ **Image Optimization** with Next.js Image
- 📄 **Static Export** for GitHub Pages
- 🔄 **Dynamic Blog** with static generation
- 💰 **Donation System** with multiple payment options

## Pages

- **Home** (`/`) - Main landing page with hero, about, team, impact timeline, news, gallery, and donation sections
- **Donate** (`/donate`) - Comprehensive donation page with cause selection, amount selection, and payment methods
- **Blog** (`/blog`) - Blog listing with category filtering and search
- **Blog Post** (`/blog/[slug]`) - Individual blog post pages

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server (for testing)
npm run start
```

### Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout with Navbar & Footer
│   ├── page.tsx             # Home page
│   ├── blog/
│   │   ├── page.tsx         # Blog listing page
│   │   └── [slug]/
│   │       └── page.tsx     # Dynamic blog post pages
│   └── donate/
│       └── page.tsx         # Donation page
├── components/
│   ├── Navbar.tsx           # Navigation component
│   ├── Footer.tsx           # Footer component
│   └── sections/            # Home page sections
│       ├── HeroSection.tsx
│       ├── AboutSection.tsx
│       ├── TeamSection.tsx
│       ├── ImpactSection.tsx
│       ├── NewsSection.tsx
│       ├── GallerySection.tsx
│       ├── GetInvolvedSection.tsx
│       ├── DonateSection.tsx
│       └── LocationsSection.tsx
public/
├── assets/
│   ├── images/              # Static images
│   ├── years/               # Year-specific images
│   └── events/              # Event gallery images
└── posts.json               # Blog posts data
```

## Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Setup

1. Push the code to your GitHub repository
2. Go to repository Settings > Pages
3. Under "Build and deployment", select "GitHub Actions" as the source
4. The workflow will automatically build and deploy on push to `main`

### Manual Deployment

If you need to deploy manually:

```bash
# Build the static site
npm run build

# The output will be in the ./out directory
# Upload this directory to your hosting service
```

## Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# Stripe (for donation processing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### Next.js Config

The `next.config.ts` is configured for static export:

```typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is created for Ramadan Giving Organization. All rights reserved.
