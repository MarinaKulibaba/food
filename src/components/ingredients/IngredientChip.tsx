type IngredientChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  removable?: boolean;
};

export function IngredientChip({
  label,
  selected = false,
  onClick,
  onRemove,
  removable = false,
}: IngredientChipProps) {
  if (removable) {
    return (
      <span className="chip chip--selected chip--removable">
        {label}
        <button
          type="button"
          className="chip__remove"
          aria-label={`Remove ${label}`}
          onClick={onRemove}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/x-circle.svg" alt="" width={10} height={10} />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`chip ${selected ? "chip--selected" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
