import type { Ingredient } from "@/lib/types";
import { FridgeItemTile } from "@/components/ingredients/FridgeItemTile";
import { IngredientChip } from "@/components/ingredients/IngredientChip";

type IngredientCategorySectionProps = {
  label: string;
  ingredients: Ingredient[];
  isSelected: (id: string) => boolean;
  onToggle: (ingredient: Ingredient) => void;
  variant?: "tiles" | "chips";
};

export function IngredientCategorySection({
  label,
  ingredients,
  isSelected,
  onToggle,
  variant = "chips",
}: IngredientCategorySectionProps) {
  if (ingredients.length === 0) return null;

  return (
    <section className="ingredient-category" aria-label={label}>
      <h3 className="ingredient-category__title">{label}</h3>
      {variant === "tiles" ? (
        <div className="ingredient-category__tiles">
          {ingredients.map((ingredient) => (
            <FridgeItemTile
              key={ingredient.id}
              name={ingredient.name}
              selected={isSelected(ingredient.id)}
              onClick={() => onToggle(ingredient)}
            />
          ))}
        </div>
      ) : (
        <div className="ingredient-category__chips">
          {ingredients.map((ingredient) => (
            <IngredientChip
              key={ingredient.id}
              label={ingredient.name}
              selected={isSelected(ingredient.id)}
              onClick={() => onToggle(ingredient)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
