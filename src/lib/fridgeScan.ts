import type { Ingredient } from "@/lib/types";
import { FRIDGE_CATALOG } from "@/data/fridgeIcons";

export type FridgeScanResult =
  | {
      kind: "empty";
      message: string;
    }
  | {
      kind: "found";
      detected: Ingredient[];
      /** Items AI thinks might be missing / unclear on the photo */
      unclear: Ingredient[];
      message: string;
    };

function pick(ids: string[]): Ingredient[] {
  return FRIDGE_CATALOG.filter((item) => ids.includes(item.id));
}

/**
 * Demo fridge vision — swaps outcomes by photo size so empty / partial / full
 * can all be tried without a real vision API yet.
 */
export function mockFridgeScan(fileBytes: number): FridgeScanResult {
  const bucket = Math.abs(fileBytes) % 3;

  if (bucket === 0) {
    return {
      kind: "empty",
      message:
        "Looks like an empty fridge (or the photo is too dark). Add products by hand, or try another photo.",
    };
  }

  if (bucket === 1) {
    return {
      kind: "found",
      detected: pick(["egg", "carrot", "potato", "mushroom"]),
      unclear: pick(["milk", "tomato"]),
      message:
        "We spotted these. A couple of items look uncertain — add them only if they’re really there.",
    };
  }

  return {
    kind: "found",
    detected: pick([
      "egg",
      "carrot",
      "potato",
      "mushroom",
      "pork",
      "rice",
    ]),
    unclear: [],
    message: "Nice — here’s what we found in your fridge photo.",
  };
}
