"use client";

import styles from "./screens.module.css";
import type { Ingredient, RecipeSuggestion } from "@/lib/types";
import { RecipeCard } from "@/components/recipes/RecipeCard";

type ResultsScreenProps = {
  recipes: RecipeSuggestion[];
  selected: Ingredient[];
  source?: "ai" | "mock" | null;
  error?: string | null;
  isFavorite: (recipeId: string) => boolean;
  onToggleFavorite: (recipe: RecipeSuggestion) => void;
  onBack: () => void;
  onOpenRecipe: (recipe: RecipeSuggestion) => void;
};

const RECIPE_IMAGES = [
  "/figma/results/food-pizza.jpg",
  "/figma/results/food-omelette.jpg",
];

export function ResultsScreen({
  recipes,
  selected,
  source,
  error,
  isFavorite,
  onToggleFavorite,
  onBack,
  onOpenRecipe,
}: ResultsScreenProps) {
  return (
    <section className="screen screen--alt" data-name="screen-results">
      <header className={styles.resultsHeader}>
        <button
          type="button"
          className={styles.resultsBack}
          onClick={onBack}
          aria-label="Back"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/arrow-left.svg" alt="" width={16} height={16} />
          <span>Your Recipes</span>
        </button>
        <span className={styles.foundCountMuted}>{recipes.length} found</span>
      </header>

      <div className={`screen__scroll ${styles.resultsScroll}`}>
        <div className={styles.usingRow}>
          <span className={styles.usingLabel}>Using:</span>
          <div className={styles.usingChips}>
            {selected.map((item) => (
              <span key={item.id} className={styles.usingChip}>
                {item.name}
              </span>
            ))}
          </div>
        </div>

        {source === "mock" ? (
          <p className={styles.sourceNote}>
            Demo suggestions — add OPENAI_API_KEY to .env.local for live AI.
          </p>
        ) : source === "ai" ? (
          <p className={styles.sourceNote}>Powered by AI from your fridge.</p>
        ) : null}

        {error ? (
          <div className="state-panel">
            <h3 className="state-panel__title">Couldn’t cook that up</h3>
            <p className="state-panel__copy">{error}</p>
          </div>
        ) : (
          <div className="recipe-list">
            {recipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                imageSrc={RECIPE_IMAGES[index % RECIPE_IMAGES.length]}
                favorited={isFavorite(recipe.id)}
                onToggleFavorite={onToggleFavorite}
                onOpen={() => onOpenRecipe(recipe)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
