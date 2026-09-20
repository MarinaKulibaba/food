"use client";

import { useMemo, useRef, useState } from "react";
import styles from "./AddIngredientsScreen.module.css";
import { fridgeIconFor } from "@/data/fridgeIcons";
import {
  mockFridgeScan,
  type FridgeScanResult,
} from "@/lib/fridgeScan";
import type { Ingredient } from "@/lib/types";

type AddIngredientsScreenProps = {
  onBack: () => void;
  onChoosePantry: () => void;
  onConfirmDetected: (ingredients: Ingredient[]) => void;
};

type Mode = "choose" | "preview" | "result";

export function AddIngredientsScreen({
  onBack,
  onChoosePantry,
  onConfirmDetected,
}: AddIngredientsScreenProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("choose");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [source, setSource] = useState<"camera" | "gallery">("camera");
  const [fileBytes, setFileBytes] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [scan, setScan] = useState<FridgeScanResult | null>(null);
  const [picked, setPicked] = useState<Record<string, boolean>>({});

  const confirmedList = useMemo(() => {
    if (!scan || scan.kind !== "found") return [];
    return [...scan.detected, ...scan.unclear].filter((item) => picked[item.id]);
  }, [scan, picked]);

  function resetToChoose() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setMode("choose");
    setAnalyzing(false);
    setScan(null);
    setPicked({});
    setFileBytes(0);
  }

  function handleFile(
    file: File | undefined,
    nextSource: "camera" | "gallery",
  ) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setSource(nextSource);
    setFileBytes(file.size);
    setScan(null);
    setPicked({});
    setMode("preview");
  }

  function handleUsePhoto() {
    setAnalyzing(true);
    window.setTimeout(() => {
      const result = mockFridgeScan(fileBytes);
      setScan(result);
      if (result.kind === "found") {
        const next: Record<string, boolean> = {};
        for (const item of result.detected) next[item.id] = true;
        for (const item of result.unclear) next[item.id] = false;
        setPicked(next);
      }
      setAnalyzing(false);
      setMode("result");
    }, 1400);
  }

  function togglePicked(id: string) {
    setPicked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleConfirm() {
    if (confirmedList.length === 0) return;
    onConfirmDetected(confirmedList);
  }

  const title =
    mode === "result"
      ? "Scan result"
      : mode === "preview"
        ? "Fridge snapshot"
        : "Add to fridge";

  return (
    <section className={`screen ${styles.screen}`} data-name="screen-add-ingredients">
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={
            mode === "choose"
              ? onBack
              : mode === "result"
                ? resetToChoose
                : () => {
                    setMode("choose");
                    setAnalyzing(false);
                  }
          }
          aria-label="Back"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/arrow-left.svg" alt="" width={20} height={20} />
        </button>
        <h1 className={styles.title}>{title}</h1>
        <span className={styles.headerSpacer} />
      </header>

      {mode === "choose" ? (
        <div className={`screen__scroll ${styles.body}`}>
          <p className={styles.lead}>
            Take a photo of your fridge or upload a picture — we&apos;ll spot
            what you already have.
          </p>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cardPrimary}
              onClick={() => cameraRef.current?.click()}
            >
              <span className={styles.cardIcon} aria-hidden="true">
                <CameraIcon />
              </span>
              <span className={styles.cardText}>
                <strong>Take a photo</strong>
                <span>Open camera and scan your fridge</span>
              </span>
            </button>

            <button
              type="button"
              className={styles.cardSecondary}
              onClick={() => galleryRef.current?.click()}
            >
              <span className={styles.cardIcon} aria-hidden="true">
                <GalleryIcon />
              </span>
              <span className={styles.cardText}>
                <strong>Upload a picture</strong>
                <span>Choose an image from your gallery</span>
              </span>
            </button>
          </div>

          <button
            type="button"
            className={styles.pantryLink}
            onClick={onChoosePantry}
          >
            Or choose from pantry list
          </button>
        </div>
      ) : null}

      {mode === "preview" ? (
        <div className={`screen__scroll ${styles.previewBody}`}>
          <div className={styles.previewFrame}>
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Fridge preview"
                className={styles.previewImg}
              />
            ) : null}
            {analyzing ? (
              <div className={styles.analyzing}>
                <span className={styles.spinner} aria-hidden="true" />
                <p>Looking for ingredients…</p>
              </div>
            ) : null}
          </div>

          <p className={styles.previewHint}>
            {source === "camera"
              ? "Snapshot ready. Scan it to detect ingredients."
              : "Picture ready. Scan it to detect ingredients."}
          </p>

          <div className={styles.previewActions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={resetToChoose}
              disabled={analyzing}
            >
              Retake
            </button>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleUsePhoto}
              disabled={analyzing}
            >
              {analyzing ? "Scanning…" : "Scan fridge"}
            </button>
          </div>
        </div>
      ) : null}

      {mode === "result" && scan ? (
        <div className={`screen__scroll ${styles.resultBody}`}>
          {scan.kind === "empty" ? (
            <>
              <div className={styles.emptyCard} role="status">
                <h2>Fridge looks empty</h2>
                <p>{scan.message}</p>
              </div>
              <div className={styles.resultActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={resetToChoose}
                >
                  Try another photo
                </button>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={onChoosePantry}
                >
                  Pick from list
                </button>
              </div>
            </>
          ) : (
            <>
              <p className={styles.resultLead}>{scan.message}</p>

              <section className={styles.resultBlock}>
                <h3>Found in photo</h3>
                <ul className={styles.resultList}>
                  {scan.detected.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`${styles.resultItem} ${
                          picked[item.id] ? styles.resultItemOn : ""
                        }`}
                        onClick={() => togglePicked(item.id)}
                        aria-pressed={Boolean(picked[item.id])}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={fridgeIconFor(item.name)}
                          alt=""
                          width={28}
                          height={28}
                        />
                        <span>{item.name}</span>
                        <em>{picked[item.id] ? "Keep" : "Skip"}</em>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              {scan.unclear.length > 0 ? (
                <section className={styles.resultBlock}>
                  <h3>Not sure — maybe missing?</h3>
                  <p className={styles.unclearHint}>
                    We couldn’t clearly see these. Turn on only what you really
                    have.
                  </p>
                  <ul className={styles.resultList}>
                    {scan.unclear.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className={`${styles.resultItem} ${
                            picked[item.id] ? styles.resultItemOn : ""
                          }`}
                          onClick={() => togglePicked(item.id)}
                          aria-pressed={Boolean(picked[item.id])}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={fridgeIconFor(item.name)}
                            alt=""
                            width={28}
                            height={28}
                          />
                          <span>{item.name}</span>
                          <em>{picked[item.id] ? "Add" : "Skip"}</em>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <div className={styles.resultActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={onChoosePantry}
                >
                  Add more manually
                </button>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={handleConfirm}
                  disabled={confirmedList.length === 0}
                >
                  Add {confirmedList.length || ""} to fridge
                </button>
              </div>
            </>
          )}
        </div>
      ) : null}

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className={styles.hiddenInput}
        onChange={(event) =>
          handleFile(event.target.files?.[0], "camera")
        }
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={(event) =>
          handleFile(event.target.files?.[0], "gallery")
        }
      />
    </section>
  );
}

function CameraIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.2l1.1-1.6A1.5 1.5 0 0 1 10 3.8h4a1.5 1.5 0 0 1 1.2.6L16.3 6h1.2A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="9" cy="10" r="1.6" fill="currentColor" />
      <path
        d="m7.5 16.5 3.2-3.4a1.2 1.2 0 0 1 1.7 0L14 14.7l1.3-1.3a1.2 1.2 0 0 1 1.7 0l1.5 1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
