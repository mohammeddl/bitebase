import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Try models in order — each model has its own independent daily quota
// gemini-1.5-flash has a SEPARATE quota from gemini-2.0-flash
const MODEL_FALLBACKS = [
  "gemini-1.5-flash",        // Separate quota — most reliable
  "gemini-1.5-flash-latest", // Alias, sometimes different bucket
  "gemini-2.0-flash",        // Newer, but shares quota with gemini-3-flash
  "gemini-2.0-flash-lite",   // Lightweight fallback
];

function getApiKeys(): string[] {
  return [
    process.env.GOOGLE_GEMINI_API_KEY,
    process.env.GOOGLE_GEMINI_API_KEY_2,
    process.env.GOOGLE_GEMINI_API_KEY_3,
  ].filter((k): k is string => !!k && k.length > 0);
}

function isRateLimitError(err: any): boolean {
  const msg = (err?.message || "").toLowerCase();
  return (
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("resource_exhausted") ||
    msg.includes("too many requests")
  );
}

/**
 * Strategy: iterate models first, then keys.
 * A rate limit is per-model-per-day, so if gemini-2.0-flash is exhausted
 * on key1, it will also be exhausted on key2. Move to the NEXT MODEL instead.
 */
async function generateWithFallback(prompt: string) {
  const apiKeys = getApiKeys();

  for (const modelName of MODEL_FALLBACKS) {
    for (const apiKey of apiKeys) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        console.log(`[ai-chef] ✅ Success: model=${modelName}, key=...${apiKey.slice(-6)}`);
        return result;
      } catch (err: any) {
        if (isRateLimitError(err)) {
          // Rate limited on this model — try next key, but if all keys fail we'll move to next model
          console.warn(`[ai-chef] Rate limit: model=${modelName}, key=...${apiKey.slice(-6)}`);
          continue;
        }
        if (err.message?.includes("404") || err.message?.includes("not found")) {
          // Model not available for this key — skip both model and remaining keys
          console.warn(`[ai-chef] Model not found: ${modelName}`);
          break; // break inner key loop, try next model
        }
        // Other error — log and try next key
        console.warn(`[ai-chef] Error: model=${modelName}, key=...${apiKey.slice(-6)}:`, err.message);
      }
    }
    // If we get here, all keys failed for this model — move to next model
    console.warn(`[ai-chef] All keys failed for model=${modelName}, trying next model...`);
  }

  throw new Error("All models and API keys exhausted");
}

export async function POST(req: Request) {
  try {
    const { ingredients, vibe } = await req.json();

    if (getApiKeys().length === 0) {
      return NextResponse.json(
        { error: "Our kitchen is taking a quick break. Please try again in a moment!" },
        { status: 500 }
      );
    }

    const prompt = `
      You are an expert chef. Create a unique recipe using these ingredients: ${ingredients.join(", ")}. 
      The vibe of the recipe should be "${vibe}".
      
      Respond ONLY with a JSON object in this exact format:
      {
        "title": "Creative Recipe Name",
        "cookingTime": "X minutes",
        "difficulty": "Easy/Medium/Hard",
        "description": "Short appetizing description",
        "ingredients": ["item 1", "item 2"],
        "instructions": ["step 1", "step 2"],
        "servingSuggestion": "Optional tip"
      }
    `;

    const result = await generateWithFallback(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean JSON from potential markdown blocks
    let jsonStr = text;
    if (text.includes("```")) {
      const match = text.match(/```(?:json)?([\s\S]*?)```/);
      if (match && match[1]) jsonStr = match[1].trim();
    }

    try {
      const recipe = JSON.parse(jsonStr);

      // Fetch image server-side to bypass adblockers and CORS
      try {
        const encodedQuery = encodeURIComponent(
          `${recipe.title}, stunning professional food photography, cinematic lighting, 4k`
        );
        const imgUrl = `https://image.pollinations.ai/prompt/${encodedQuery}?width=2070&height=800&nologo=true`;
        const imgResponse = await fetch(imgUrl);
        if (imgResponse.ok) {
          const arrayBuffer = await imgResponse.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const contentType = imgResponse.headers.get("content-type") || "image/jpeg";
          recipe.imageUrl = `data:${contentType};base64,${buffer.toString("base64")}`;
        }
      } catch {
        // Image fetch failed — recipe still works without image
      }

      return NextResponse.json(recipe);
    } catch {
      return NextResponse.json(
        { error: "Our chef got a bit creative and went off-script! Please try again." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[ai-chef] Final error:", error.message);

    const isRateLimit = isRateLimitError(error) || error.message?.includes("exhausted");

    return NextResponse.json(
      {
        error: isRateLimit
          ? "Our AI chef is taking a well-deserved break after cooking so many recipes! Please try again in a few minutes. 🍳"
          : "Our kitchen is a bit busy right now. Please try again in a moment!",
      },
      { status: 500 }
    );
  }
}
