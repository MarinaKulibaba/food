"use client";

import { useEffect, useState } from "react";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { OnboardingScreen } from "@/components/screens/OnboardingScreen";
import { RegisterScreen } from "@/components/screens/RegisterScreen";
import { AddIngredientsScreen } from "@/components/screens/AddIngredientsScreen";
import { SelectionScreen } from "@/components/screens/SelectionScreen";
import { LoadingScreen } from "@/components/screens/LoadingScreen";
import { ResultsScreen } from "@/components/screens/ResultsScreen";
import { FavoritesScreen } from "@/components/screens/FavoritesScreen";
import { DetailScreen } from "@/components/screens/DetailScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { AppFooter, type FooterTab } from "@/components/layout/AppFooter";
import { useSelectedIngredients } from "@/hooks/useSelectedIngredients";
import { useFavoriteRecipes } from "@/hooks/useFavoriteRecipes";
import { FRIDGE_CATALOG } from "@/data/fridgeIcons";
import { readKitchenPrefs } from "@/lib/kitchenPrefs";
import type { RecipeSuggestion, RecipesResponse } from "@/lib/types";

type View =
  | "onboarding"
  | "register"
  | "home"
  | "add"
  | "selection"
  | "loading"
  | "results"
  | "favorites"
  | "detail"
  | "settings";

type Profile = {
  name: string;
  email: string;
};

const PROFILE_KEY = "food.userProfile";

function footerTabForView(view: View): FooterTab {
  // Only the photo-scan flow belongs to the Fridge tab.
  // Choose Ingredients (from Add to fridge) stays under Home.
  if (view === "add") return "fridge";
  if (
    view === "favorites" ||
    view === "results" ||
    view === "loading" ||
    view === "detail"
  ) {
    return "recipes";
  }
  return "home";
}

export function AppShell() {
  const {
    selected,
    toggleIngredient,
    addCustomIngredient,
    addIngredients,
    removeIngredient,
    clearSelected,
    isSelected,
  } = useSelectedIngredients();
  const { favorites, isFavorite, toggleFavorite } = useFavoriteRecipes();

  const [view, setView] = useState<View>("onboarding");
  const [detailReturn, setDetailReturn] = useState<"results" | "favorites">(
    "results",
  );
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recipes, setRecipes] = useState<RecipeSuggestion[]>([]);
  const [activeRecipe, setActiveRecipe] = useState<RecipeSuggestion | null>(
    null,
  );
  const [source, setSource] = useState<"ai" | "mock" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recipesReady, setRecipesReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PROFILE_KEY);
      if (!raw) {
        setView("onboarding");
        return;
      }
      const parsed = JSON.parse(raw) as Profile;
      if (parsed?.name) {
        setProfile(parsed);
        setView("home");
      } else {
        setView("onboarding");
      }
    } catch {
      setView("onboarding");
    }
  }, []);

  function saveProfile(next: Profile) {
    setProfile(next);
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    setView("home");
  }

  function signOut() {
    sessionStorage.removeItem(PROFILE_KEY);
    setProfile(null);
    clearSelected();
    setRecipes([]);
    setView("onboarding");
  }

  function handleFooterChange(tab: FooterTab) {
    if (tab === "home") {
      setView("home");
      return;
    }
    if (tab === "fridge") {
      setView("add");
      return;
    }
    if (tab === "recipes") {
      setView("favorites");
    }
  }

  async function findRecipes() {
    if (selected.length === 0) return;

    setView("loading");
    setError(null);
    setRecipesReady(false);

    const prefs = readKitchenPrefs();

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: selected.map((item) => item.name),
          diet: prefs.diet,
          language: prefs.language,
        }),
      });

      const payload = (await response.json()) as RecipesResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Something went wrong.");
      }

      setRecipes(payload.recipes);
      setSource(payload.source);
      setRecipesReady(true);
    } catch (err) {
      setRecipes([]);
      setSource(null);
      setError(err instanceof Error ? err.message : "Could not find recipes.");
      setRecipesReady(true);
    }
  }

  const kitchenName = profile?.name
    ? `${profile.name.split(" ")[0]}'s Kitchen`
    : "Marina's Kitchen";

  const showFooter = view !== "onboarding" && view !== "register";

  return (
    <div className="app-shell">
      <div className="app-phone">
        <div className="app-phone__main">
          {view === "onboarding" ? (
            <OnboardingScreen onGetStarted={() => setView("register")} />
          ) : null}

          {view === "register" ? (
            <RegisterScreen
              onBack={() => setView("onboarding")}
              onRegistered={saveProfile}
            />
          ) : null}

          {view === "home" ? (
            <HomeScreen
              kitchenName={kitchenName}
              selected={selected}
              onAddIngredients={() => setView("selection")}
              onAddMore={() => setView("selection")}
              onToggle={toggleIngredient}
              onFindRecipes={findRecipes}
              onOpenSettings={() => setView("settings")}
            />
          ) : null}

          {view === "add" ? (
            <AddIngredientsScreen
              onBack={() => setView("home")}
              onChoosePantry={() => setView("selection")}
              onPhotoReady={() => {
                addIngredients(
                  FRIDGE_CATALOG.filter((item) =>
                    ["egg", "carrot", "potato", "mushroom"].includes(item.id),
                  ).map((item) =>
                    item.id === "egg"
                      ? { ...item, id: "eggs", name: "Eggs" }
                      : item,
                  ),
                );
                setView("selection");
              }}
            />
          ) : null}

          {view === "settings" ? (
            <SettingsScreen
              profileName={profile?.name}
              profileEmail={profile?.email}
              recipeCount={favorites.length}
              onBack={() => setView("home")}
              onSignOut={signOut}
            />
          ) : null}

          {view === "selection" ? (
            <SelectionScreen
              selected={selected}
              isSelected={isSelected}
              onToggle={toggleIngredient}
              onAddCustom={addCustomIngredient}
              onRemove={removeIngredient}
              onClear={clearSelected}
              onBack={() => setView("home")}
              onFindRecipes={findRecipes}
            />
          ) : null}

          {view === "loading" ? (
            <LoadingScreen
              selected={selected}
              recipes={recipes}
              ready={recipesReady}
              onBack={() => setView("selection")}
              onComplete={() => setView("results")}
            />
          ) : null}

          {view === "results" ? (
            <ResultsScreen
              recipes={recipes}
              selected={selected}
              source={source}
              error={error}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onBack={() => setView("selection")}
              onOpenRecipe={(recipe) => {
                setActiveRecipe(recipe);
                setDetailReturn("results");
                setView("detail");
              }}
            />
          ) : null}

          {view === "favorites" ? (
            <FavoritesScreen
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onFindRecipes={findRecipes}
              onOpenRecipe={(recipe) => {
                setActiveRecipe(recipe);
                setDetailReturn("favorites");
                setView("detail");
              }}
            />
          ) : null}

          {view === "detail" && activeRecipe ? (
            <DetailScreen
              recipe={activeRecipe}
              favorited={isFavorite(activeRecipe.id)}
              onToggleFavorite={() => toggleFavorite(activeRecipe)}
              onBack={() => setView(detailReturn)}
            />
          ) : null}
        </div>

        {showFooter ? (
          <AppFooter
            active={footerTabForView(view)}
            onChange={handleFooterChange}
          />
        ) : null}
      </div>
    </div>
  );
}
