import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { getRandomRecipes, getRecipeById } from '@/lib/spoonacularAPI';

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase Admin client not initialized' }, { status: 500 });
  }

  try {
    console.log('--- Starting Single Recipe Import Test ---');

    // 1. Get a random recipe from Spoonacular (get full details)
    const randomResults = await getRandomRecipes(1);
    if (!randomResults || randomResults.length === 0) {
      return NextResponse.json({ error: 'No random recipes found' }, { status: 404 });
    }

    // Get the full details for the random recipe
    const recipe = await getRecipeById(randomResults[0].id);
    if (!recipe) {
      return NextResponse.json({ error: 'Could not fetch full recipe details' }, { status: 404 });
    }

    console.log(`Found recipe: ${recipe.title} (ID: ${recipe.id})`);

    // 2. Handle Image: Download from Spoonacular and Upload to Supabase Storage
    let finalImageUrl = recipe.image;
    try {
      const imageResponse = await fetch(recipe.image);
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageExt = recipe.image.split('.').pop() || 'jpg';
      const fileName = `${recipe.id}-${Date.now()}.${imageExt}`;

      const { data: storageData, error: storageError } = await supabaseAdmin
        .storage
        .from('recipe-images')
        .upload(fileName, imageBuffer, {
          contentType: `image/${imageExt}`,
          upsert: true
        });

      if (storageError) {
        console.error('Storage upload error:', storageError);
      } else {
        // Get the public URL
        const { data: publicUrlData } = supabaseAdmin
          .storage
          .from('recipe-images')
          .getPublicUrl(fileName);
        
        finalImageUrl = publicUrlData.publicUrl;
        console.log('Uploaded image to Supabase Storage:', finalImageUrl);
      }
    } catch (err) {
      console.error('Error processing image:', err);
      // Fallback: use the Spoonacular URL if upload fails
    }

    // 3. Map it to our database schema
    const newRecipe = {
      external_id: recipe.id,
      title: recipe.title,
      image: finalImageUrl,
      description: recipe.summary ? recipe.summary.replace(/<[^>]*>?/gm, '') : '', // Clean HTML
      cook_time: `${recipe.readyInMinutes} mins`,
      prep_time: '15 mins', // Static default for now
      servings: `${recipe.servings}`,
      difficulty: recipe.readyInMinutes > 45 ? 'Medium' : 'Easy',
      cuisine: recipe.cuisines?.[0] || 'International',
      ingredients: recipe.extendedIngredients, // JSONB handles objects
      instructions: recipe.analyzedInstructions, // JSONB handles objects
      nutrition: recipe.nutrition || {},
    };

    // 4. Save to the 'recipes' table
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('recipes')
      .insert([newRecipe])
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    console.log('--- Successfully imported 1 recipe! ---');

    return NextResponse.json({
      success: true,
      message: 'Recipe imported successfully with image storage!!',
      recipe: dbData
    });

  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
