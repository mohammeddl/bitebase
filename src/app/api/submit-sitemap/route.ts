import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SITE_URL } from '@/lib/seo';

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'bitebase-indexnow-key';

// POST /api/submit-sitemap
// Fetches all recipe slugs from Supabase and submits them to IndexNow
export async function POST(request: NextRequest) {
  // Simple admin protection
  const authHeader = request.headers.get('authorization');
  const secret = process.env.INDEXNOW_SECRET || process.env.CRON_SECRET;
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch all recipe IDs - only select 'id' to avoid errors from missing columns
    let allIds: string[] = [];
    let from = 0;
    const batchSize = 1000;

    while (true) {
      const { data, error } = await supabase
        .from('recipes')
        .select('id')
        .range(from, from + batchSize - 1);

      if (error) {
        console.error('[submit-sitemap] Supabase error:', error.message, error.details);
        break;
      }

      if (!data || data.length === 0) break;

      data.forEach((r: { id: string }) => {
        allIds.push(String(r.id));
      });

      if (data.length < batchSize) break;
      from += batchSize;
    }

    // Build full URLs
    const urls = [
      // Static high-priority pages first
      `${SITE_URL}/`,
      `${SITE_URL}/search`,
      `${SITE_URL}/ai-chef`,
      `${SITE_URL}/about`,
      `${SITE_URL}/contact`,
      // All recipe pages
      ...allIds.map((id) => `${SITE_URL}/recipe/${id}`),
    ];

    const host = new URL(SITE_URL).hostname;

    // Submit in chunks of 10,000 (IndexNow limit)
    const chunkSize = 10000;
    const chunks: string[][] = [];
    for (let i = 0; i < urls.length; i += chunkSize) {
      chunks.push(urls.slice(i, i + chunkSize));
    }

    const results: Record<string, unknown>[] = [];

    for (const chunk of chunks) {
      const payload = {
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: chunk,
      };

      const endpoints = [
        'https://api.indexnow.org/indexnow',
        'https://www.bing.com/indexnow',
      ];

      const chunkResults = await Promise.allSettled(
        endpoints.map((ep) =>
          fetch(ep, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(payload),
          })
        )
      );

      chunkResults.forEach((r, i) => {
        results.push({
          endpoint: endpoints[i],
          urls: chunk.length,
          status: r.status === 'fulfilled' ? r.value.status : 'error',
        });
      });
    }

    return NextResponse.json({
      success: true,
      totalUrls: urls.length,
      recipeCount: allIds.length,
      chunks: chunks.length,
      results,
    });
  } catch (err: any) {
    console.error('[submit-sitemap]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET /api/submit-sitemap — quick health check
export async function GET() {
  return NextResponse.json({
    info: 'POST to this endpoint to submit all recipes to IndexNow',
    sitemapUrl: `${SITE_URL}/sitemap.xml`,
  });
}
