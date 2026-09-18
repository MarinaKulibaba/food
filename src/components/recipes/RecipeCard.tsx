import type { RecipeSuggestion } from "@/lib/types";

type RecipeCardProps = {
  recipe: RecipeSuggestion;
  imageSrc?: string;
  favorited?: boolean;
  onOpen?: () => void;
  onToggleFavorite?: (recipe: RecipeSuggestion) => void;
};

export function RecipeCard({
  recipe,
  imageSrc,
  favorited = false,
  onOpen,
  onToggleFavorite,
}: RecipeCardProps) {
  const perfect =
    recipe.missingIngredients.length === 0 &&
    recipe.matchedIngredients.length > 0;

  return (
    <article className="recipe-card">
      {imageSrc ? (
        <button
          type="button"
          className="recipe-card__media-btn"
          onClick={onOpen}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt=""
            className="recipe-card__media"
            width={342}
            height={150}
          />
        </button>
      ) : null}

      <div className="recipe-card__body">
        <div className="recipe-card__title-row">
          <h3 className="recipe-card__title">
            <button
              type="button"
              className="recipe-card__title-btn"
              onClick={onOpen}
            >
              {recipe.name}
            </button>
          </h3>
          <button
            type="button"
            className="recipe-card__heart"
            aria-label={favorited ? "Remove from Recipes" : "Save to Recipes"}
            aria-pressed={favorited}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite?.(recipe);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                favorited
                  ? "/figma/results/heart-active.svg"
                  : "/figma/results/heart.svg"
              }
              alt=""
              width={18}
              height={18}
            />
          </button>
        </div>

        <p className="recipe-card__description">{recipe.description}</p>

        <div className="recipe-card__meta">
          <span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/figma/clock.svg" alt="" width={12} height={12} />
            {recipe.cookTimeMinutes} min
          </span>
          <span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/figma/chef-hat.svg" alt="" width={12} height={12} />
            {recipe.difficulty}
          </span>
        </div>

        <div className="recipe-card__ingredients">
          {recipe.matchedIngredients.length > 0 ? (
            <p className="recipe-card__matched">
              <strong>✓ Matched:</strong>{" "}
              {recipe.matchedIngredients.join(", ")}
            </p>
          ) : null}
          {perfect ? (
            <p className="recipe-card__perfect">✓ 100% matched!</p>
          ) : recipe.missingIngredients.length > 0 ? (
            <p className="recipe-card__missing">
              <strong>+ Missing:</strong>{" "}
              {recipe.missingIngredients.join(", ")}
            </p>
          ) : null}
        </div>

        <a
          className="recipe-card__tutorial"
          href={recipe.youtubeSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/video.svg" alt="" width={14} height={14} />
          Watch video tutorial
        </a>
      </div>
    </article>
  );
}
