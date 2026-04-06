import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/ai-chef',
    '/search',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // In a real app, you would fetch all recipes and categories here
  // For now, we'll suggest Google starts with the list of static routes
  
  return [...staticRoutes];
}
