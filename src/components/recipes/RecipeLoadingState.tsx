const MESSAGES = [
  "Simmering possibilities…",
  "Chopping ideas into bite-size recipes…",
  "Seasoning suggestions to taste…",
];

export function RecipeLoadingState() {
  return (
    <div className="state-panel state-panel--loading" role="status" aria-live="polite">
      <div className="cooking-loader" aria-hidden="true">
        <span className="cooking-loader__pot" />
        <span className="cooking-loader__steam cooking-loader__steam--1" />
        <span className="cooking-loader__steam cooking-loader__steam--2" />
        <span className="cooking-loader__steam cooking-loader__steam--3" />
      </div>
      <h3 className="state-panel__title">Cooking up ideas…</h3>
      <p className="state-panel__copy state-panel__copy--cycle">
        {MESSAGES.map((message) => (
          <span key={message}>{message}</span>
        ))}
      </p>
    </div>
  );
}
