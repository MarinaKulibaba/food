"use client";

import styles from "./screens.module.css";
import type { RecipeSuggestion } from "@/lib/types";

type DetailScreenProps = {
  recipe: RecipeSuggestion;
  favorited?: boolean;
  onToggleFavorite?: () => void;
  onBack: () => void;
};

export function DetailScreen({
  recipe,
  favorited = false,
  onToggleFavorite,
  onBack,
}: DetailScreenProps) {
  const steps = [
    `Prep your main ingredients for ${recipe.name}.`,
    `Cook using ${recipe.matchedIngredients.slice(0, 3).join(", ") || "your selected items"} until fragrant and golden.`,
    `Finish and plate. Total time about ${recipe.cookTimeMinutes} minutes.`,
  ];

  return (
    <section className="screen" data-name="screen-detail">
      <div className={styles.detailHero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/detail/food-hero.jpg"
          alt=""
          className={styles.detailImage}
          width={390}
          height={220}
        />
        <button
          type="button"
          className={styles.floatingBack}
          onClick={onBack}
          aria-label="Back"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/arrow-left.svg" alt="" width={16} height={16} />
        </button>
        <button
          type="button"
          className={styles.floatingBookmark}
          onClick={onToggleFavorite}
          aria-label={favorited ? "Remove from Recipes" : "Save to Recipes"}
          aria-pressed={favorited}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              favorited
                ? "/figma/results/heart-active.svg"
                : "/figma/results/heart.svg"
            }
            alt=""
            width={16}
            height={16}
          />
        </button>
      </div>

      <div className={`screen__scroll ${styles.detailScroll}`}>
        <div>
          <h1 className={styles.detailTitle}>{recipe.name}</h1>
          <p className={styles.detailMeta}>
            <span>Prep: {recipe.cookTimeMinutes} mins</span>
            <span>Difficulty: {recipe.difficulty}</span>
          </p>
        </div>

        <article className={styles.checklistCard}>
          <h2>Ingredients Checklist</h2>
          <ul className={styles.checklist}>
            {recipe.matchedIngredients.map((item) => (
              <li key={`m-${item}`} className={styles.checkItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/figma/check.svg" alt="" width={14} height={14} />
                <span>{item}</span>
              </li>
            ))}
            {recipe.missingIngredients.map((item) => (
              <li key={`x-${item}`} className={styles.missingItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/figma/plus.svg" alt="" width={14} height={14} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <section>
          <h2 className={styles.stepsTitle}>Cooking Steps</h2>
          <ol className={styles.stepsList}>
            {steps.map((step, index) => (
              <li key={step} className={styles.stepRow}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <a
          href={recipe.youtubeSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn--primary btn--lg btn--full ${styles.videoLinkWrap}`}
        >
          Watch Step-by-Step Video
        </a>
      </div>
    </section>
  );
}
