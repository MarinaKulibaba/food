import styles from "./FridgeItemTile.module.css";
import { fridgeIconFor } from "@/data/fridgeIcons";

type FridgeItemTileProps = {
  name: string;
  selected?: boolean;
  onClick?: () => void;
};

export function FridgeItemTile({
  name,
  selected = false,
  onClick,
}: FridgeItemTileProps) {
  const words = name.trim().split(/\s+/);
  const isMultiline = words.length > 1;

  return (
    <button
      type="button"
      className={`${styles.tile} ${selected ? styles.tileSelected : ""}`}
      data-name="ITEMS"
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className={styles.frame} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/fridge/imgItems.svg"
          alt=""
          className={styles.frameImg}
          width={52}
          height={54}
        />
      </span>

      <span className={styles.earLeft} aria-hidden="true">
        <span className={styles.earLeftInner}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/fridge/imgVector1348.svg" alt="" />
        </span>
      </span>
      <span className={styles.earRight} aria-hidden="true">
        <span className={styles.earRightInner}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/fridge/imgVector1349.svg" alt="" />
        </span>
      </span>

      {/* Cream plate — ALL content (icon + label) stays inside */}
      <span className={styles.panel} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/fridge/imgRectangle40016.svg"
          alt=""
          className={styles.panelBg}
        />
        <span className={styles.iconSlot}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fridgeIconFor(name)}
            alt=""
            className={styles.iconImg}
            width={256}
            height={256}
          />
        </span>
      </span>

      {isMultiline ? (
        <span className={styles.labelMulti}>
          {words.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </span>
      ) : (
        <span className={styles.label}>{name}</span>
      )}

      {selected ? (
        <span className={styles.selectedMark} aria-hidden="true">
          ✓
        </span>
      ) : null}
    </button>
  );
}
