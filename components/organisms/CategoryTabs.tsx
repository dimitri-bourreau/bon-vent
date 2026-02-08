"use client";

import { useQueryState } from "nuqs";
import { cn } from "@/features/ui/cn";
import { useZones } from "@/features/zones/hooks/useZones";

interface Props {
  onCategoryChange?: (category: string | null) => void;
}

export function CategoryTabs({ onCategoryChange }: Props) {
  const { data: categories = [] } = useZones();
  const [category, setCategory] = useQueryState("category");

  const handleChange = (value: string) => {
    const newCategory = value === "all" ? null : value;
    setCategory(newCategory);
    onCategoryChange?.(newCategory);
  };

  if (categories.length === 0) return null;

  const allCategories = [{ id: "all", name: "Toutes" }, ...categories];

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((c) => {
        const isActive = (c.id === "all" && !category) || c.name === category;
        return (
          <button
            key={c.id}
            onClick={() => handleChange(c.id === "all" ? "all" : c.name)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
