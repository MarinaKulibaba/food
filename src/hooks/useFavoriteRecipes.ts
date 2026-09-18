"use client";

import { useCallback, useEffect, useState } from "react";
import type { RecipeSuggestion } from "@/lib/types";

const FAVORITES_KEY = "food.favoriteRecipes";

function readFavorites(): RecipeSuggestion[] {
  try {
    const raw = sessionStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecipeSuggestion[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFavorites(recipes: RecipeSuggestion[]) {
  sessionStorage.setItem(FAVORITES_KEY, JSON.stringify(recipes));
}

export function useFavoriteRecipes() {
  const [favorites, setFavorites] = useState<RecipeSuggestion[]>([]);

  useEffect(() => {
    setFavorites(readFavorites());
  }, []);

  const isFavorite = useCallback(
    (recipeId: string) => favorites.some((recipe) => recipe.id === recipeId),
    [favorites],
  );

  const toggleFavorite = useCallback((recipe: RecipeSuggestion) => {
    setFavorites((current) => {
      const exists = current.some((item) => item.id === recipe.id);
      const next = exists
        ? current.filter((item) => item.id !== recipe.id)
        : [recipe, ...current.filter((item) => item.id !== recipe.id)];
      writeFavorites(next);
      return next;
    });
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
