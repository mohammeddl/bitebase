import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// gemini-flash-latest = gemini-3-flash (was working before)
const MODEL = "gemini-flash-latest";

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

// Try each API key in order — if one is rate limited, the next one takes over
async function generateWithKeyRotation(prompt: string) {
  const apiKeys = getApiKeys();
  if (apiKeys.length === 0) throw new Error("NO_API_KEY");

  for (const apiKey of apiKeys) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: MODEL });
      const result = await model.generateContent(prompt);
      console.log(`[ai-chef] ✅ Success with key ...${apiKey.slice(-6)}`);
      return result;
    } catch (err: any) {
      if (isRateLimitError(err)) {
        console.warn(`[ai-chef] Rate limit on key ...${apiKey.slice(-6)}, trying next key...`);
        continue; // Try next key
      }
      throw err; // Non-rate-limit error — don't retry
    }
  }

  throw Object.assign(new Error("All keys rate limited"), { isRateLimit: true });
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
    console.error("[ai-chef] Error:", error.message);

    const isRateLimit = error.isRateLimit || isRateLimitError(error);

    return NextResponse.json(
      {
        error: isRateLimit
          ? "Our AI chef is resting after cooking too many recipes today! Try again in a few minutes. 🍳"
          : "Our kitchen is a bit busy right now. Please try again in a moment!",
      },
      { status: 500 }
    );
  }
}
