"use client";

import { useState, type FormEvent } from "react";
import styles from "./RegisterScreen.module.css";

type RegisterScreenProps = {
  onBack: () => void;
  onRegistered: (profile: { name: string; email: string }) => void;
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}

function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "Chef";
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  if (!cleaned) return "Chef";
  return cleaned
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function RegisterScreen({
  onBack,
  onRegistered,
}: RegisterScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Enter a valid email to continue.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError(null);
    onRegistered({
      name: nameFromEmail(trimmedEmail),
      email: trimmedEmail,
    });
  }

  function handleGoogleContinue() {
    setError(null);
    onRegistered({
      name: "Marina",
      email: "marina@gmail.com",
    });
  }

  return (
    <section className={`screen ${styles.register}`} data-name="screen-register">
      <div className={styles.heroStrip} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/onboarding/landscape-md.png"
          alt=""
          className={styles.stripBg}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/onboarding/magnific.png"
          alt=""
          className={styles.stripMascot}
        />
      </div>

      <header className={styles.header}>
        <button
          type="button"
          className={styles.back}
          onClick={onBack}
          aria-label="Back"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/arrow-left.svg" alt="" width={18} height={18} />
        </button>
        <div className={styles.brandBadge}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/onboarding/chef-hat.svg"
            alt=""
            width={18}
            height={18}
          />
          <span>What&apos;s in my Fridge?</span>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Step 2 of 3</p>
          <h1 className={styles.title}>
            Join the
            <span> kitchen club</span>
          </h1>
          <p className={styles.copy}>
            Create a quick profile so we can save your fridge favorites and
            greet you properly.
          </p>
        </div>

        <div className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>Password</span>
              <div className={styles.passwordRow}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className={styles.showPassword}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {error ? <p className={styles.error}>{error}</p> : null}

            <button type="submit" className={styles.signUpButton}>
              Sign in
            </button>
          </form>

          <div className={styles.divider} role="separator">
            <span>or</span>
          </div>

          <button
            type="button"
            className={styles.googleButton}
            onClick={handleGoogleContinue}
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </section>
  );
}
