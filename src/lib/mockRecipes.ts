import type { Difficulty, RecipeSuggestion } from "@/lib/types";
import { youtubeTutorialUrl } from "@/lib/youtube";

function pickMatched(ingredients: string[], count: number): string[] {
  return ingredients.slice(0, Math.min(count, ingredients.length));
}

function pickMissing(used: string[], pool: string[]): string[] {
  return pool.filter((item) => !used.some((u) => u.toLowerCase() === item.toLowerCase())).slice(0, 2);
}

const TEMPLATES: Array<{
  name: (main: string) => string;
  description: (ingredients: string[]) => string;
  cookTimeMinutes: number;
  difficulty: Difficulty;
  extras: string[];
}> = [
  {
    name: (main) => `Skillet ${main} Supper`,
    description: (ingredients) =>
      `A one-pan weeknight dinner that leans on ${ingredients.slice(0, 3).join(", ")} for big flavor with minimal cleanup.`,
    cookTimeMinutes: 30,
    difficulty: "Easy",
    extras: ["olive oil", "salt", "black pepper"],
  },
  {
    name: (main) => `${main} Grain Bowl`,
    description: (ingredients) =>
      `Build a nourishing bowl around ${ingredients[0] ?? "your ingredients"}, then finish with a bright dressing.`,
    cookTimeMinutes: 25,
    difficulty: "Easy",
    extras: ["lemon", "olive oil", "garlic"],
  },
  {
    name: (main) => `Creamy ${main} Pasta`,
    description: (ingredients) =>
      `Comforting pasta tossed with ${ingredients.slice(0, 2).join(" and ")}, finished with a silky sauce.`,
    cookTimeMinutes: 35,
    difficulty: "Medium",
    extras: ["pasta", "garlic", "parmesan"],
  },
  {
    name: (main) => `Roasted ${main} Tray Bake`,
    description: (ingredients) =>
      `Everything roasts together so ${ingredients.slice(0, 3).join(", ")} caramelize into a hands-off dinner.`,
    cookTimeMinutes: 45,
    difficulty: "Easy",
    extras: ["potato", "onion", "olive oil"],
  },
  {
    name: (main) => `Spiced ${main} Stir-Fry`,
    description: (ingredients) =>
      `Hot wok energy: crisp vegetables and ${ingredients[0] ?? "protein"} finished with a savory glaze.`,
    cookTimeMinutes: 20,
    difficulty: "Medium",
    extras: ["soy sauce", "ginger", "garlic"],
  },
];

export function buildMockRecipes(ingredients: string[]): RecipeSuggestion[] {
  const normalized = ingredients.map((item) => item.trim()).filter(Boolean);
  if (normalized.length === 0) return [];

  const main = normalized[0];
  const count = Math.min(5, Math.max(3, Math.ceil(normalized.length / 2) + 2));

  return TEMPLATES.slice(0, count).map((template, index) => {
    const matched = pickMatched(normalized, Math.min(4, normalized.length));
    const missing = pickMissing([...matched, ...normalized], template.extras);
    const name = template.name(main);

    return {
      id: `mock-${index + 1}`,
      name,
      description: template.description(normalized),
      cookTimeMinutes: template.cookTimeMinutes + index * 2,
      difficulty: template.difficulty,
      matchedIngredients: matched,
      missingIngredients: missing,
      youtubeSearchUrl: youtubeTutorialUrl(name),
    };
  });
}
