import { NextResponse } from "next/server";
import { buildMockRecipes } from "@/lib/mockRecipes";
import type { Difficulty, RecipeSuggestion, RecipesResponse } from "@/lib/types";
import { youtubeTutorialUrl } from "@/lib/youtube";

type AiRecipe = {
  name: string;
  description: string;
  cookTimeMinutes: number;
  difficulty: Difficulty;
  matchedIngredients: string[];
  missingIngredients: string[];
};

type RecipeRequestBody = {
  ingredients?: string[];
  diet?: string;
  language?: string;
};

function normalizeDifficulty(value: unknown): Difficulty {
  const text = String(value ?? "").toLowerCase();
  if (text.includes("hard") || text.includes("складн")) return "Hard";
  if (text.includes("medium") || text.includes("середн")) return "Medium";
  return "Easy";
}

function toSuggestions(recipes: AiRecipe[]): RecipeSuggestion[] {
  return recipes.slice(0, 5).map((recipe, index) => ({
    id: `ai-${index + 1}`,
    name: recipe.name,
    description: recipe.description,
    cookTimeMinutes: Number(recipe.cookTimeMinutes) || 30,
    difficulty: normalizeDifficulty(recipe.difficulty),
    matchedIngredients: Array.isArray(recipe.matchedIngredients)
      ? recipe.matchedIngredients.map(String)
      : [],
    missingIngredients: Array.isArray(recipe.missingIngredients)
      ? recipe.missingIngredients.map(String)
      : [],
    youtubeSearchUrl: youtubeTutorialUrl(recipe.name),
  }));
}

function buildSystemPrompt(language: string, diet: string) {
  const useUkrainian =
    language.toLowerCase().includes("укр") ||
    language.toLowerCase().includes("ukrain");

  const langRule = useUkrainian
    ? "Write recipe names and descriptions in Ukrainian."
    : "Write recipe names and descriptions in English.";

  const dietRule = diet.trim()
    ? `Respect this dietary preference when possible: ${diet}.`
    : "No special dietary preference.";

  return `You are a helpful cooking assistant for the FooD fridge app.
Given ingredients the user has on hand, suggest 3 to 5 recipes that best use those ingredients.
${langRule}
${dietRule}
Prefer recipes that maximize matched ingredients. Keep missingIngredients short (0-3 common pantry items).
Return ONLY valid JSON with this exact shape:
{
  "recipes": [
    {
      "name": "string",
      "description": "string (1-2 sentences)",
      "cookTimeMinutes": number,
      "difficulty": "Easy" | "Medium" | "Hard",
      "matchedIngredients": ["ingredients from the user's list that are used"],
      "missingIngredients": ["common pantry items needed that the user did not list"]
    }
  ]
}`;
}

async function fetchAiRecipes(
  ingredients: string[],
  diet: string,
  language: string,
): Promise<RecipeSuggestion[] | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(language, diet),
        },
        {
          role: "user",
          content: `Ingredients I have: ${ingredients.join(", ")}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    console.error("OpenAI error", response.status, await response.text());
    return null;
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    const parsed = JSON.parse(content) as { recipes?: AiRecipe[] };
    if (!Array.isArray(parsed.recipes) || parsed.recipes.length === 0) {
      return null;
    }
    return toSuggestions(parsed.recipes);
  } catch (error) {
    console.error("Failed to parse AI recipes JSON", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RecipeRequestBody;
    const ingredients = (body.ingredients ?? [])
      .map((item) => String(item).trim())
      .filter(Boolean);
    const diet = String(body.diet ?? "").trim();
    const language = String(body.language ?? "English").trim() || "English";

    if (ingredients.length === 0) {
      return NextResponse.json(
        { error: "Select at least one ingredient." },
        { status: 400 },
      );
    }

    const aiRecipes = await fetchAiRecipes(ingredients, diet, language);
    const payload: RecipesResponse = aiRecipes
      ? { recipes: aiRecipes, source: "ai" }
      : { recipes: buildMockRecipes(ingredients), source: "mock" };

    return NextResponse.json(payload);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not generate recipes." },
      { status: 500 },
    );
  }
}
