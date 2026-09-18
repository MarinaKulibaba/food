"use client";

import { useRef, useState } from "react";
import styles from "./AddIngredientsScreen.module.css";

type AddIngredientsScreenProps = {
  onBack: () => void;
  onChoosePantry: () => void;
  onPhotoReady: (source: "camera" | "gallery") => void;
};

type Mode = "choose" | "preview";

export function AddIngredientsScreen({
  onBack,
  onChoosePantry,
  onPhotoReady,
}: AddIngredientsScreenProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("choose");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [source, setSource] = useState<"camera" | "gallery">("camera");
  const [analyzing, setAnalyzing] = useState(false);

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
    setMode("preview");
  }

  function handleUsePhoto() {
    setAnalyzing(true);
    window.setTimeout(() => {
      setAnalyzing(false);
      onPhotoReady(source);
    }, 1400);
  }

  function handleRetake() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setMode("choose");
    setAnalyzing(false);
  }

  return (
    <section className={`screen ${styles.screen}`} data-name="screen-add-ingredients">
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={mode === "preview" ? handleRetake : onBack}
          aria-label="Back"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/arrow-left.svg" alt="" width={20} height={20} />
        </button>
        <h1 className={styles.title}>
          {mode === "preview" ? "Fridge snapshot" : "Add Ingredients"}
        </h1>
        <span className={styles.headerSpacer} />
      </header>

      {mode === "choose" ? (
        <div className={`screen__scroll ${styles.body}`}>
          <p className={styles.lead}>
            Take a quick snapshot of your fridge or upload a photo — we&apos;ll
            help spot what you already have.
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
                <strong>Quick snapshot</strong>
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
                <strong>Upload fridge photo</strong>
                <span>Choose a picture from your gallery</span>
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
      ) : (
        <div className={`screen__scroll ${styles.previewBody}`}>
          <div className={styles.previewFrame}>
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Fridge preview" className={styles.previewImg} />
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
              ? "Snapshot ready. Use it to detect ingredients."
              : "Photo ready. Use it to detect ingredients."}
          </p>

          <div className={styles.previewActions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleRetake}
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
              {analyzing ? "Scanning…" : "Use photo"}
            </button>
          </div>
        </div>
      )}

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
