"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StatsCard } from "@/components/molecules/StatsCard";
import { CompanyList } from "@/components/organisms/CompanyList";
import { CompanyForm } from "@/components/organisms/CompanyForm";
import { CategoryTabs } from "@/components/organisms/CategoryTabs";
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
    ? favorites.filter((c) => c.categories.includes(category))
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
      <PageHeader
        title="Entreprises inspirantes"
        subtitle="Des entreprises que j'admire pour guider ma recherche"
      />

      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[320px_1fr] px-8">
        <aside className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <StatsCard
              title="Total"
              value={favorites.length}
              variant="warning"
            />
          </div>
          <DomainManager />
        </aside>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto">
          <div className="flex items-center justify-between">
            <CategoryTabs />
            <Button onClick={() => setShowForm(true)} size="sm">
              + Ajouter
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Ces entreprises servent d&apos;inspiration, même si vous ne postulez
            pas activement. Elles vous aident à identifier vos centres
            d&apos;intérêt.
          </p>
          <CompanyList
            companies={filtered}
            emptyMessage={
              category
                ? `Aucune inspiration dans "${category}"`
                : "Ajoutez des entreprises qui vous inspirent"
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
