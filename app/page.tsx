"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StatsCard } from "@/components/molecules/StatsCard";
import { ActivityChart } from "@/components/molecules/ActivityChart";
import { CompanyList } from "@/components/organisms/CompanyList";
import { ObjectiveTracker } from "@/components/organisms/ObjectiveTracker";
import { CategoryManager } from "@/components/organisms/CategoryManager";
import {
  useCompanies,
  useOverdue,
  useWaiting,
  useFavorites,
} from "@/features/companies/hooks/useCompanies";
import { useZones } from "@/features/zones/hooks/useZones";

export default function HomePage() {
  const { data: companies = [] } = useCompanies();
  const { data: overdue = [] } = useOverdue();
  const { data: waiting = [] } = useWaiting();
  const { data: favorites = [] } = useFavorites();
  const { data: categories = [] } = useZones();

  const contacted = companies.filter((c) => c.contactedAt);

  const categoryData = useMemo(() => {
    const colors = ["#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ec4899"];
    return categories.slice(0, 5).map((cat, i) => ({
      label: cat.name,
      value: companies.filter((c) => c.zone === cat.name).length,
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

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <PageHeader />

      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[320px_1fr] px-8">
        <aside className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Tableau de bord
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Vue d&apos;ensemble de votre prospection
            </p>
          </div>
          <ObjectiveTracker />
          <div className="grid grid-cols-2 gap-3">
            <StatsCard
              title="Total"
              value={companies.length}
              variant="default"
            />
            <StatsCard
              title="Favoris"
              value={favorites.length}
              variant="warning"
            />
            <StatsCard
              title="Contactées"
              value={contacted.length}
              variant="primary"
            />
            <StatsCard
              title="En attente"
              value={waiting.length + overdue.length}
              variant={overdue.length > 0 ? "danger" : "success"}
              subtitle={
                overdue.length > 0 ? `${overdue.length} à relancer` : undefined
              }
            />
          </div>
          <ActivityChart title="Par statut" data={statusData} type="donut" />
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
    </div>
  );
}
