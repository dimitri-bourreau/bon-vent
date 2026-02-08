"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StatsCard } from "@/components/molecules/StatsCard";
import { CompanyList } from "@/components/organisms/CompanyList";
import { CompanyForm } from "@/components/organisms/CompanyForm";
import { ZoneTabs } from "@/components/organisms/ZoneTabs";
import { DomainManager } from "@/components/organisms/DomainManager";
import { DataManager } from "@/components/organisms/DataManager";
import {
  useFavorites,
  useCreateCompany,
} from "@/features/companies/hooks/useCompanies";
import type { CreateCompanyDTO } from "@/features/companies/domain/types";

export function FavorisContent() {
  const [showForm, setShowForm] = useState(false);
  const [zone] = useQueryState("zone");
  const { data: favorites = [] } = useFavorites();
  const createCompany = useCreateCompany();

  const filtered = zone ? favorites.filter((c) => c.zone === zone) : favorites;

  const handleCreate = (data: CreateCompanyDTO) => {
    createCompany.mutate({
      ...data,
      isFavorite: true,
      status: data.contactedAt ? "waiting" : "favorite",
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Favoris" subtitle="Vos entreprises préférées" />
        <Button onClick={() => setShowForm(true)} className="shrink-0">
          + Ajouter
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatsCard
          title="Total favoris"
          value={favorites.length}
          variant="warning"
        />
        <StatsCard
          title="Filtrées"
          value={filtered.length}
          variant="default"
          subtitle={zone ?? "Toutes zones"}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DomainManager />
        <DataManager />
      </div>

      <ZoneTabs />

      <CompanyList
        companies={filtered}
        emptyMessage={
          zone ? `Aucun favori dans "${zone}"` : "Aucun favori pour le moment"
        }
      />

      <CompanyForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleCreate}
      />
    </div>
  );
}
