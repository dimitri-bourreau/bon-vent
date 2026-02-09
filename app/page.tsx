"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/molecules/PageHeader";
import { SearchBar } from "@/components/molecules/SearchBar";
import { ActivityChart } from "@/components/molecules/ActivityChart";
import { CompanyList } from "@/components/organisms/CompanyList";
import { CompanyForm } from "@/components/organisms/CompanyForm";
import { CategoryManager } from "@/components/organisms/CategoryManager";
import { StatsOverview } from "@/components/organisms/StatsOverview";
import { CalendarView } from "@/components/organisms/CalendarView";
import { useCompanies } from "@/hooks/use-companies.hook";
import { useOverdue } from "@/hooks/use-overdue.hook";
import { useUpdateCompany } from "@/hooks/use-update-company.hook";
import { useCategories } from "@/hooks/use-categories.hook";
import type { Company } from "@/features/companies/types/company.type";
import type { CreateCompanyDTO } from "@/features/companies/types/create-company-dto.type";

export default function HomePage() {
  const { data: companies = [] } = useCompanies();
  const { data: overdue = [] } = useOverdue();
  const { data: categories = [] } = useCategories();
  const updateCompany = useUpdateCompany();

  const [editCompany, setEditCompany] = useState<Company | null>(null);

  const categoryData = useMemo(() => {
    const colors = ["#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ec4899"];
    return categories.slice(0, 5).map((cat, i) => ({
      label: cat.name,
      value: companies.filter((c) => c.categories.includes(cat.name)).length,
      color: colors[i % colors.length],
    }));
  }, [categories, companies]);

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
