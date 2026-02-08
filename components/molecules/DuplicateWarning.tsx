"use client";

import { useFindDuplicates } from "@/hooks/use-find-duplicates.hook";

interface Props {
  name: string;
  excludeId?: string;
}

export function DuplicateWarning({ name, excludeId }: Props) {
  const { data: duplicates = [] } = useFindDuplicates(name);
  const filtered = excludeId
    ? duplicates.filter((c) => c.id !== excludeId)
    : duplicates;

  if (filtered.length === 0) return null;

  return (
    <div className="rounded-md bg-yellow-50 p-2 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
      Entreprise similaire existante : {filtered.map((c) => c.name).join(", ")}
    </div>
  );
}
