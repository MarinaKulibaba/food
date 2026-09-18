import type { RecipeSuggestion } from "@/lib/types";
import { RecipeCard } from "@/components/recipes/RecipeCard";

type RecipeListProps = {
  recipes: RecipeSuggestion[];
  source?: "ai" | "mock";
};

export function RecipeList({ recipes, source }: RecipeListProps) {
  return (
    <div className="recipe-list">
      <div className="recipe-list__header">
        <h2 className="recipe-list__title">Recipe ideas</h2>
        {source ? (
          <p className="recipe-list__source">
            {source === "ai"
              ? "Generated for your ingredients"
              : "Demo suggestions (add OPENAI_API_KEY for live AI)"}
          </p>
        ) : null}
      </div>
      <div className="recipe-list__grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
