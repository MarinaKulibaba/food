"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageSection } from "@/components/layout/PageSection";
import { IngredientPicker } from "@/components/ingredients/IngredientPicker";
import { SelectedIngredientsBar } from "@/components/ingredients/SelectedIngredientsBar";
import { RecipeEmptyState } from "@/components/recipes/RecipeEmptyState";
import { RecipeList } from "@/components/recipes/RecipeList";
import { RecipeLoadingState } from "@/components/recipes/RecipeLoadingState";
import { useSelectedIngredients } from "@/hooks/useSelectedIngredients";
import type { RecipeSuggestion, RecipesResponse } from "@/lib/types";

export function HomePage() {
  const {
    selected,
    toggleIngredient,
    addCustomIngredient,
    removeIngredient,
    clearSelected,
    isSelected,
  } = useSelectedIngredients();

  const [recipes, setRecipes] = useState<RecipeSuggestion[]>([]);
  const [source, setSource] = useState<"ai" | "mock" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleFindRecipes() {
    if (selected.length === 0 || isLoading) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    document.getElementById("results")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: selected.map((item) => item.name),
        }),
      });

      const payload = (await response.json()) as RecipesResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Something went wrong.");
      }

      setRecipes(payload.recipes);
      setSource(payload.source);
    } catch (err) {
      setRecipes([]);
      setSource(null);
      setError(err instanceof Error ? err.message : "Could not find recipes.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="home">
      <AppHeader />

      <main className="home__main">
        <PageSection
          className="home__picker-section"
          title="Choose your ingredients"
          description="Browse by category, search, or add anything missing from the list."
        >
          <div className="home__picker-layout">
            <IngredientPicker
              isSelected={isSelected}
              onToggle={toggleIngredient}
              onAddCustom={addCustomIngredient}
            />
            <SelectedIngredientsBar
              selected={selected}
              onRemove={removeIngredient}
              onClear={clearSelected}
              onFindRecipes={handleFindRecipes}
              isLoading={isLoading}
            />
          </div>
        </PageSection>

        <PageSection
          id="results"
          className="home__results-section"
          title="Suggestions"
          description="Recipes tailored to what you already have."
        >
          {isLoading ? <RecipeLoadingState /> : null}

          {!isLoading && error ? (
            <div className="state-panel state-panel--error">
              <h3 className="state-panel__title">Couldn’t cook that up</h3>
              <p className="state-panel__copy">{error}</p>
            </div>
          ) : null}

          {!isLoading && !error && !hasSearched ? <RecipeEmptyState /> : null}

          {!isLoading && !error && hasSearched && recipes.length > 0 ? (
            <RecipeList recipes={recipes} source={source ?? undefined} />
          ) : null}

          {!isLoading && !error && hasSearched && recipes.length === 0 ? (
            <div className="state-panel">
              <h3 className="state-panel__title">No recipes found</h3>
              <p className="state-panel__copy">
                Try adding a few more ingredients and search again.
              </p>
            </div>
          ) : null}
        </PageSection>
      </main>
    </div>
  );
}
