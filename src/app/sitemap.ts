import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { createClient } from '@supabase/supabase-js';

// Use server-side admin client to bypass RLS and get ALL recipes
function getSupabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── 1. Static pages ──────────────────────────────────────────────────────
  const staticRoutesList = [
    { url: `${SITE_URL}/`,                  changeFrequency: 'daily' as const,   priority: 1.0 },
    { url: `${SITE_URL}/search`,            changeFrequency: 'daily' as const,   priority: 0.9 },
    { url: `${SITE_URL}/ai-chef`,           changeFrequency: 'weekly' as const,  priority: 0.8 },
    { url: `${SITE_URL}/about`,             changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${SITE_URL}/contact`,           changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`,    changeFrequency: 'yearly' as const,  priority: 0.3 },
    { url: `${SITE_URL}/terms-of-service`,  changeFrequency: 'yearly' as const,  priority: 0.3 },
  ];
  
  const staticRoutes: MetadataRoute.Sitemap = staticRoutesList.map((r) => ({ ...r, lastModified: new Date() }));

  // ── 2. Category pages ────────────────────────────────────────────────────
  const categories: string[] = ['appetizer', 'main', 'vegetarian', 'dessert', 'easy'];
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/search?category=${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // ── 3. All recipe pages from Supabase ────────────────────────────────────
  let recipeRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabase = getSupabaseServer();

    // Fetch all recipes in batches of 1000 (Supabase max per request)
    let allRecipes: { id: string; slug?: string; updated_at?: string; created_at?: string }[] = [];
    let from = 0;
    const batchSize = 1000;

    while (true) {
      const { data, error } = await supabase
        .from('recipes')
        .select('id, slug, updated_at, created_at')
        .order('created_at', { ascending: false })
        .range(from, from + batchSize - 1);

      if (error) {
        console.error('[sitemap] Supabase error:', error.message);
        break;
      }

      if (!data || data.length === 0) break;

      allRecipes = [...allRecipes, ...data];

      // If we got fewer than batchSize items, we've fetched everything
      if (data.length < batchSize) break;

      from += batchSize;
    }

    console.log(`[sitemap] Found ${allRecipes.length} recipes in Supabase`);

    recipeRoutes = allRecipes.map((recipe) => {
      // Use slug if available, otherwise fall back to id
      const identifier = recipe.slug || recipe.id;
      const lastMod = recipe.updated_at || recipe.created_at;

      return {
        url: `${SITE_URL}/recipe/${identifier}`,
        lastModified: lastMod ? new Date(lastMod) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    });
  } catch (err) {
    console.error('[sitemap] Failed to fetch recipes:', err);
  }

  return [...staticRoutes, ...categoryRoutes, ...recipeRoutes];
}
