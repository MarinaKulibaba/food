import type { Ingredient } from "@/lib/types";

/** Canonical "Your Fridge Items" catalog from Figma node 1:2624 */
export const FRIDGE_CATALOG: Ingredient[] = [
  { id: "pork", name: "Pork", category: "proteins" },
  { id: "beef", name: "Beef", category: "proteins" },
  { id: "egg", name: "Egg", category: "proteins" },
  { id: "fish", name: "Fish", category: "proteins" },
  { id: "mushroom", name: "Mushroom", category: "vegetables" },
  { id: "strange-mushroom", name: "Strange Mushroom", category: "vegetables" },
  { id: "blueberries", name: "Blueberries", category: "vegetables" },
  { id: "potato", name: "Potato", category: "vegetables" },
  { id: "carrot", name: "Carrot", category: "vegetables" },
  { id: "rice", name: "Rice", category: "grains" },
];

/** Icon paths for fridge tiles — matched 1:1 to Figma */
export const FRIDGE_ITEM_ICONS: Record<string, string> = {
  pork: "/figma/fridge/pork.png",
  beef: "/figma/fridge/beef.png",
  egg: "/figma/fridge/egg.png",
  eggs: "/figma/fridge/egg.png",
  fish: "/figma/fridge/fish.png",
  salmon: "/figma/fridge/fish.png",
  shrimp: "/figma/fridge/fish.png",
  mushroom: "/figma/fridge/mushroom.png",
  "strange mushroom": "/figma/fridge/strange-mushroom.png",
  "strange-mushroom": "/figma/fridge/strange-mushroom.png",
  blueberries: "/figma/fridge/blueberries.png",
  potato: "/figma/fridge/potato.png",
  carrot: "/figma/fridge/carrot.png",
  rice: "/figma/fridge/rice.png",
};

export const FRIDGE_ITEM_DEFAULT_ICON = "/figma/fridge/mushroom.png";

export function fridgeIconFor(name: string): string {
  const key = name.trim().toLowerCase();
  if (FRIDGE_ITEM_ICONS[key]) return FRIDGE_ITEM_ICONS[key];

  for (const [alias, src] of Object.entries(FRIDGE_ITEM_ICONS)) {
    if (key.includes(alias) || alias.includes(key)) return src;
  }

  return FRIDGE_ITEM_DEFAULT_ICON;
}

export function isFridgeCatalogItem(ingredient: Ingredient): boolean {
  return FRIDGE_CATALOG.some(
    (item) =>
      item.id === ingredient.id ||
      item.name.toLowerCase() === ingredient.name.toLowerCase(),
  );
}
