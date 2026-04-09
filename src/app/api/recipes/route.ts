import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using secret key — bypasses RLS
function getServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const limit = Math.min(parseInt(searchParams.get('limit') || '8'), 50);
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const supabase = getServerSupabase();

    let dbQuery = supabase
      .from('recipes')
      .select('*')
      .range(offset, offset + limit - 1);

    // Filter by search query
    if (query.trim()) {
      dbQuery = dbQuery.ilike('title', `%${query}%`);
    }

    // Filter by category
    if (category && category !== 'all') {
      const catMap: Record<string, string> = {
        appetizers: 'Appetizer',
        appetizer: 'Appetizer',
        mains: 'Main Course',
        main: 'Main Course',
        vegetarian: 'Vegetarian',
        desserts: 'Dessert',
        dessert: 'Dessert',
        easy: 'Easy',
      };

      const mappedCat = catMap[category.toLowerCase()];
      if (mappedCat) {
        dbQuery = dbQuery.or(
          `cuisine.ilike.%${mappedCat}%,description.ilike.%${mappedCat}%`
        );
      }
    }

    const { data, error } = await dbQuery.order('created_at', { ascending: false });

    if (error) {
      console.error('[api/recipes] Supabase error:', error.message);
      return NextResponse.json({ recipes: [], error: error.message }, { status: 500 });
    }

    return NextResponse.json({ recipes: data || [] });
  } catch (err: any) {
    console.error('[api/recipes] Error:', err);
    return NextResponse.json({ recipes: [], error: err.message }, { status: 500 });
  }
}
