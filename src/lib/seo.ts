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
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bitebase.com';

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
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    image: recipe.img,
    description: recipe.description,
    author: {
      '@type': 'Person',
      name: recipe.chefName || 'BiteBase',
    },
    prepTime: recipe.prepTime ? `PT${parseInt(recipe.prepTime)}M` : undefined,
    cookTime: recipe.cookTime ? `PT${parseInt(recipe.cookTime)}M` : undefined,
    totalTime: (recipe.prepTime && recipe.cookTime) 
      ? `PT${parseInt(recipe.prepTime) + parseInt(recipe.cookTime)}M` 
      : undefined,
    recipeYield: recipe.servings,
    recipeCategory: recipe.cuisine || 'International',
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((step: string, index: number) => ({
      '@type': 'HowToStep',
      text: step,
      position: index + 1,
    })),
    aggregateRating: recipe.rating ? {
      '@type': 'AggregateRating',
      ratingValue: recipe.rating,
      reviewCount: recipe.reviews || 0,
    } : undefined,
  };
}
