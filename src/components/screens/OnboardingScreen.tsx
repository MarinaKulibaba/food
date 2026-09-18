"use client";

import styles from "./OnboardingScreen.module.css";

type OnboardingScreenProps = {
  onGetStarted: () => void;
};

export function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  return (
    <section className={`screen ${styles.splash}`} data-name="screen-onboarding">
      <div className={styles.scene} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/onboarding/landscape-md.png"
          alt=""
          className={styles.landscape}
        />

        {/* Tiger stays behind the pot — static */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/onboarding/magnific.png"
          alt=""
          className={styles.mascot}
        />

        <div className={styles.potStage}>
          {/* Leaflet card rising from the open pot */}
          <div className={styles.leaflet}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/onboarding/card-frame.svg"
              alt=""
              className={styles.leafletFrame}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/onboarding/card-ear-l.svg"
              alt=""
              className={styles.leafletEarL}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/onboarding/card-ear-r.svg"
              alt=""
              className={styles.leafletEarR}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/onboarding/card-inner.svg"
              alt=""
              className={styles.leafletInner}
            />
            <div className={styles.leafletIcon}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/figma/onboarding/card-face.svg" alt="" />
            </div>
            <p className={styles.leafletText}>
              <span>Select the ingredient you have</span>
              <span>and let us do it for you!</span>
            </p>
          </div>

          {/* Lid — animated open tilt */}
          <div className={styles.lidWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/onboarding/up.png"
              alt=""
              className={styles.lid}
            />
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/onboarding/pot.png" alt="" className={styles.pot} />
        </div>
      </div>

      <div className={styles.overlay}>
        <h1 className={styles.heroTitle}>
          <span>Got ingredients?</span>
          <span>Let&apos;s cook!</span>
        </h1>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.startButton}
            onClick={onGetStarted}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/onboarding/btn-fill.svg"
              alt=""
              className={styles.startFill}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/onboarding/btn-stroke.svg"
              alt=""
              className={styles.startStroke}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/onboarding/btn-ornament-l.svg"
              alt=""
              className={styles.startOrnamentL}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/onboarding/btn-ornament-l2.svg"
              alt=""
              className={styles.startOrnamentL2}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/onboarding/btn-ornament-r.svg"
              alt=""
              className={styles.startOrnamentR}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/onboarding/btn-ornament-r2.svg"
              alt=""
              className={styles.startOrnamentR2}
            />
            <span className={styles.startLabel}>Start</span>
          </button>
        </div>
      </div>
    </section>
  );
}
