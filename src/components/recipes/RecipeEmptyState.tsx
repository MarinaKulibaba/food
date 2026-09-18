export function RecipeEmptyState() {
  return (
    <div className="state-panel state-panel--empty">
      <div className="state-panel__visual" aria-hidden="true">
        <span className="state-panel__ring" />
        <span className="state-panel__dot" />
      </div>
      <h3 className="state-panel__title">Pick a few ingredients to start</h3>
      <p className="state-panel__copy">
        Select what you have on hand, then hit Find Recipes — we&apos;ll cook up
        ideas that match your kitchen.
      </p>
    </div>
  );
}
