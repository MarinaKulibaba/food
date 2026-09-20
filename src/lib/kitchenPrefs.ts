export type CookingMood = "quick" | "healthy" | "comforting";

export type KitchenPrefs = {
  notificationsOn: boolean;
  diet: string;
  language: string;
  units: string;
  mood: CookingMood;
  moods: CookingMood[];
};

export const KITCHEN_PREFS_KEY = "food.settingsPrefs";
export const COOKING_MOOD_KEY = "food.cookingMood";
export const COOKING_MOODS_KEY = "food.cookingMoods";

const DEFAULT_PREFS: KitchenPrefs = {
  notificationsOn: true,
  diet: "Вегетаріанське",
  language: "Українська",
  units: "Метричні (г, мл)",
  mood: "quick",
  moods: ["quick"],
};

export const COOKING_MOODS: Array<{
  id: CookingMood;
  title: string;
  subtitle: string;
}> = [
  { id: "quick", title: "Quick", subtitle: "15 min" },
  { id: "healthy", title: "Healthy", subtitle: "Light & fresh" },
  { id: "comforting", title: "Comforting", subtitle: "Cozy & warm" },
];

function isCookingMood(value: unknown): value is CookingMood {
  return value === "quick" || value === "healthy" || value === "comforting";
}

function normalizeMoods(values: unknown): CookingMood[] {
  if (!Array.isArray(values)) return [...DEFAULT_PREFS.moods];
  const unique = values.filter(isCookingMood).filter((item, index, list) => {
    return list.indexOf(item) === index;
  });
  return unique.length > 0 ? unique : [...DEFAULT_PREFS.moods];
}

export function readKitchenPrefs(): KitchenPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = sessionStorage.getItem(KITCHEN_PREFS_KEY);
    const moodRaw = sessionStorage.getItem(COOKING_MOOD_KEY);
    const moodsRaw = sessionStorage.getItem(COOKING_MOODS_KEY);
    const parsed = raw
      ? { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<KitchenPrefs>) }
      : { ...DEFAULT_PREFS };

    if (moodsRaw) {
      parsed.moods = normalizeMoods(JSON.parse(moodsRaw));
    } else if (isCookingMood(moodRaw)) {
      parsed.moods = [moodRaw];
    } else {
      parsed.moods = normalizeMoods(parsed.moods);
    }

    parsed.mood = parsed.moods[0] ?? DEFAULT_PREFS.mood;
    return parsed;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function writeCookingMoods(moods: CookingMood[]) {
  if (typeof window === "undefined") return;
  const next = normalizeMoods(moods);
  sessionStorage.setItem(COOKING_MOODS_KEY, JSON.stringify(next));
  sessionStorage.setItem(COOKING_MOOD_KEY, next[0] ?? DEFAULT_PREFS.mood);
}

/** @deprecated Prefer writeCookingMoods */
export function writeCookingMood(mood: CookingMood) {
  writeCookingMoods([mood]);
}

export function moodPromptHint(mood: CookingMood): string {
  switch (mood) {
    case "quick":
      return "Prefer quick recipes that take about 15 minutes or less.";
    case "healthy":
      return "Prefer light, fresh, healthy recipes.";
    case "comforting":
      return "Prefer cozy, comforting, warming recipes.";
  }
}

export function moodsPromptHint(moods: CookingMood[]): string {
  return normalizeMoods(moods).map(moodPromptHint).join(" ");
}
