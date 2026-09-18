import type { Ingredient, IngredientCategory } from "@/lib/types";

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  { id: "proteins", label: "Proteins & Eggs" },
  { id: "vegetables", label: "Vegetables" },
  { id: "dairy", label: "Dairy" },
  { id: "grains", label: "Grains & Carbs" },
  { id: "condiments", label: "Condiments & Spices" },
];

export const PRESET_INGREDIENTS: Ingredient[] = [
  // Proteins & Eggs (Figma 1:1296 order first)
  { id: "eggs", name: "Eggs", category: "proteins" },
  { id: "chicken", name: "Chicken", category: "proteins" },
  { id: "beef", name: "Beef", category: "proteins" },
  { id: "fish", name: "Fish", category: "proteins" },
  { id: "pork", name: "Pork", category: "proteins" },
  { id: "salmon", name: "Salmon", category: "proteins" },
  { id: "shrimp", name: "Shrimp", category: "proteins" },
  { id: "tofu", name: "Tofu", category: "proteins" },
  { id: "beans", name: "Beans", category: "proteins" },
  { id: "lentils", name: "Lentils", category: "proteins" },
  { id: "chickpeas", name: "Chickpeas", category: "proteins" },

  // Vegetables (Figma 1:1296 order first)
  { id: "mushroom", name: "Mushroom", category: "vegetables" },
  { id: "tomato", name: "Tomato", category: "vegetables" },
  { id: "onion", name: "Onion", category: "vegetables" },
  { id: "spinach", name: "Spinach", category: "vegetables" },
  { id: "garlic", name: "Garlic", category: "vegetables" },
  { id: "carrot", name: "Carrot", category: "vegetables" },
  { id: "potato", name: "Potato", category: "vegetables" },
  { id: "bell-pepper", name: "Bell pepper", category: "vegetables" },
  { id: "broccoli", name: "Broccoli", category: "vegetables" },
  { id: "zucchini", name: "Zucchini", category: "vegetables" },
  { id: "avocado", name: "Avocado", category: "vegetables" },
  { id: "lemon", name: "Lemon", category: "vegetables" },

  // Dairy (Figma 1:1296 order first)
  { id: "cheese", name: "Cheese", category: "dairy" },
  { id: "milk", name: "Milk", category: "dairy" },
  { id: "butter", name: "Butter", category: "dairy" },
  { id: "yogurt", name: "Yogurt", category: "dairy" },
  { id: "parmesan", name: "Parmesan", category: "dairy" },
  { id: "cream", name: "Cream", category: "dairy" },
  { id: "sour-cream", name: "Sour cream", category: "dairy" },
  { id: "feta", name: "Feta", category: "dairy" },

  // Grains & carbs
  { id: "rice", name: "Rice", category: "grains" },
  { id: "pasta", name: "Pasta", category: "grains" },
  { id: "bread", name: "Bread", category: "grains" },
  { id: "tortilla", name: "Tortilla", category: "grains" },
  { id: "quinoa", name: "Quinoa", category: "grains" },
  { id: "oats", name: "Oats", category: "grains" },
  { id: "couscous", name: "Couscous", category: "grains" },
  { id: "noodles", name: "Noodles", category: "grains" },

  // Condiments & spices
  { id: "olive-oil", name: "Olive oil", category: "condiments" },
  { id: "salt", name: "Salt", category: "condiments" },
  { id: "black-pepper", name: "Black pepper", category: "condiments" },
  { id: "soy-sauce", name: "Soy sauce", category: "condiments" },
  { id: "cumin", name: "Cumin", category: "condiments" },
  { id: "paprika", name: "Paprika", category: "condiments" },
  { id: "chili-flakes", name: "Chili flakes", category: "condiments" },
  { id: "basil", name: "Basil", category: "condiments" },
  { id: "oregano", name: "Oregano", category: "condiments" },
  { id: "honey", name: "Honey", category: "condiments" },
  { id: "vinegar", name: "Vinegar", category: "condiments" },
  { id: "ginger", name: "Ginger", category: "condiments" },
];
