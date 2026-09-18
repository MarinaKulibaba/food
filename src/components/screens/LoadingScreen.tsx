"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./LoadingScreen.module.css";
import type { Ingredient, RecipeSuggestion } from "@/lib/types";

type LoadingScreenProps = {
  selected: Ingredient[];
  recipes?: RecipeSuggestion[];
  ready?: boolean;
  onBack: () => void;
  onComplete?: () => void;
};

type Phase = "closed" | "steam" | "open" | "leaflet1" | "leaflet2";

const PHASE_MS = {
  closed: 650,
  steam: 1000,
  open: 850,
  leaflet1: 700,
  leaflet2: 900,
} as const;

export function LoadingScreen({
  selected,
  ready = false,
  onBack,
  onComplete,
}: LoadingScreenProps) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [done, setDone] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const timers: number[] = [];
    let t = 0;

    t += PHASE_MS.closed;
    timers.push(window.setTimeout(() => setPhase("steam"), t));

    t += PHASE_MS.steam;
    timers.push(window.setTimeout(() => setPhase("open"), t));

    t += PHASE_MS.open;
    timers.push(window.setTimeout(() => setPhase("leaflet1"), t));

    t += PHASE_MS.leaflet1;
    timers.push(window.setTimeout(() => setPhase("leaflet2"), t));

    t += PHASE_MS.leaflet2;
    timers.push(window.setTimeout(() => setDone(true), t));

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  useEffect(() => {
    if (!(done && ready) || completedRef.current) return;

    // Short beat so the last leaflet can settle, then go to results.
    const id = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete?.();
    }, 450);

    return () => window.clearTimeout(id);
  }, [done, ready, onComplete]);

  const showDrawn = phase === "leaflet1" || phase === "leaflet2";
  const showPhoto = phase === "leaflet2";

  return (
    <section
      className={`screen ${styles.screen}`}
      data-name="screen-loading"
      data-phase={phase}
    >
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={onBack}
          aria-label="Back"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/arrow-left.svg" alt="" width={20} height={20} />
        </button>
      </header>

      <div className={styles.body}>
        <div className={styles.stage} aria-hidden="true">
          <div
            className={`${styles.steam} ${
              phase === "steam" ||
              phase === "open" ||
              phase === "leaflet1" ||
              phase === "leaflet2"
                ? styles.steamOn
                : ""
            }`}
          >
            <span />
            <span />
            <span />
          </div>

          <div
            className={`${styles.glow} ${showDrawn ? styles.glowOn : ""}`}
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/loading/glow-burst.svg"
              alt=""
              className={styles.glowBurst}
              width={236}
              height={236}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/loading/glow-burst-light.svg"
              alt=""
              className={styles.glowBurstLight}
              width={236}
              height={236}
            />
          </div>

          <div className={styles.leaflets}>
            <div
              className={`${styles.leaflet} ${styles.leafletPhoto} ${
                showPhoto ? styles.leafletPhotoOn : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/loading/leaflet-photo.jpg"
                alt=""
                className={styles.leafletPhotoImg}
              />
            </div>

            <div
              className={`${styles.leaflet} ${styles.leafletDrawn} ${
                showDrawn ? styles.leafletDrawnOn : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/loading/leaflet-drawn.png"
                alt=""
                className={styles.leafletDrawnImg}
              />
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/loading/pot.png"
            alt=""
            className={styles.pot}
            width={200}
            height={110}
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/loading/lid.png"
            alt=""
            className={`${styles.lid} ${
              phase === "open" ||
              phase === "leaflet1" ||
              phase === "leaflet2"
                ? styles.lidOpen
                : ""
            }`}
            width={140}
            height={76}
          />
        </div>

        <div className={styles.message}>
          <h1 className={styles.title}>Cooking up ideas...</h1>
          <p className={styles.copy}>
            Our kitchen helper is matching your selected items to find the
            perfect recipes.
          </p>
        </div>

        <div className={styles.potBox}>
          <p className={styles.potLabel}>Adding to the pot:</p>
          <div className={styles.potChips}>
            {selected.map((item) => (
              <span key={item.id} className={styles.potChip}>
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
