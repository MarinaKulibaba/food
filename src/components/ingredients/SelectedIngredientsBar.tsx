import type { Ingredient } from "@/lib/types";
import { IngredientChip } from "@/components/ingredients/IngredientChip";
import { Button } from "@/components/ui/Button";

type SelectedIngredientsBarProps = {
  selected: Ingredient[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onFindRecipes: () => void;
  isLoading?: boolean;
};

export function SelectedIngredientsBar({
  selected,
  onRemove,
  onClear,
  onFindRecipes,
  isLoading = false,
}: SelectedIngredientsBarProps) {
  const count = selected.length;

  return (
    <aside className="selected-bar" aria-live="polite">
      <div className="selected-bar__header">
        <div>
          <p className="selected-bar__eyebrow">Your kitchen</p>
          <h2 className="selected-bar__title">
            {count === 0
              ? "No ingredients selected"
              : `${count} ingredient${count === 1 ? "" : "s"} selected`}
          </h2>
        </div>
        {count > 0 ? (
          <Button variant="ghost" onClick={onClear}>
            Clear all
          </Button>
        ) : null}
      </div>

      {count > 0 ? (
        <div className="selected-bar__chips">
          {selected.map((ingredient) => (
            <IngredientChip
              key={ingredient.id}
              label={ingredient.name}
              removable
              onRemove={() => onRemove(ingredient.id)}
            />
          ))}
        </div>
      ) : (
        <p className="selected-bar__hint">
          Tap chips below to build your list, then find recipes that fit.
        </p>
      )}

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={onFindRecipes}
        disabled={count === 0 || isLoading}
      >
        {isLoading ? "Cooking up ideas…" : "Find Recipes"}
      </Button>
    </aside>
  );
}
