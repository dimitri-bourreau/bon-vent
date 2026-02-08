"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StatsCard } from "@/components/molecules/StatsCard";
import { CompanyList } from "@/components/organisms/CompanyList";
import { CompanyForm } from "@/components/organisms/CompanyForm";
import { CategoryTabs } from "@/components/organisms/CategoryTabs";
import { CategoryManager } from "@/components/organisms/CategoryManager";
import { DomainManager } from "@/components/organisms/DomainManager";
import {
  useFavorites,
  useCreateCompany,
} from "@/features/companies/hooks/useCompanies";
import type { CreateCompanyDTO } from "@/features/companies/domain/types";

export function FavorisContent() {
  const [showForm, setShowForm] = useState(false);
  const [category] = useQueryState("category");
  const { data: favorites = [] } = useFavorites();
  const createCompany = useCreateCompany();

  const filtered = category
    ? favorites.filter((c) => c.zone === category)
    : favorites;

  const handleCreate = (data: CreateCompanyDTO) => {
    createCompany.mutate({
      ...data,
      isFavorite: true,
      status: data.contactedAt ? "waiting" : "favorite",
    });
    setShowForm(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Entreprises pour lesquelles j'adorerais travailler"
          subtitle="Vos entreprises de rêve"
        />
        <Button onClick={() => setShowForm(true)} className="shrink-0">
          + Ajouter
        </Button>
      </div>

      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <StatsCard
              title="Total"
              value={favorites.length}
              variant="warning"
            />
            <StatsCard
              title="Affichées"
              value={filtered.length}
              variant="default"
              subtitle={category ?? "Toutes catégories"}
            />
          </div>
          <CategoryManager />
          <DomainManager />
        </aside>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto">
          <CategoryTabs />
          <CompanyList
            companies={filtered}
            emptyMessage={
              category
                ? `Aucun favori dans "${category}"`
                : "Aucun favori pour le moment"
            }
          />
        </div>
      </div>

      <CompanyForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleCreate}
      />
    </div>
  );
}
