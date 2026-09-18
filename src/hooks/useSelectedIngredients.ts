"use client";

import { useCallback, useEffect, useState } from "react";
import type { Ingredient } from "@/lib/types";
import { slugifyIngredient } from "@/lib/youtube";

const STORAGE_KEY = "food.selectedIngredients";

function readStored(): Ingredient[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Ingredient[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useSelectedIngredients() {
  const [selected, setSelected] = useState<Ingredient[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSelected(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  }, [selected, hydrated]);

  const toggleIngredient = useCallback((ingredient: Ingredient) => {
    setSelected((current) => {
      const exists = current.some((item) => item.id === ingredient.id);
      if (exists) {
        return current.filter((item) => item.id !== ingredient.id);
      }
      return [...current, ingredient];
    });
  }, []);

  const addCustomIngredient = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    const id = `custom-${slugifyIngredient(trimmed)}`;
    setSelected((current) => {
      if (
        current.some(
          (item) =>
            item.id === id || item.name.toLowerCase() === trimmed.toLowerCase(),
        )
      ) {
        return current;
      }
      return [
        ...current,
        {
          id,
          name: trimmed,
          category: "condiments",
        },
      ];
    });
    return true;
  }, []);

  const addIngredients = useCallback((ingredients: Ingredient[]) => {
    if (ingredients.length === 0) return;
    setSelected((current) => {
      const next = [...current];
      for (const ingredient of ingredients) {
        const exists = next.some(
          (item) =>
            item.id === ingredient.id ||
            item.name.toLowerCase() === ingredient.name.toLowerCase(),
        );
        if (!exists) next.push(ingredient);
      }
      return next;
    });
  }, []);

  const removeIngredient = useCallback((id: string) => {
    setSelected((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearSelected = useCallback(() => {
    setSelected([]);
  }, []);

  const isSelected = useCallback(
    (id: string) => selected.some((item) => item.id === id),
    [selected],
  );

  return {
    selected,
    hydrated,
    toggleIngredient,
    addCustomIngredient,
    addIngredients,
    removeIngredient,
    clearSelected,
    isSelected,
  };
}
