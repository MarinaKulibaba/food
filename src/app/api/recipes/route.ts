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
  mood?: string;
};

function normalizeDifficulty(value: unknown): Difficulty {
  const text = String(value ?? "").toLowerCase();
  if (text.includes("hard") || text.includes("складн")) return "Hard";
  if (text.includes("medium") || text.includes("середн")) return "Medium";
  return "Easy";
}

function toSuggestions(recipes: AiRecipe[]): RecipeSuggestion[] {
  return recipes.slice(0, 3).map((recipe, index) => {
    const missing = Array.isArray(recipe.missingIngredients)
      ? recipe.missingIngredients.map(String).filter(Boolean).slice(0, 2)
      : [];

    return {
      id: `ai-${index + 1}`,
      name: recipe.name,
      description: recipe.description,
      cookTimeMinutes: Number(recipe.cookTimeMinutes) || 30,
      difficulty: normalizeDifficulty(recipe.difficulty),
      matchedIngredients: Array.isArray(recipe.matchedIngredients)
        ? recipe.matchedIngredients.map(String)
        : [],
      // First two dishes: fully covered. Third may need 1–2 buys.
      missingIngredients: index < 2 ? [] : missing,
      youtubeSearchUrl: youtubeTutorialUrl(recipe.name),
    };
  });
}

function buildSystemPrompt(language: string, diet: string, mood: string) {
  const useUkrainian =
    language.toLowerCase().includes("укр") ||
    language.toLowerCase().includes("ukrain");

  const langRule = useUkrainian
    ? "Write recipe names and descriptions in Ukrainian."
    : "Write recipe names and descriptions in English.";

  const dietRule = diet.trim()
    ? `Respect this dietary preference when possible: ${diet}.`
    : "No special dietary preference.";

  const moodParts = mood
    .split(/[,+|]/)
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
  const moodHints: string[] = [];
  if (moodParts.includes("quick")) {
    moodHints.push("Prefer quick recipes that take about 15 minutes or less.");
  }
  if (moodParts.includes("healthy")) {
    moodHints.push("Prefer light, fresh, healthy recipes.");
  }
  if (moodParts.includes("comforting")) {
    moodHints.push("Prefer cozy, comforting, warming recipes.");
  }
  const moodRule =
    moodHints.length > 0
      ? moodHints.join(" ")
      : "No special mood preference.";

  return `You are a helpful cooking assistant for the FooD fridge app.
Given ingredients the user has on hand, suggest exactly 3 recipes that best use those ingredients.
${langRule}
${dietRule}
${moodRule}
Recipe rules:
1) First recipe: use ONLY the user's ingredients. missingIngredients MUST be [].
2) Second recipe: also fully covered by the user's ingredients. missingIngredients MUST be [].
3) Third recipe: may need 1 or 2 extra pantry items the user does not have. Put those in missingIngredients (1–2 items max).
Prefer recipes that maximize matched ingredients.
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
  mood: string,
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
          content: buildSystemPrompt(language, diet, mood),
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
    const mood = String(body.mood ?? "quick").trim() || "quick";

    if (ingredients.length === 0) {
      return NextResponse.json(
        { error: "Select at least one ingredient." },
        { status: 400 },
      );
    }

    const aiRecipes = await fetchAiRecipes(ingredients, diet, language, mood);
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
