"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StatsCard } from "@/components/molecules/StatsCard";
import { CompanyList } from "@/components/organisms/CompanyList";
import { CompanyForm } from "@/components/organisms/CompanyForm";
import { CategoryTabs } from "@/components/organisms/CategoryTabs";
import { useContacted } from "@/hooks/use-contacted.hook";
import { useCreateCompany } from "@/hooks/use-create-company.hook";
import type { CreateCompanyDTO } from "@/features/companies/types/create-company-dto.type";

export function ContactsContent() {
  const [showForm, setShowForm] = useState(false);
  const [category] = useQueryState("category");
  const { data: contacted = [] } = useContacted();
  const createCompany = useCreateCompany();

  const filtered = category
    ? contacted.filter((c) => c.categories.includes(category))
    : contacted;

  const sorted = [...filtered].sort((a, b) => {
    if (!a.contactedAt || !b.contactedAt) return 0;
    return b.contactedAt.localeCompare(a.contactedAt);
  });

  const actuallyContacted = contacted.filter((c) => c.contactedAt);
  const applied = contacted.filter((c) => c.applicationStage === "applied");
  const rejected = contacted.filter((c) => c.applicationStage === "rejected");
  const interviewing = contacted.filter(
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

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <PageHeader
        title="Entreprises contactées"
        subtitle="Historique de vos prises de contact"
      />

      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[320px_1fr] px-8">
        <aside className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <StatsCard
              title="Contactées"
              value={actuallyContacted.length}
              variant="primary"
            />
            <StatsCard
              title="Postulé"
              value={applied.length}
              variant="default"
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
            companies={sorted}
            showBulkActions
            emptyMessage={
              category
                ? `Aucun contact dans "${category}"`
                : "Aucun contact pour le moment"
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
