import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Models to try in order
const MODEL_FALLBACKS = [
  "gemini-2.5-flash-preview-04-17",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
];

// Build list of available API keys (key rotation)
function getApiKeys(): string[] {
  const keys = [
    process.env.GOOGLE_GEMINI_API_KEY,
    process.env.GOOGLE_GEMINI_API_KEY_2,
    process.env.GOOGLE_GEMINI_API_KEY_3,
  ].filter((k): k is string => !!k && k.length > 0);
  return keys;
}

function isRateLimitError(err: any): boolean {
  const msg = err?.message?.toLowerCase() || "";
  return (
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("resource_exhausted")
  );
}

async function generateWithKeyRotation(prompt: string) {
  const apiKeys = getApiKeys();
  if (apiKeys.length === 0) throw new Error("NO_API_KEY");

  for (const apiKey of apiKeys) {
    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of MODEL_FALLBACKS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        console.log(`[ai-chef] ✅ Success with key ...${apiKey.slice(-6)}, model: ${modelName}`);
        return result;
      } catch (err: any) {
        if (isRateLimitError(err)) {
          console.warn(`[ai-chef] Rate limit on key ...${apiKey.slice(-6)}, model: ${modelName}. Trying next key...`);
          break; // Skip remaining models for this key, try next API key
        }
        console.warn(`[ai-chef] Model "${modelName}" failed:`, err.message);
        // Not a rate limit — try next model with same key
      }
    }
  }

  // All keys and models exhausted
  throw Object.assign(new Error("All API keys exhausted"), { isRateLimit: true });
}

export async function POST(req: Request) {
  try {
    const { ingredients, vibe } = await req.json();

    const apiKeys = getApiKeys();
    if (apiKeys.length === 0) {
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

    const result = await generateWithKeyRotation(prompt);
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
      } catch (imgError) {
        console.error("[ai-chef] Image generation failed:", imgError);
      }

      return NextResponse.json(recipe);
    } catch (parseError) {
      console.error("[ai-chef] JSON Parse Error. Raw text:", text);
      return NextResponse.json(
        { error: "Our chef got a bit creative and went off-script! Please try again." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[ai-chef] Generation Error:", error.message);

    const isRateLimit =
      error.isRateLimit ||
      isRateLimitError(error);

    return NextResponse.json(
      {
        error: isRateLimit
          ? "Our AI chef is resting after cooking too many recipes today! Come back in a few minutes and try again. 🍳"
          : "Our kitchen is a bit busy right now. Please try again in a moment!",
      },
      { status: 500 }
    );
  }
}
