"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useSearchCompanies } from "@/hooks/use-search-companies.hook";
import type { Company } from "@/features/companies/types/company.type";

interface Props {
  onSelect?: (company: Company) => void;
}

export function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const { data: results = [], isLoading } = useSearchCompanies(query);
  const showResults = query.length >= 2;

  const handleSelect = (company: Company) => {
    onSelect?.(company);
    setQuery("");
  };

  return (
    <div className="relative w-64">
      <Input
        placeholder="Rechercher..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-white"
      />
      {showResults && (
        <ul className="absolute left-0 top-full z-[100] mt-1 w-full rounded-md border border-border bg-white p-1 shadow-lg">
          {isLoading ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              Recherche...
            </li>
          ) : results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              Aucun résultat
            </li>
          ) : (
            results.slice(0, 5).map((company) => (
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
            ))
          )}
        </ul>
      )}
    </div>
  );
}
