"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StatsCard } from "@/components/molecules/StatsCard";
import { ActivityChart } from "@/components/molecules/ActivityChart";
import { CompanyList } from "@/components/organisms/CompanyList";
import { ObjectiveTracker } from "@/components/organisms/ObjectiveTracker";
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
  const { data: zones = [] } = useZones();

  const contacted = companies.filter((c) => c.contactedAt);

  const zoneData = useMemo(() => {
    const colors = ["#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ec4899"];
    return zones.slice(0, 5).map((zone, i) => ({
      label: zone.name,
      value: companies.filter((c) => c.zone === zone.name).length,
      color: colors[i % colors.length],
    }));
  }, [zones, companies]);

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
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de votre prospection"
        showLogo
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatsCard title="Total" value={companies.length} variant="default" />
        <StatsCard title="Favoris" value={favorites.length} variant="warning" />
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

      <div className="grid gap-4 sm:grid-cols-2">
        <ActivityChart title="Par statut" data={statusData} type="donut" />
        <ObjectiveTracker />
      </div>

      {zoneData.length > 0 && (
        <ActivityChart title="Par zone" data={zoneData} type="bar" />
      )}

      {overdue.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <span className="h-2 w-2 rounded-full bg-destructive" />À relancer (
            {overdue.length})
          </h2>
          <CompanyList
            companies={overdue}
            emptyMessage="Aucune relance nécessaire"
          />
        </section>
      )}

      <section>
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
  );
}
