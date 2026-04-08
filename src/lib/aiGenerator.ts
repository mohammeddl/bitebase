import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from './supabaseClient';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export interface GenerationResult {
  created: number;
  errors: number;
  details: string[];
}

/**
 * Generates and stores AI recipes in the database
 */
export async function generateAiRecipes(count: number = 1, theme: string = 'any'): Promise<GenerationResult> {
  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    throw new Error('Gemini API Key missing');
  }

  if (!supabaseAdmin) {
    throw new Error('Supabase Admin client not initialized');
  }

  const startTime = Date.now();
  const VERCEL_TIMEOUT = 9500; // 9.5 seconds to be safe (Hobby tier is 10s)

  const results: GenerationResult = {
    created: 0,
    errors: 0,
    details: []
  };

  console.log(`--- AI Multi-Generation Started: ${count} recipes (Theme: "${theme}") ---`);

  // To fit in 10s on Vercel Hobby, we MUST run them in parallel
  // However, Gemini/Pollinations might rate-limit if we do 20 at once.
  // We'll process in small parallel chunks or just all at once if count is small.
  const generateOne = async (index: number) => {
    // Check if we are running out of time
    if (Date.now() - startTime > VERCEL_TIMEOUT) {
      console.log(`Skipping recipe ${index + 1} due to timeout risk`);
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      
      // 1. Generate full recipe data using Gemini
      // Added a random seed to prevent duplicates and variety
      const randomSeed = Math.floor(Math.random() * 1000000);
      const prompt = `
        You are a Michelin-star chef. Create a unique, delicious, and professional recipe.
        Theme: ${theme === 'any' ? 'Surprise me with something creative' : theme}
        Random Seed: ${randomSeed}
        
        Respond ONLY with a valid JSON object in this exact format:
        {
          "title": "Recipe Name",
          "description": "Short appetizing description",
          "cook_time": "X mins",
          "prep_time": "X mins",
          "servings": "X",
          "difficulty": "Easy/Medium/Hard",
          "cuisine": "Cuisine type",
          "ingredients": [
            {"name": "ingredient name", "amount": "amount", "unit": "unit", "original": "full original line"}
          ],
          "instructions": [
            {"number": 1, "step": "step description"}
          ],
          "nutrition": {
            "calories": "X kcal",
            "protein": "Xg",
            "carbs": "Xg",
            "fat": "Xg"
          }
        }
      `;

      let recipeData;
      try {
        const chatResult = await model.generateContent(prompt);
        const text = chatResult.response.text();
        
        let jsonStr = text.trim();
        if (text.includes("```")) {
          const match = text.match(/```(?:json)?([\s\S]*?)```/);
          if (match && match[1]) {
            jsonStr = match[1].trim();
          }
        }
        recipeData = JSON.parse(jsonStr);
      } catch (geminiErr: any) {
        throw new Error(`Gemini Stage Failed: ${geminiErr.message}`);
      }

      // 2. Generate Image with Pollinations AI
      const imagePrompt = encodeURIComponent(`${recipeData.title}, professional food photography, cinematic lighting, top down view, high resolution, 4k`);
      const imageUrl = `https://image.pollinations.ai/prompt/${imagePrompt}?width=800&height=600&nologo=true`;
      
      let finalImageUrl = imageUrl;
      try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) throw new Error(`Image API returned ${imageResponse.status}`);
        
        const imageBuffer = await imageResponse.arrayBuffer();
        const fileName = `ai/${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;

        const { error: storageError } = await supabaseAdmin!
          .storage
          .from('recipe-images')
          .upload(fileName, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (storageError) throw storageError;

        const { data: publicUrlData } = supabaseAdmin!
          .storage
          .from('recipe-images')
          .getPublicUrl(fileName);
        finalImageUrl = publicUrlData.publicUrl;
      } catch (imgErr: any) {
        // We log image errors but don't fail the whole recipe (fallback to hotlinked image)
        console.warn(`Image processing warning for ${recipeData.title}:`, imgErr.message);
      }

      // 3. Save to Database
      const { data: inserted, error: dbError } = await supabaseAdmin!
        .from('recipes')
        .insert([{
          title: recipeData.title,
          image: finalImageUrl,
          description: recipeData.description,
          cook_time: recipeData.cook_time,
          prep_time: recipeData.prep_time,
          servings: recipeData.servings,
          difficulty: recipeData.difficulty,
          cuisine: recipeData.cuisine,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions,
          nutrition: recipeData.nutrition,
          external_id: Math.floor(1000000 + Math.random() * 9000000)
        }])
        .select()
        .single();

      if (dbError) {
        throw new Error(`Supabase DB Error: ${dbError.message}`);
      } else {
        results.created++;
        results.details.push(`Created: ${recipeData.title}`);
      }
    } catch (err: any) {
      const errMsg = err.message || 'Unknown error';
      console.error(`Error in recipe gen ${index}:`, errMsg);
      results.errors++;
      results.details.push(`Error in recipe ${index + 1}: ${errMsg}`);
    }
  };

  // Trigger all in parallel
  const tasks = Array.from({ length: count }, (_, i) => generateOne(i));
  await Promise.all(tasks);

  return results;
}
