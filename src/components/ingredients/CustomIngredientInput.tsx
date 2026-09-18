"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

type CustomIngredientInputProps = {
  onAdd: (name: string) => boolean;
};

export function CustomIngredientInput({ onAdd }: CustomIngredientInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const added = onAdd(value);
    if (added) setValue("");
  }

  return (
    <form className="custom-ingredient" onSubmit={handleSubmit}>
      <div className="custom-ingredient__row">
        <input
          id="custom-ingredient"
          className="custom-ingredient__field"
          type="text"
          placeholder="Tomato"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          autoComplete="off"
          aria-label="Custom ingredient"
        />
        <Button type="submit" variant="secondary" disabled={!value.trim()}>
          Add
        </Button>
      </div>
    </form>
  );
}
