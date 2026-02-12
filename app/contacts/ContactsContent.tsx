"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/molecules/PageHeader";
import { SearchBar } from "@/components/molecules/SearchBar";
import { StatsCard } from "@/components/molecules/StatsCard";
import { CompanyList } from "@/components/organisms/CompanyList";
import { CompanyForm } from "@/components/organisms/CompanyForm";
import { CategoryTabs } from "@/components/organisms/CategoryTabs";
import { useCompanies } from "@/hooks/use-companies.hook";
import { useCreateCompany } from "@/hooks/use-create-company.hook";
import { useUpdateCompany } from "@/hooks/use-update-company.hook";
import type { Company } from "@/features/companies/types/company.type";
import type { CreateCompanyDTO } from "@/features/companies/types/create-company-dto.type";

export function ContactsContent() {
  const [showForm, setShowForm] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [category] = useQueryState("category");
  const { data: companies = [] } = useCompanies();
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();

  const filtered = category
    ? companies.filter((c) => c.categories.includes(category))
    : companies;

  const favorites = companies.filter((c) => c.isFavorite);
  const actuallyContacted = companies.filter((c) => c.contactedAt);
  const rejected = companies.filter((c) => c.applicationStage === "rejected");
  const interviewing = companies.filter(
    (c) =>
      c.applicationStage === "interview" ||
      c.applicationStage === "offer" ||
      c.applicationStage === "accepted",
  );

  const handleCreate = (data: CreateCompanyDTO) => {
    createCompany.mutate({
      ...data,
      status: data.contactedAt ? "waiting" : "favorite",
      contactedAt: data.contactedAt || undefined,
    });
    setShowForm(false);
  };

  const handleUpdate = (data: CreateCompanyDTO) => {
    if (!editCompany) return;
    updateCompany.mutate({ id: editCompany.id, ...data });
    setEditCompany(null);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <PageHeader
        title="Entreprises"
        subtitle="Toutes vos entreprises favorites et contactées"
      >
        <SearchBar onSelect={setEditCompany} />
      </PageHeader>

      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[320px_1fr] px-8">
        <aside className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <StatsCard
              title="Favorites"
              value={favorites.length}
              variant="warning"
            />
            <StatsCard
              title="Contactées"
              value={actuallyContacted.length}
              variant="primary"
            />
            <StatsCard
              title="En cours"
              value={interviewing.length}
              variant="success"
            />
            <StatsCard
              title="Refusé"
              value={rejected.length}
              variant="danger"
            />
          </div>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto">
          <div className="flex items-center justify-between">
            <CategoryTabs />
            <Button onClick={() => setShowForm(true)} size="sm">
              + Ajouter
            </Button>
          </div>
          <CompanyList
            companies={filtered}
            showBulkActions
            emptyMessage={
              category
                ? `Aucune entreprise dans "${category}"`
                : "Aucune entreprise pour le moment"
            }
          />
        </div>
      </div>

      <CompanyForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleCreate}
      />

      <CompanyForm
        open={!!editCompany}
        onOpenChange={(open) => !open && setEditCompany(null)}
        onSubmit={handleUpdate}
        initialData={editCompany ?? undefined}
      />
    </div>
  );
}
