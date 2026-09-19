"use client";

import { useMemo } from "react";
import styles from "./screens.module.css";
import type { Ingredient } from "@/lib/types";
import { FridgeItemTile } from "@/components/ingredients/FridgeItemTile";
import {
  FRIDGE_CATALOG,
  isFridgeCatalogItem,
} from "@/data/fridgeIcons";

type HomeScreenProps = {
  kitchenName?: string;
  selected: Ingredient[];
  onAddIngredients: () => void;
  onAddMore: () => void;
  onToggle: (ingredient: Ingredient) => void;
  onFindRecipes: () => void;
  onOpenSettings: () => void;
};

export function HomeScreen({
  kitchenName = "Marina's Kitchen",
  selected,
  onAddIngredients,
  onAddMore,
  onToggle,
  onFindRecipes,
  onOpenSettings,
}: HomeScreenProps) {
  const count = selected.length;
  const isEmpty = count === 0;

  const extras = useMemo(
    () => selected.filter((item) => !isFridgeCatalogItem(item)),
    [selected],
  );

  function isSelected(ingredient: Ingredient) {
    return selected.some(
      (item) =>
        item.id === ingredient.id ||
        item.name.toLowerCase() === ingredient.name.toLowerCase(),
    );
  }

  return (
    <section className={`screen ${styles.homeScreen}`} data-name="screen-home">
      <header className={styles.homeHeader}>
        <div className={styles.greetingBlock}>
          <p className={styles.greeting}>Good morning!</p>
          <h1 className={styles.homeTitle}>{kitchenName}</h1>
        </div>

        <button
          type="button"
          className={styles.settingsHang}
          aria-label="Settings"
          onClick={onOpenSettings}
        >
          <span className={styles.settingsCord} aria-hidden="true" />
          <span className={styles.settingsOrnament} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/figma/home/ornament-body.svg" alt="" />
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/home/settings.svg"
            alt=""
            className={styles.settingsGear}
            width={16}
            height={15}
          />
        </button>
      </header>

      <div className={`screen__scroll ${styles.homeScroll}`}>
        <article className={styles.banner}>
          <div className={styles.bannerText}>
            <h2>Step 1: your fridge</h2>
            <p>Tap what you have at home. Then press Find Recipes.</p>
            <div className={styles.bannerActions}>
              <button
                type="button"
                className={styles.bannerCta}
                onClick={onAddIngredients}
              >
                Add to fridge
              </button>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/refrigerator.png"
            alt=""
            className={styles.bannerArt}
            width={80}
            height={100}
          />
        </article>

        {isEmpty ? (
          <p className={styles.conceptHint} role="note">
            1) Add products &nbsp;→&nbsp; 2) Find Recipes &nbsp;→&nbsp; 3) Cook
          </p>
        ) : null}

        <section className={styles.fridgeSection}>
          <div className={styles.sectionHead}>
            <h2>Your Fridge Items ({count})</h2>
            <p>
              {isEmpty
                ? "Select products below or tap Add to fridge"
                : `${count} selected — ready for recipes`}
            </p>
          </div>

          <div className={styles.fridgeRail} data-name="chips-list">
            {FRIDGE_CATALOG.map((item) => (
              <FridgeItemTile
                key={item.id}
                name={item.name}
                selected={isSelected(item)}
                onClick={() => onToggle(item)}
              />
            ))}

            {extras.map((item) => (
              <FridgeItemTile
                key={item.id}
                name={item.name}
                selected
                onClick={() => onToggle(item)}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.addMoreBtn}
            onClick={onAddMore}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/figma/plus-orange.svg" alt="" width={10} height={10} />
            Add More
          </button>

          {count > 0 ? (
            <button
              type="button"
              className={styles.findRecipesBtn}
              onClick={onFindRecipes}
            >
              Find Recipes
            </button>
          ) : null}

          {isEmpty ? (
            <div className={styles.emptyState} data-name="empty-state-recipes">
              <div className={styles.emptyArt} aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/pot-empty.png"
                  alt=""
                  className={styles.emptyPot}
                  width={150}
                  height={81}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/home/pot-lid.png"
                  alt=""
                  className={styles.emptyLid}
                  width={120}
                  height={65}
                />
              </div>
              <h3 className={styles.emptyTitle}>Start here</h3>
              <p className={styles.emptyCopy}>
                Pick food from the row above, or tap{" "}
                <strong>Add to fridge</strong> for more products.
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </section>
  );
}
