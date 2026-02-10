"use client";

import { Button } from "@/components/ui/button";

interface Props {
  label: string;
  column: string;
  sortKey: string | null;
  sortDir: "asc" | "desc";
  onSort: (key: string) => void;
}

export function SortHeader({ label, column, sortKey, sortDir, onSort }: Props) {
  const isActive = sortKey === column;
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 font-medium"
      onClick={() => onSort(column)}
    >
      {label}
      <span className={`ml-1 ${isActive ? "" : "text-muted-foreground/50"}`}>
        {isActive ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
      </span>
    </Button>
  );
}
