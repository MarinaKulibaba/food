import type { InputHTMLAttributes } from "react";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function SearchInput({
  label = "Search ingredients",
  className = "",
  id = "ingredient-search",
  ...props
}: SearchInputProps) {
  return (
    <label className={`search-input ${className}`.trim()} htmlFor={id}>
      <span className="sr-only">{label}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="search-input__icon"
        src="/figma/search.svg"
        alt=""
        width={16}
        height={16}
      />
      <input id={id} className="search-input__field" type="search" {...props} />
    </label>
  );
}
