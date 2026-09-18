"use client";

import styles from "./screens.module.css";
import type { Ingredient } from "@/lib/types";
import { IngredientPicker } from "@/components/ingredients/IngredientPicker";
import { IngredientChip } from "@/components/ingredients/IngredientChip";
import { Button } from "@/components/ui/Button";

type SelectionScreenProps = {
  selected: Ingredient[];
  isSelected: (id: string) => boolean;
  onToggle: (ingredient: Ingredient) => void;
  onAddCustom: (name: string) => boolean;
  onRemove: (id: string) => void;
  onClear: () => void;
  onBack: () => void;
  onFindRecipes: () => void;
};

export function SelectionScreen({
  selected,
  isSelected,
  onToggle,
  onAddCustom,
  onRemove,
  onClear,
  onBack,
  onFindRecipes,
}: SelectionScreenProps) {
  const count = selected.length;

  return (
    <section
      className={`screen ${styles.selectionScreen}`}
      data-name="screen-selection"
    >
      <header className={styles.selectionHeader}>
        <button
          type="button"
          className={styles.selectionBack}
          onClick={onBack}
          aria-label="Back"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/arrow-left.svg" alt="" width={16} height={16} />
          <span>Choose Ingredients</span>
        </button>
        <button
          type="button"
          className={styles.clearFridge}
          onClick={onClear}
          disabled={count === 0}
        >
          Clear Fridge
        </button>
      </header>

      <div className={`screen__scroll ${styles.selectionBody}`}>
        <IngredientPicker
          isSelected={isSelected}
          onToggle={onToggle}
          onAddCustom={onAddCustom}
          selectedSlot={
            count > 0 ? (
              <div className={styles.selectedBlock}>
                <h2 className={styles.selectedLabel}>Your Selected Items:</h2>
                <div className={styles.selectedChips}>
                  {selected.map((item) => (
                    <IngredientChip
                      key={item.id}
                      label={item.name}
                      removable
                      onRemove={() => onRemove(item.id)}
                    />
                  ))}
                </div>
              </div>
            ) : null
          }
        />
      </div>

      <div className={styles.stickyFooter}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={count === 0}
          onClick={onFindRecipes}
        >
          Find Recipes ({count} match{count === 1 ? "" : "es"})
        </Button>
      </div>
    </section>
  );
}
