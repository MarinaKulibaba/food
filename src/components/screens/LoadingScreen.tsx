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

type Phase =
  | "closed"
  | "steam"
  | "open"
  | "appear"
  | "drawnFront"
  | "swapped"
  | "ready";

const PHASE_MS = {
  closed: 600,
  steam: 900,
  open: 800,
  appear: 750,
  drawnFront: 1100,
  swapped: 900,
} as const;

export function LoadingScreen({
  selected,
  recipes = [],
  ready = false,
  onBack,
  onComplete,
}: LoadingScreenProps) {
  const [phase, setPhase] = useState<Phase>("closed");
  const completedRef = useRef(false);

  useEffect(() => {
    const timers: number[] = [];
    let t = 0;

    t += PHASE_MS.closed;
    timers.push(window.setTimeout(() => setPhase("steam"), t));

    t += PHASE_MS.steam;
    timers.push(window.setTimeout(() => setPhase("open"), t));

    t += PHASE_MS.open;
    timers.push(window.setTimeout(() => setPhase("appear"), t));

    t += PHASE_MS.appear;
    timers.push(window.setTimeout(() => setPhase("drawnFront"), t));

    t += PHASE_MS.drawnFront;
    timers.push(window.setTimeout(() => setPhase("swapped"), t));

    t += PHASE_MS.swapped;
    timers.push(window.setTimeout(() => setPhase("ready"), t));

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  function finish() {
    if (completedRef.current) return;
    if (!ready || phase !== "ready") return;
    completedRef.current = true;
    onComplete?.();
  }

  const lidUp =
    phase === "open" ||
    phase === "appear" ||
    phase === "drawnFront" ||
    phase === "swapped" ||
    phase === "ready";

  const cardsVisible =
    phase === "appear" ||
    phase === "drawnFront" ||
    phase === "swapped" ||
    phase === "ready";

  const swapped = phase === "swapped" || phase === "ready";
  const interactive = phase === "ready" && ready;
  const waitingForAi = phase === "ready" && !ready;

  const primaryName = recipes[0]?.name ?? "Mushroom Pizza";
  const secondaryName = recipes[1]?.name ?? "Veggie Omelette";

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
        <div className={styles.stage}>
          <div
            className={`${styles.steam} ${lidUp ? styles.steamOn : ""}`}
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </div>

          <div
            className={`${styles.glow} ${cardsVisible ? styles.glowOn : ""}`}
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
            <button
              type="button"
              className={[
                styles.leaflet,
                styles.leafletPhoto,
                cardsVisible ? styles.leafletVisible : "",
                phase === "appear" ? styles.leafletPhotoAppear : "",
                phase === "drawnFront" ? styles.leafletPhotoBack : "",
                swapped ? styles.leafletPhotoSwapped : "",
                interactive ? styles.leafletInteractive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={finish}
              disabled={!interactive}
              aria-label={
                interactive
                  ? `Open recipes — ${secondaryName}`
                  : secondaryName
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/loading/leaflet-photo.jpg"
                alt=""
                className={styles.leafletPhotoImg}
              />
            </button>

            <button
              type="button"
              className={[
                styles.leaflet,
                styles.leafletDrawn,
                cardsVisible ? styles.leafletVisible : "",
                phase === "appear" ? styles.leafletDrawnAppear : "",
                phase === "drawnFront" ? styles.leafletDrawnFront : "",
                swapped ? styles.leafletDrawnSwapped : "",
                interactive ? styles.leafletInteractive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={finish}
              disabled={!interactive}
              aria-label={
                interactive ? `Open recipes — ${primaryName}` : primaryName
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/loading/leaflet-drawn.png"
                alt=""
                className={styles.leafletDrawnImg}
              />
            </button>
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
            className={`${styles.lid} ${lidUp ? styles.lidOpen : ""}`}
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
          {interactive ? (
            <p className={styles.tapHint}>Tap a recipe card to continue</p>
          ) : null}
          {waitingForAi ? (
            <p className={styles.tapHint}>Almost ready…</p>
          ) : null}
        </div>

        <button
          type="button"
          className={`${styles.potBox} ${
            interactive ? styles.potBoxInteractive : ""
          }`}
          onClick={finish}
          disabled={!interactive}
          aria-label="Open recipes for selected ingredients"
        >
          <p className={styles.potLabel}>Adding to the pot:</p>
          <div className={styles.potChips}>
            {selected.map((item) => (
              <span key={item.id} className={styles.potChip}>
                {item.name}
              </span>
            ))}
          </div>
        </button>
      </div>
    </section>
  );
}
