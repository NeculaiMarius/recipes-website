"use client";

import { RecipePage } from "@/interfaces/recipe";
import { useEffect } from "react";

export default function SaveRecipeLS({recipe }: { recipe: RecipePage }) {
  useEffect(() => {
    if (!recipe) return;

    const key = "istoricRetete";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");

    const exists = existing.find((r: RecipePage) => r.id === recipe.id);
    let updated;

    if (exists) {
      updated = [exists, ...existing.filter((r: RecipePage) => r.id !== recipe.id)];
    } else {
      updated = [recipe, ...existing];
    }

    updated = updated.slice(0, 10);
    localStorage.setItem(key, JSON.stringify(updated));
  }, [recipe]);

  return null; 
}
