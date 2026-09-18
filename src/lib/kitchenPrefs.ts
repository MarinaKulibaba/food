export type KitchenPrefs = {
  notificationsOn: boolean;
  diet: string;
  language: string;
  units: string;
};

export const KITCHEN_PREFS_KEY = "food.settingsPrefs";

const DEFAULT_PREFS: KitchenPrefs = {
  notificationsOn: true,
  diet: "Вегетаріанське",
  language: "Українська",
  units: "Метричні (г, мл)",
};

export function readKitchenPrefs(): KitchenPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = sessionStorage.getItem(KITCHEN_PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<KitchenPrefs>) };
  } catch {
    return DEFAULT_PREFS;
  }
}
