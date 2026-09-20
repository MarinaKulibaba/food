"use client";

import styles from "./MoodPicker.module.css";
import {
  COOKING_MOODS,
  type CookingMood,
} from "@/lib/kitchenPrefs";
import type { Ingredient } from "@/lib/types";

type MoodPickerProps = {
  value: CookingMood[];
  onChange: (moods: CookingMood[]) => void;
};

function MoodIcon({
  mood,
  size = 14,
}: {
  mood: CookingMood;
  size?: number;
}) {
  if (mood === "quick") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 8v4.2l2.6 1.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (mood === "healthy") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 20c4.2-2.4 7-5.7 7-9.4C19 7.1 16.8 5 14.2 5c-1.5 0-2.8.7-3.6 1.8C9.8 5.7 8.5 5 7 5 4.4 5 2.2 7.1 2.2 10.6 2.2 14.3 5 17.6 9.2 20c.8.5 1.7.5 2.8 0Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
          transform="translate(1.4 0)"
        />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 10.5h14v2.2c0 3.6-2.8 6.5-6.3 6.8H11.3C7.8 19.2 5 16.3 5 12.7v-2.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 10.5V8.8A4 4 0 0 1 12 4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 10.5V8.8A4 4 0 0 0 12 4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  const selected = value.length > 0 ? value : (["quick"] as CookingMood[]);

  function toggleMood(mood: CookingMood) {
    if (selected.includes(mood)) {
      if (selected.length === 1) return;
      onChange(selected.filter((item) => item !== mood));
      return;
    }
    onChange([...selected, mood]);
  }

  return (
    <section className={styles.section} aria-label="Cooking mood">
      <div className={styles.head}>
        <h2 className={styles.title}>What feels right tonight?</h2>
        <p className={styles.copy}>
          Quick, healthy, or comforting — recipes will match your mood.
        </p>
      </div>

      <div className={styles.toggles} role="group" aria-label="Mood toggles">
        {COOKING_MOODS.map((mood) => {
          const active = selected.includes(mood.id);
          return (
            <button
              key={mood.id}
              type="button"
              aria-pressed={active}
              className={`${styles.toggle} ${active ? styles.toggleActive : ""}`}
              data-mood={mood.id}
              onClick={() => toggleMood(mood.id)}
            >
              <span className={styles.toggleIcon} aria-hidden="true">
                <MoodIcon mood={mood.id} />
              </span>
              <span className={styles.toggleLabel}>{mood.title}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

type MoodPotProps = {
  ingredients?: Ingredient[];
};

export function MoodPot({ ingredients = [] }: MoodPotProps) {
  const hasIngredients = ingredients.length > 0;

  return (
    <div
      className={styles.potStage}
      data-name="empty-state-recipes"
      aria-live="polite"
    >
      <div className={styles.potArt} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/pot-empty.png"
          alt=""
          className={styles.potBody}
          width={150}
          height={81}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/home/pot-lid.png"
          alt=""
          className={styles.potLid}
          width={120}
          height={65}
        />
      </div>

      <h3 className={styles.potTitle}>What do you have today?</h3>
      <p className={styles.potCopy}>
        {hasIngredients
          ? `${ingredients.length} product${ingredients.length === 1 ? "" : "s"} ready for recipes.`
          : 'Tap "Add to fridge" above or choose from the list to get started.'}
      </p>
    </div>
  );
}
