"use client";

import { useMemo } from "react";
import { subDays, differenceInDays, isToday } from "date-fns";
import { useCompanies } from "@/hooks/use-companies.hook";

export function StatsOverview() {
  const { data: companies = [] } = useCompanies();

  const stats = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = subDays(now, 7);

    const contacted = companies.filter((c) => c.contactedAt);
    const responses = companies.filter(
      (c) =>
        c.applicationStage !== "research" && c.applicationStage !== "applied",
    );
    const interviews = companies.filter(
      (c) => c.applicationStage === "interview",
    );
    const offers = companies.filter(
      (c) =>
        c.applicationStage === "offer" || c.applicationStage === "accepted",
    );
    const rejected = companies.filter((c) => c.applicationStage === "rejected");

    const thisWeek = contacted.filter(
      (c) => c.contactedAt && new Date(c.contactedAt) >= oneWeekAgo,
    );

    const appliedToday = contacted.filter(
      (c) => c.contactedAt && isToday(new Date(c.contactedAt)),
    );

    const avgResponseTime =
      responses.length > 0
        ? responses.reduce((sum, c) => {
            if (!c.contactedAt || !c.lastInteractionAt) return sum;
            return (
              sum +
              differenceInDays(
                new Date(c.lastInteractionAt),
                new Date(c.contactedAt),
              )
            );
          }, 0) / responses.length
        : 0;

    const responseRate =
      contacted.length > 0
        ? Math.round((responses.length / contacted.length) * 100)
        : 0;

    return {
      total: companies.length,
      contacted: contacted.length,
      appliedToday: appliedToday.length,
      thisWeek: thisWeek.length,
      responses: responses.length,
      interviews: interviews.length,
      offers: offers.length,
      rejected: rejected.length,
      responseRate,
      avgResponseTime: Math.round(avgResponseTime),
    };
  }, [companies]);

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-4 font-semibold">Statistiques</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <Stat
          label="Total"
          value={stats.total}
          title="Nombre total d'entreprises"
        />
        <Stat
          label="Contactées"
          value={stats.contacted}
          title="Entreprises avec une date de contact"
        />
        <Stat
          label="Aujourd'hui"
          value={stats.appliedToday}
          title="Postulé aujourd'hui"
        />
        <Stat
          label="Cette semaine"
          value={stats.thisWeek}
          title="Contactées dans les 7 derniers jours"
        />
        <Stat
          label="Réponses"
          value={stats.responses}
          title="Statut autre que 'Recherche' ou 'Postulé'"
        />
        <Stat
          label="Entretiens"
          value={stats.interviews}
          title="Statut 'Entretien'"
        />
        <Stat
          label="Offres"
          value={stats.offers}
          title="Statut 'Offre' ou 'Accepté'"
        />
        <Stat
          label="Refus"
          value={stats.rejected}
          color="text-red-500"
          title="Statut 'Refusé'"
        />
        <Stat
          label="Taux réponse"
          value={`${stats.responseRate}%`}
          title="Réponses / Contactées"
        />
        <Stat
          label="Délai moy."
          value={`${stats.avgResponseTime}j`}
          title="Délai moyen entre contact et dernière interaction"
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
  title,
}: {
  label: string;
  value: string | number;
  color?: string;
  title?: string;
}) {
  return (
    <div title={title}>
      <div className={`text-xl font-bold ${color ?? ""}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
