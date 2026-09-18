export type IngredientCategoryId =
  | "proteins"
  | "vegetables"
  | "dairy"
  | "grains"
  | "condiments";

export type Ingredient = {
  id: string;
  name: string;
  category: IngredientCategoryId;
};

export type IngredientCategory = {
  id: IngredientCategoryId;
  label: string;
};

export type Difficulty = "Easy" | "Medium" | "Hard";

export type RecipeSuggestion = {
  id: string;
  name: string;
  description: string;
  cookTimeMinutes: number;
  difficulty: Difficulty;
  matchedIngredients: string[];
  missingIngredients: string[];
  youtubeSearchUrl: string;
};

export type RecipesResponse = {
  recipes: RecipeSuggestion[];
  source: "ai" | "mock";
};
