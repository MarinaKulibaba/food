export function youtubeTutorialUrl(recipeName: string): string {
  const query = `${recipeName} recipe tutorial`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function slugifyIngredient(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
