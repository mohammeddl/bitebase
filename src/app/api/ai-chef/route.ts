import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// We keep the API key on the server for security
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { ingredients, vibe } = await req.json();

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API Key missing. Please add GOOGLE_GEMINI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    const modelName = "gemini-flash-latest";
    const model = genAI.getGenerativeModel({ model: modelName });

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

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (modelError: any) {
      // If gemini-flash-latest is not found (404), fallback to gemini-pro-latest
      if (modelError.message?.includes("not found") || modelError.message?.includes("404")) {
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
        result = await fallbackModel.generateContent(prompt);
      } else {
        throw modelError;
      }
    }
    
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON from potential markdown blocks more robustly
    let jsonStr = text;
    if (text.includes("```")) {
      const match = text.match(/```(?:json)?([\s\S]*?)```/);
      if (match && match[1]) {
        jsonStr = match[1].trim();
      }
    }

    try {
      const recipe = JSON.parse(jsonStr);
      
      // Fetch the image SERVER-SIDE to bypass all adblockers and CORS issues
      try {
        const encodedQuery = encodeURIComponent(`${recipe.title}, stunning professional food photography, cinematic lighting, 4k`);
        const imgUrl = `https://image.pollinations.ai/prompt/${encodedQuery}?width=2070&height=800&nologo=true`;
        
        const imgResponse = await fetch(imgUrl);
        if (imgResponse.ok) {
          const arrayBuffer = await imgResponse.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const contentType = imgResponse.headers.get("content-type") || "image/jpeg";
          const base64Str = buffer.toString("base64");
          recipe.imageUrl = `data:${contentType};base64,${base64Str}`;
        }
      } catch (imgError) {
        console.error("Server-side image generation failed:", imgError);
        // Fallback to null, the frontend will handle it if needed
      }

      return NextResponse.json(recipe);
    } catch (parseError) {
      console.error("JSON Parse Error. Raw text:", text);
      return NextResponse.json(
        { error: "The AI returned an invalid format. Please try again.", raw: text },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to generate recipe. Your API key might not have access to this specific AI model yet.", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
