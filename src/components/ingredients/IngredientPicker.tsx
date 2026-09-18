"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  INGREDIENT_CATEGORIES,
  PRESET_INGREDIENTS,
} from "@/data/ingredients";
import type { Ingredient } from "@/lib/types";
import { CustomIngredientInput } from "@/components/ingredients/CustomIngredientInput";
import { IngredientCategorySection } from "@/components/ingredients/IngredientCategorySection";
import { SearchInput } from "@/components/ui/SearchInput";

type IngredientPickerProps = {
  isSelected: (id: string) => boolean;
  onToggle: (ingredient: Ingredient) => void;
  onAddCustom: (name: string) => boolean;
  selectedSlot?: ReactNode;
};

export function IngredientPicker({
  isSelected,
  onToggle,
  onAddCustom,
  selectedSlot,
}: IngredientPickerProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return PRESET_INGREDIENTS;
    return PRESET_INGREDIENTS.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <div className="ingredient-picker">
      <SearchInput
        placeholder="Search or add custom ingredients..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <CustomIngredientInput onAdd={onAddCustom} />

      {selectedSlot}

      <div className="ingredient-picker__categories">
        {INGREDIENT_CATEGORIES.map((category) => (
          <IngredientCategorySection
            key={category.id}
            label={category.label}
            ingredients={filtered.filter(
              (ingredient) => ingredient.category === category.id,
            )}
            isSelected={isSelected}
            onToggle={onToggle}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="ingredient-picker__empty">
          No matches. Add it with the custom ingredient field above.
        </p>
      ) : null}
    </div>
  );
}
