# Recipe Website - Routing Structure & Pages

## Project Overview
A Next.js recipe website optimized for Google AdSense and SEO, featuring recipe discovery, categorization, and search functionality.

## Directory Structure

```
src/app/
├── page.tsx                          # Homepage - Featured recipes & feed
├── layout.tsx                        # Root layout with navigation & footer
│
├── recipe/
│   └── [slug]/
│       └── page.tsx                  # Dynamic recipe detail page
│
├── category/
│   └── [slug]/
│       └── page.tsx                  # Dynamic category archive page
│
├── search/
│   └── page.tsx                      # Search & filter UI
│
├── privacy-policy/
│   └── page.tsx                      # Static legal page
│
├── terms-of-service/
│   └── page.tsx                      # Static legal page
│
├── about/
│   └── page.tsx                      # Static legal page
│
└── contact/
    └── page.tsx                      # Static legal page
│
src/lib/
└── seo.ts                            # SEO utilities & metadata helpers
```

## Routes & Pages

### Dynamic Routes
- **`/recipe/[slug]`** - Single recipe detail page
  - Features ingredients list, instructions, nutrition info
  - AdSense placements throughout
  - Related recipes sidebar
  
- **`/category/[slug]`** - Category archive page
  - Paginated recipe list by category
  - Filter and sort options
  - AdSense placements

- **`/search`** - Search & filter interface
  - Main search bar
  - Advanced filters (difficulty, cook time, rating, category)
  - Results grid with pagination
  - AdSense placements

### Static Routes
- **`/`** - Homepage
  - Hero section with CTA
  - Featured recipes carousel
  - Category navigation
  - Newsletter signup
  - AdSense placements

- **`/privacy-policy`** - Privacy Policy (Legal)
- **`/terms-of-service`** - Terms of Service (Legal)
- **`/about`** - About Us (Legal)
- **`/contact`** - Contact Form (Legal)

## SEO Features

### Metadata
- Dynamic page titles with target keywords
- Descriptive meta descriptions
- Open Graph tags for social sharing
- Twitter card integration
- Canonical URLs
- Structured keyword lists per page

### SEO Helper (`src/lib/seo.ts`)
```typescript
// Available exports:
- generateMetadata(seo: SEOMetadata): Metadata
- SITE_NAME: 'Recipe Hub'
- SITE_DESCRIPTION: string
- SITE_URL: string
```

### Page-Specific SEO
- **Homepage**: General recipe/cooking keywords
- **Recipe Pages**: Recipe name + cuisine + cooking keywords
- **Category Pages**: Category + cuisines + cooking keywords
- **Search Page**: Search + filter + recipe keywords
- **Legal Pages**: Standard legal page keywords

## AdSense Placements

### Standard Placements
1. **Header Banner** (728x90 or responsive)
   - Homepage hero section
   - Category page header

2. **Content Sidebar** (300x600 or responsive)
   - Recipe detail page sidebar
   - Sticky positioning

3. **Mid-Content Banner** (728x90 or responsive)
   - Between sections on longer pages
   - Recipe instructions section

4. **Footer Banner** (728x90 or responsive)
   - Site footer area

### Implementation Notes
All ad placements include HTML comments with `google_ad_client` variable:
```html
<!-- google_ad_client = "ca-pub-xxxxxxxxxxxxxxxx" -->
<!-- Replace with your actual AdSense code -->
```

## Features

### Homepage (`/`)
- Featured recipes showcase
- Category browsing
- Newsletter signup form
- CTA to browse all recipes
- Multiple AdSense placements

### Recipe Detail (`/recipe/[slug]`)
- Full recipe information
- Ingredients checklist
- Step-by-step instructions
- Cook time, prep time, servings, difficulty
- Nutrition information per serving
- Rating and review count
- Add to shopping list button
- Comments section placeholder
- Related/suggested recipes

### Category Archive (`/category/[slug]`)
- Filtered recipe list by category
- Search within category
- Difficulty level filter
- Sort options (latest, popular, rated, quick)
- Pagination
- Recipe cards with key info

### Search Page (`/search`)
- Main search input
- Advanced filters:
  - Difficulty (easy, medium, hard)
  - Cook time ranges
  - Categories
  - Rating filters
- Sort options
- Results pagination
- Recipe cards display

### Navigation
- Global navigation bar (sticky)
- Quick search in header
- Footer with links
  - Quick links (Home, Browse, About, Contact)
  - Categories
  - Legal links (Privacy, Terms)
  - Social media links

## Styling

- **Framework**: Tailwind CSS
- **Color Scheme**: Orange/Red themed for food
- **Responsive**: Mobile-first mobile/tablet/desktop
- **Components**: Semantic HTML with Tailwind utilities

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Mock Data

All pages currently use mock data with TypeScript interfaces. Replace the mock data fetching with actual database queries:

Example recipe interface:
```typescript
interface Recipe {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  cookTime: string;
  prepTime: string;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Array<{ name: string; amount: string }>;
  instructions: string[];
  nutritionPerServing: Record<string, string | number>;
}
```

## Next Steps

1. **Connect Database** - Replace mock data with real recipe data
2. **Add Search Functionality** - Implement actual search against recipe database
3. **Configure AdSense** - Add your AdSense publisher ID
4. **Create Recipe Components** - Extract reusable recipe cards and sections
5. **Add User Accounts** - Implement user authentication for favorites/ratings
6. **Setup Analytics** - Integrate Google Analytics and search console
7. **Content Creation** - Add real recipes with images
8. **Social Media Sharing** - Add share buttons for recipes
9. **Comments System** - Implement real recipe reviews

## Performance Optimization

- Static generation for legal pages
- Incremental Static Regeneration (ISR) for category/recipe pages
- Image optimization with Next.js Image component
- Font optimization with next/font
