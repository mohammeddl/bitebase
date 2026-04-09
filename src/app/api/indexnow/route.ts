import { NextRequest, NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/seo';

// IndexNow key — must match the filename at /public/[key].txt
// Generate a random key at https://www.indexnow.org/
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'bitebase-indexnow-key';

/**
 * POST /api/indexnow
 * 
 * Submit one or more URLs for instant indexing via the IndexNow protocol.
 * Works with Bing, Yandex, Seznam and (via partnership) Google.
 * 
 * Usage:
 *   fetch('/api/indexnow', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ urls: ['https://bitebase.me/recipe/my-recipe'] })
 *   })
 */
export async function POST(request: NextRequest) {
  try {
    // Protect the route in production with a secret if needed
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.INDEXNOW_SECRET;
    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const urls: string[] = body.urls || [];

    if (!urls.length) {
      return NextResponse.json({ error: 'No URLs provided' }, { status: 400 });
    }

    if (urls.length > 10000) {
      return NextResponse.json({ error: 'Max 10,000 URLs per request' }, { status: 400 });
    }

    const host = new URL(SITE_URL).hostname;

    const payload = {
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    };

    // Submit to multiple IndexNow endpoints (they share data with each other)
    const endpoints = [
      'https://api.indexnow.org/indexnow',
      'https://www.bing.com/indexnow',
    ];

    const results = await Promise.allSettled(
      endpoints.map((endpoint) =>
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(payload),
        })
      )
    );

    const summary = results.map((r, i) => ({
      endpoint: endpoints[i],
      status: r.status === 'fulfilled' ? r.value.status : 'error',
      ok: r.status === 'fulfilled' && (r.value.status === 200 || r.value.status === 202),
    }));

    const allOk = summary.every((s) => s.ok);

    console.log(`[IndexNow] Submitted ${urls.length} URLs:`, summary);

    return NextResponse.json({
      success: allOk,
      submitted: urls.length,
      results: summary,
    });
  } catch (err: any) {
    console.error('[IndexNow] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * GET /api/indexnow
 * Returns IndexNow status (useful for debugging)
 */
export async function GET() {
  return NextResponse.json({
    protocol: 'IndexNow',
    keyLocation: `${SITE_URL}/${process.env.INDEXNOW_KEY || 'bitebase-indexnow-key'}.txt`,
    sitemapUrl: `${SITE_URL}/sitemap.xml`,
    docs: 'https://www.indexnow.org/documentation',
  });
}
