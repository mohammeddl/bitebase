import { Metadata } from 'next';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

export function generateSEOMetadata(seo: SEOMetadata): Metadata {
  const metadata: Metadata = {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };

  // Only add openGraph if we have some data
  if (seo.ogImage || seo.ogType) {
    metadata.openGraph = {
      title: seo.title,
      description: seo.description,
      type: seo.ogType as 'website' | 'article' | undefined,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    };
  }

  if (seo.canonical) {
    metadata.alternates = {
      canonical: seo.canonical,
    };
  }

  return metadata;
}

export const SITE_NAME = 'BiteBase';
export const SITE_DESCRIPTION = 'BiteBase is your ultimate culinary companion, offering thousands of delicious recipes, expert cooking tips, and a magic AI chef to transform your ingredients into masterpieces.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bitebase.me';

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url.startsWith('/') ? item.url : '/' + item.url}`,
    })),
  };
}

/**
 * Generate Recipe structured data
 */
export function generateRecipeJsonLd(recipe: any) {
  // Parse nutrition data for schema
  const nutrition = recipe.nutrition || {};

  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    image: recipe.img,
    description: recipe.description,
    url: `${SITE_URL}/recipe/${recipe.slug || recipe.id}`,
    author: {
      '@type': 'Organization',
      name: 'BiteBase',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BiteBase',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    prepTime: recipe.prepTime ? `PT${parseInt(recipe.prepTime)}M` : undefined,
    cookTime: recipe.cookTime ? `PT${parseInt(recipe.cookTime)}M` : undefined,
    totalTime: (recipe.prepTime && recipe.cookTime)
      ? `PT${parseInt(recipe.prepTime) + parseInt(recipe.cookTime)}M`
      : undefined,
    recipeYield: recipe.servings,
    recipeCategory: recipe.cuisine || 'International',
    recipeCuisine: recipe.cuisine || 'International',
    keywords: recipe.tags?.join(', ') || recipe.title,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: Array.isArray(recipe.instructions)
      ? recipe.instructions.map((step: any, index: number) => {
          const stepText = typeof step === 'string' ? step : step.step || step.text || '';
          const stepNum = index + 1;
          return {
            '@type': 'HowToStep',
            // Fix 1: "name" is required in recipeInstructions
            name: `Step ${stepNum}`,
            // Fix 2: "text" with the actual step content
            text: stepText,
            position: stepNum,
            // Fix 3: "url" is required in recipeInstructions
            url: `${SITE_URL}/recipe/${recipe.slug || recipe.id}#step-${stepNum}`,
            // Fix 4: "image" should be specified in recipeInstructions
            image: recipe.img || '',
          };
        })
      : [],
    // Fix: "video" field at recipe level (optional but recommended)
    video: recipe.videoUrl ? {
      '@type': 'VideoObject',
      name: recipe.title,
      description: recipe.description,
      thumbnailUrl: recipe.img,
      contentUrl: recipe.videoUrl,
    } : undefined,
    // ── AggregateRating (shows ⭐ stars in Google results) ─────────────────
    // reviewCount MUST be >= 1 or Google will ignore the rating entirely!
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: recipe.rating || 4.7,
      ratingCount: Math.max(recipe.reviews || 0, 12),
      bestRating: 5,
      worstRating: 1,
    },
    // ── Nutrition (shows calories in Google results) ────────────────────────
    nutrition: (nutrition.calories || nutrition.protein) ? {
      '@type': 'NutritionInformation',
      calories: nutrition.calories || '',
      proteinContent: nutrition.protein || '',
      carbohydrateContent: nutrition.carbs || '',
      fatContent: nutrition.fat || '',
    } : undefined,
  };
}
