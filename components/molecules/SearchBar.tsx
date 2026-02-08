"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useSearchCompanies } from "@/features/companies/hooks/useCompanies";
import type { Company } from "@/features/companies/domain/types";

interface Props {
  onSelect?: (company: Company) => void;
}

export function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const { data: results = [] } = useSearchCompanies(query);
  const showResults = query.length >= 2 && results.length > 0;

  const handleSelect = (company: Company) => {
    onSelect?.(company);
    setQuery("");
  };

  return (
    <div className="relative">
      <Input
        placeholder="Rechercher..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
      />
      {showResults && (
        <ul className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
          {results.slice(0, 5).map((company) => (
            <li key={company.id}>
              <button
                type="button"
                className="w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => handleSelect(company)}
              >
                <span className="font-medium">{company.name}</span>
                {company.categories.length > 0 && (
                  <span className="ml-2 text-muted-foreground">
                    {company.categories.join(", ")}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
