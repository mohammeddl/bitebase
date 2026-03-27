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

export const SITE_NAME = 'Recipe Hub';
export const SITE_DESCRIPTION = 'Discover delicious recipes, cooking tips, and culinary inspiration.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://recipehub.com';
