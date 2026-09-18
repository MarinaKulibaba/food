"use client";

import styles from "./screens.module.css";
import type { RecipeSuggestion } from "@/lib/types";
import { RecipeCard } from "@/components/recipes/RecipeCard";

type FavoritesScreenProps = {
  favorites: RecipeSuggestion[];
  onToggleFavorite: (recipe: RecipeSuggestion) => void;
  onOpenRecipe: (recipe: RecipeSuggestion) => void;
  onFindRecipes: () => void;
};

const RECIPE_IMAGES = [
  "/figma/results/food-pizza.jpg",
  "/figma/results/food-omelette.jpg",
];

export function FavoritesScreen({
  favorites,
  onToggleFavorite,
  onOpenRecipe,
  onFindRecipes,
}: FavoritesScreenProps) {
  return (
    <section className="screen screen--alt" data-name="screen-favorites">
      <header className={styles.resultsHeader}>
        <h1 className={styles.favoritesTitle}>Recipes</h1>
        <span className={styles.foundCountMuted}>
          {favorites.length} saved
        </span>
      </header>

      <div className={`screen__scroll ${styles.resultsScroll}`}>
        {favorites.length === 0 ? (
          <div className="state-panel">
            <h3 className="state-panel__title">No liked recipes yet</h3>
            <p className="state-panel__copy">
              Tap the heart next to a recipe title to save it here.
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={onFindRecipes}
              style={{ marginTop: 12 }}
            >
              Find Recipes
            </button>
          </div>
        ) : (
          <div className="recipe-list">
            {favorites.map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                imageSrc={RECIPE_IMAGES[index % RECIPE_IMAGES.length]}
                favorited
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
