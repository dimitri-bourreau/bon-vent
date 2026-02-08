"use client";

import { useState, useMemo } from "react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StatsCard } from "@/components/molecules/StatsCard";
import { ActivityChart } from "@/components/molecules/ActivityChart";
import { CompanyList } from "@/components/organisms/CompanyList";
import { FavoriteContactsList } from "@/components/organisms/FavoriteContactsList";
import { CompanyForm } from "@/components/organisms/CompanyForm";
import { CategoryTabs } from "@/components/organisms/CategoryTabs";
import {
  useContacted,
  useCreateCompany,
  useOverdue,
  useWaiting,
} from "@/features/companies/hooks/useCompanies";
import type { CreateCompanyDTO } from "@/features/companies/domain/types";

export function ContactsContent() {
  const [showForm, setShowForm] = useState(false);
  const [category] = useQueryState("category");
  const { data: contacted = [] } = useContacted();
  const { data: overdue = [] } = useOverdue();
  const { data: waiting = [] } = useWaiting();
  const createCompany = useCreateCompany();

  const favoriteContacts = contacted.filter((c) => c.isFavorite);
  const nonFavoriteContacts = contacted.filter((c) => !c.isFavorite);

  const filtered = category
    ? nonFavoriteContacts.filter((c) => c.categories.includes(category))
    : nonFavoriteContacts;

  const sorted = [...filtered].sort((a, b) => {
    if (!a.contactedAt || !b.contactedAt) return 0;
    return b.contactedAt.localeCompare(a.contactedAt);
  });

  const statusData = useMemo(
    () => [
      {
        label: "Répondu",
        value: contacted.length - waiting.length - overdue.length,
        color: "#22c55e",
      },
      { label: "En attente", value: waiting.length, color: "#06b6d4" },
      { label: "À relancer", value: overdue.length, color: "#ef4444" },
    ],
    [contacted.length, waiting.length, overdue.length],
  );

  const handleCreate = (data: CreateCompanyDTO) => {
    createCompany.mutate({
      ...data,
      status: "waiting",
      contactedAt: data.contactedAt || new Date().toISOString(),
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
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            <StatsCard
              title="Contactées"
              value={contacted.length}
              variant="primary"
            />
            <StatsCard
              title="En attente"
              value={waiting.length}
              variant="default"
            />
            <StatsCard
              title="À relancer"
              value={overdue.length}
              variant="danger"
            />
          </div>
          <ActivityChart
            title="Statut des contacts"
            data={statusData}
            type="donut"
          />
        </aside>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto">
          {favoriteContacts.length > 0 && (
            <FavoriteContactsList companies={favoriteContacts} />
          )}
          <div className="flex items-center justify-between">
            <CategoryTabs />
            <Button onClick={() => setShowForm(true)} size="sm">
              + Ajouter
            </Button>
          </div>
          <CompanyList
            companies={sorted}
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
