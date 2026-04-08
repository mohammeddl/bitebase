import { NextResponse } from 'next/server';
import { generateAiRecipes } from '@/lib/aiGenerator';

export async function POST(request: Request) {
  try {
    const { count = 1, theme = 'any' } = await request.json();
    
    const results = await generateAiRecipes(count, theme);

    return NextResponse.json({
      success: true,
      created: results.created,
      errors: results.errors,
      details: results.details
    });

  } catch (error: any) {
    console.error('AI Generator API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
