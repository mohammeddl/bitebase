import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { searchRecipesByCategory, getRecipeById } from '@/lib/spoonacularAPI';

export async function POST(request: Request) {
  try {
    const { count = 10, category = 'all' } = await request.json();
    
    console.log(`--- Starting Bulk Import: ${count} recipes from category "${category}" ---`);

    // 1. Fetch search results from Spoonacular
    // Note: Spoonacular's complexSearch returns basic info. We need full info for each.
    const searchResults = await searchRecipesByCategory(category, count);
    
    if (!searchResults || searchResults.length === 0) {
      return NextResponse.json({ success: true, imported: 0, skipped: 0, message: 'No recipes found for this category.' });
    }

    const results = {
      imported: 0,
      skipped: 0,
      errors: 0,
      details: [] as string[]
    };

    // 2. Process each recipe
    for (const item of searchResults) {
      try {
        // Check if already exists to avoid API calls and storage costs
        const { data: existing } = await supabaseAdmin!
          .from('recipes')
          .select('id')
          .eq('external_id', item.id)
          .maybeSingle();

        if (existing) {
          results.skipped++;
          results.details.push(`Skipped: ${item.title} (Already exists)`);
          continue;
        }

        // Fetch full details
        const recipe = await getRecipeById(item.id);
        if (!recipe) {
          results.errors++;
          continue;
        }

        // Handle Image Storage
        let finalImageUrl = recipe.image;
        try {
          const imageResponse = await fetch(recipe.image);
          const imageBuffer = await imageResponse.arrayBuffer();
          const imageExt = recipe.image.split('.').pop() || 'jpg';
          const fileName = `bulk/${recipe.id}-${Date.now()}.${imageExt}`;

          const { data: storageData, error: storageError } = await supabaseAdmin!
            .storage
            .from('recipe-images')
            .upload(fileName, imageBuffer, {
              contentType: `image/${imageExt}`,
              upsert: true
            });

          if (!storageError) {
            const { data: publicUrlData } = supabaseAdmin!
              .storage
              .from('recipe-images')
              .getPublicUrl(fileName);
            finalImageUrl = publicUrlData.publicUrl;
          }
        } catch (imgErr) {
          console.error(`Image error for ${recipe.id}:`, imgErr);
          // Fallback to original URL
        }

        // Insert into DB
        const newRecipe = {
          external_id: recipe.id,
          title: recipe.title,
          image: finalImageUrl,
          description: recipe.summary ? recipe.summary.replace(/<[^>]*>?/gm, '') : '',
          cook_time: `${recipe.readyInMinutes} mins`,
          prep_time: '15 mins',
          servings: `${recipe.servings}`,
          difficulty: recipe.readyInMinutes > 45 ? 'Medium' : 'Easy',
          cuisine: recipe.cuisines?.[0] || 'International',
          ingredients: recipe.extendedIngredients,
          instructions: recipe.analyzedInstructions,
          nutrition: recipe.nutrition || {},
        };

        const { error: insertError } = await supabaseAdmin!
          .from('recipes')
          .insert([newRecipe]);

        if (insertError) {
          console.error(`DB error for ${recipe.id}:`, insertError);
          results.errors++;
        } else {
          results.imported++;
          results.details.push(`Imported: ${recipe.title}`);
        }

      } catch (innerErr) {
        console.error(`Error processing recipe ${item.id}:`, innerErr);
        results.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      imported: results.imported,
      skipped: results.skipped,
      errors: results.errors,
      details: results.details
    });

  } catch (error: any) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
