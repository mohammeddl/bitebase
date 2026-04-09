import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

// Try models in order — automatically falls back if one is unavailable
const MODEL_FALLBACKS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-pro",
];

async function generateWithFallback(prompt: string) {
  let lastError: any;
  for (const modelName of MODEL_FALLBACKS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result;
    } catch (err: any) {
      console.warn(`[ai-chef] Model "${modelName}" failed:`, err.message);
      lastError = err;
    }
  }
  throw lastError;
}

export async function POST(req: Request) {
  try {
    const { ingredients, vibe } = await req.json();

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
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
      if (match && match[1]) {
        jsonStr = match[1].trim();
      }
    }

    try {
      const recipe = JSON.parse(jsonStr);

      // Fetch the image SERVER-SIDE to bypass adblockers and CORS issues
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
        // Non-fatal — recipe still works without image
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
    // Log technical details server-side only — never expose to user
    console.error("[ai-chef] Generation Error:", error.message);
    return NextResponse.json(
      { error: "Our kitchen is a bit busy right now. Please try again in a moment!" },
      { status: 500 }
    );
  }
}
