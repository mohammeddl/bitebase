import { NextResponse } from 'next/server';
import { generateAiRecipes } from '@/lib/aiGenerator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get('secret');
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Security Check
    const isAuthorized = 
      (cronSecret && authHeader === `Bearer ${cronSecret}`) || 
      (cronSecret && querySecret === cronSecret);

    if (cronSecret && !isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Themes to rotate (optional, but makes the feed more interesting)
    const themes = ['Italian', 'Mexican', 'Asian', 'Healthy', 'Vegan', 'French', 'Mediterranean', 'Dessert', 'Seafood', 'Spicy'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    console.log(`Cron Job Started: Generating 10 recipes with theme "${randomTheme}"`);

    // Generate 10 recipes
    const results = await generateAiRecipes(10, randomTheme);

    return NextResponse.json({
      success: true,
      theme: randomTheme,
      created: results.created,
      errors: results.errors,
      details: results.details
    });

  } catch (error: any) {
    console.error('Cron Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
