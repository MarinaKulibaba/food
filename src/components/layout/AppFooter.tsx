import styles from "./AppFooter.module.css";

export type FooterTab = "home" | "fridge" | "recipes";

type AppFooterProps = {
  active: FooterTab;
  onChange: (tab: FooterTab) => void;
};

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.18 : 0}
      />
    </svg>
  );
}

function FridgeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="6"
        y="3"
        width="12"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.18 : 0}
      />
      <path d="M6 11h12" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 7v2M9 14v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function RecipesIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 4h9a3 3 0 0 1 3 3v13H8a2 2 0 0 0-2 2V4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.18 : 0}
      />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const TABS: Array<{ id: FooterTab; label: string; Icon: typeof HomeIcon }> = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "fridge", label: "Fridge", Icon: FridgeIcon },
  { id: "recipes", label: "Recipes", Icon: RecipesIcon },
];

export function AppFooter({ active, onChange }: AppFooterProps) {
  return (
    <nav className={styles.footer} aria-label="Main">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onChange(id)}
          >
            <Icon active={isActive} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
