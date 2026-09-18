"use client";

import { useEffect, useState } from "react";
import styles from "./SettingsScreen.module.css";
import {
  KITCHEN_PREFS_KEY,
  readKitchenPrefs,
  type KitchenPrefs,
} from "@/lib/kitchenPrefs";

type SettingsScreenProps = {
  profileName?: string;
  profileEmail?: string;
  recipeCount?: number;
  onBack: () => void;
  onSignOut: () => void;
};

type Prefs = KitchenPrefs;

const DIETS = ["Вегетаріанське", "Веганське", "Без обмежень", "Без глютену"];
const LANGUAGES = ["Українська", "English"];
const UNITS = ["Метричні (г, мл)", "Імперські (oz, cup)"];

function cycle(list: string[], current: string) {
  const index = list.indexOf(current);
  return list[(index + 1) % list.length];
}

export function SettingsScreen({
  profileName,
  profileEmail,
  recipeCount = 0,
  onBack,
  onSignOut,
}: SettingsScreenProps) {
  const [prefs, setPrefs] = useState<Prefs>(() => readKitchenPrefs());

  useEffect(() => {
    setPrefs(readKitchenPrefs());
  }, []);

  function updatePrefs(next: Prefs) {
    setPrefs(next);
    sessionStorage.setItem(KITCHEN_PREFS_KEY, JSON.stringify(next));
  }

  const displayName = profileName?.trim() || "Марина Ковальчук";
  const displayEmail = profileEmail?.trim() || "marina.fridge@kitchen.ai";
  const kitchenLabel = `${displayName.split(" ")[0]}'s Kitchen AI v2.4`;
  const recipesLabel = `${recipeCount} створених рецептів`;

  return (
    <section
      className={`screen ${styles.settings}`}
      data-name="screen-settings"
    >
      <header className={styles.header}>
        <div className={styles.backGroup}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={onBack}
            aria-label="Назад"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/settings/chevron-left.svg"
              alt=""
              width={16}
              height={16}
            />
          </button>
          <h1 className={styles.title}>Налаштування</h1>
        </div>
        <button type="button" className={styles.helpBtn} aria-label="Допомога">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/settings/chef-hat.svg"
            alt=""
            width={18}
            height={18}
          />
        </button>
      </header>

      <div className={`screen__scroll ${styles.body}`}>
        <article className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarRing}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/settings/avatar.jpg"
                alt=""
                className={styles.avatar}
                width={64}
                height={64}
              />
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.nameRow}>
                <p className={styles.name}>{displayName}</p>
                <span className={styles.badge}>Шеф</span>
              </div>
              <p className={styles.email}>{displayEmail}</p>
            </div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.profileFooter}>
            <div className={styles.stats}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/settings/star.svg"
                alt=""
                width={16}
                height={16}
              />
              <span>{recipesLabel}</span>
            </div>
            <button type="button" className={styles.editBtn}>
              Редагувати
            </button>
          </div>
        </article>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Мій профіль</h2>
          <div className={styles.sectionCard}>
            <SettingsRow
              icon="/figma/settings/user.svg"
              label="Акаунт"
              value="Пароль та безпека"
            />
            <SettingsRow
              icon="/figma/settings/bell.svg"
              label="Сповіщення"
              value={prefs.notificationsOn ? "Увімкнено" : "Вимкнено"}
              onClick={() =>
                updatePrefs({
                  ...prefs,
                  notificationsOn: !prefs.notificationsOn,
                })
              }
            />
            <SettingsRow
              icon="/figma/settings/heart.svg"
              label="Дієтичні уподобання"
              value={prefs.diet}
              onClick={() =>
                updatePrefs({
                  ...prefs,
                  diet: cycle(DIETS, prefs.diet),
                })
              }
              last
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Налаштування застосунку</h2>
          <div className={styles.sectionCard}>
            <SettingsRow
              icon="/figma/settings/globe.svg"
              label="Мова"
              value={prefs.language}
              onClick={() =>
                updatePrefs({
                  ...prefs,
                  language: cycle(LANGUAGES, prefs.language),
                })
              }
            />
            <SettingsRow
              icon="/figma/settings/scale.svg"
              label="Одиниці виміру"
              value={prefs.units}
              onClick={() =>
                updatePrefs({
                  ...prefs,
                  units: cycle(UNITS, prefs.units),
                })
              }
            />
            <SettingsRow
              icon="/figma/settings/circle-x.svg"
              label="Конфіденційність"
              last
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Підтримка</h2>
          <div className={styles.sectionCard}>
            <SettingsRow
              icon="/figma/settings/circle-question.svg"
              label="Допомога"
            />
            <button
              type="button"
              className={`${styles.row} ${styles.signOutRow}`}
              onClick={onSignOut}
            >
              <span className={styles.rowLeft}>
                <span className={`${styles.iconBox} ${styles.iconBoxDanger}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/figma/settings/log-out.svg"
                    alt=""
                    width={18}
                    height={18}
                  />
                </span>
                <span className={styles.signOutLabel}>Вийти</span>
              </span>
            </button>
          </div>
        </section>

        <div className={styles.mascot}>
          <span className={styles.mascotIcon}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/settings/cooking-pot.svg"
              alt=""
              width={24}
              height={24}
            />
          </span>
          <div className={styles.mascotText}>
            <p className={styles.mascotTitle}>{kitchenLabel}</p>
            <p className={styles.mascotCopy}>
              Повністю готовий до нових кулінарних пригод!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

type SettingsRowProps = {
  icon: string;
  label: string;
  value?: string;
  onClick?: () => void;
  last?: boolean;
};

function SettingsRow({ icon, label, value, onClick, last }: SettingsRowProps) {
  const className = [styles.row, last ? styles.rowLast : ""].filter(Boolean).join(" ");

  return (
    <button type="button" className={className} onClick={onClick}>
      <span className={styles.rowLeft}>
        <span className={styles.iconBox}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icon} alt="" width={18} height={18} />
        </span>
        <span className={styles.rowLabel}>{label}</span>
      </span>
      <span className={styles.rowRight}>
        {value ? <span className={styles.rowValue}>{value}</span> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/settings/chevron-right.svg"
          alt=""
          width={14}
          height={14}
        />
      </span>
    </button>
  );
}
