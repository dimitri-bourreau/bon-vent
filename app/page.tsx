"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/molecules/PageHeader";
import { SearchBar } from "@/components/molecules/SearchBar";
import { ActivityChart } from "@/components/molecules/ActivityChart";
import { CompanyList } from "@/components/organisms/CompanyList";
import { CompanyForm } from "@/components/organisms/CompanyForm";
import { ObjectiveTracker } from "@/components/organisms/ObjectiveTracker";
import { CategoryManager } from "@/components/organisms/CategoryManager";
import { StatsOverview } from "@/components/organisms/StatsOverview";
import { CalendarView } from "@/components/organisms/CalendarView";
import {
  useCompanies,
  useOverdue,
  useWaiting,
  useFavorites,
  useUpdateCompany,
} from "@/features/companies/hooks/useCompanies";
import { useZones } from "@/features/zones/hooks/useZones";
import type { Company, CreateCompanyDTO } from "@/features/companies/domain/types";

export default function HomePage() {
  const { data: companies = [] } = useCompanies();
  const { data: overdue = [] } = useOverdue();
  const { data: waiting = [] } = useWaiting();
  const { data: favorites = [] } = useFavorites();
  const { data: categories = [] } = useZones();
  const updateCompany = useUpdateCompany();

  const [editCompany, setEditCompany] = useState<Company | null>(null);

  const contacted = companies.filter((c) => c.contactedAt);

  const categoryData = useMemo(() => {
    const colors = ["#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ec4899"];
    return categories.slice(0, 5).map((cat, i) => ({
      label: cat.name,
      value: companies.filter((c) => c.categories.includes(cat.name)).length,
      color: colors[i % colors.length],
    }));
  }, [categories, companies]);

  const statusData = useMemo(
    () => [
      { label: "Favoris", value: favorites.length, color: "#f59e0b" },
      { label: "Contactées", value: contacted.length, color: "#6366f1" },
      { label: "En attente", value: waiting.length, color: "#06b6d4" },
      { label: "À relancer", value: overdue.length, color: "#ef4444" },
    ],
    [favorites.length, contacted.length, waiting.length, overdue.length],
  );

  const handleUpdate = (data: CreateCompanyDTO) => {
    if (!editCompany) return;
    updateCompany.mutate({ id: editCompany.id, ...data });
    setEditCompany(null);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de votre prospection"
      >
        <SearchBar onSelect={setEditCompany} />
      </PageHeader>

      <div className="grid min-h-0 flex-1 gap-6 px-8 lg:grid-cols-[320px_1fr]">
        <aside className="flex flex-col gap-4">
          <StatsOverview />
          <ObjectiveTracker />
          <ActivityChart data={statusData} type="donut" />
          {categoryData.length > 0 && (
            <ActivityChart
              title="Par catégorie"
              data={categoryData}
              type="bar"
            />
          )}
          <CategoryManager />
        </aside>

        <div className="flex min-h-0 flex-col gap-6 overflow-auto">
          <CalendarView onSelectCompany={setEditCompany} />

          {overdue.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <span className="h-2 w-2 rounded-full bg-destructive" />À
                relancer ({overdue.length})
              </h2>
              <CompanyList
                companies={overdue}
                emptyMessage="Aucune relance nécessaire"
              />
            </section>
          )}

          <section className="flex-1">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <span className="h-2 w-2 rounded-full bg-chart-2" />
              Réponses en attente ({waiting.length})
            </h2>
            <CompanyList
              companies={waiting}
              emptyMessage="Aucune réponse en attente"
            />
          </section>
        </div>
      </div>

      <CompanyForm
        open={!!editCompany}
        onOpenChange={(open) => !open && setEditCompany(null)}
        onSubmit={handleUpdate}
        initialData={editCompany ?? undefined}
      />
    </div>
  );
}
