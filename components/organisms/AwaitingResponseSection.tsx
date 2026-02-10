"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortHeader } from "@/components/atoms/SortHeader";
import { CompanyForm } from "@/components/organisms/CompanyForm";
import { ApplicationStageBadge } from "@/components/molecules/ApplicationStageSelect";
import { formatRelative } from "@/features/dates/dates";
import { useAwaitingResponse } from "@/hooks/use-awaiting-response.hook";
import { useUpdateCompany } from "@/hooks/use-update-company.hook";
import { useToggleFavorite } from "@/hooks/use-toggle-favorite.hook";
import type { Company } from "@/features/companies/types/company.type";
import type { CreateCompanyDTO } from "@/features/companies/types/create-company-dto.type";

export function AwaitingResponseSection() {
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("awaitingSortKey");
  });
  const [sortDir, setSortDir] = useState<"asc" | "desc">(() => {
    if (typeof window === "undefined") return "asc";
    return (localStorage.getItem("awaitingSortDir") as "asc" | "desc") ?? "asc";
  });

  const { data: awaiting = [] } = useAwaitingResponse();
  const updateCompany = useUpdateCompany();
  const toggleFavorite = useToggleFavorite();

  useEffect(() => {
    if (sortKey) localStorage.setItem("awaitingSortKey", sortKey);
    else localStorage.removeItem("awaitingSortKey");
    localStorage.setItem("awaitingSortDir", sortDir);
  }, [sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedAwaiting = useMemo(() => {
    if (!sortKey) return awaiting;
    return [...awaiting].sort((companyA, companyB) => {
      let comparison = 0;
      if (sortKey === "name") {
        comparison = companyA.name.localeCompare(companyB.name);
      } else if (sortKey === "stage") {
        comparison = (companyA.applicationStage ?? "").localeCompare(
          companyB.applicationStage ?? "",
        );
      } else if (sortKey === "contact") {
        comparison = (companyA.contactName ?? "").localeCompare(
          companyB.contactName ?? "",
        );
      } else if (sortKey === "contactedAt") {
        comparison = (companyA.contactedAt ?? "").localeCompare(
          companyB.contactedAt ?? "",
        );
      }
      return sortDir === "asc" ? comparison : -comparison;
    });
  }, [awaiting, sortKey, sortDir]);

  const handleUpdate = (data: CreateCompanyDTO) => {
    if (!editCompany) return;
    updateCompany.mutate({ id: editCompany.id, ...data });
    setEditCompany(null);
  };

  if (awaiting.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <span className="h-2 w-2 rounded-full bg-blue-500" />
        En attente de réponse ({awaiting.length})
      </h2>

      <div className="overflow-hidden rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>
                <SortHeader
                  label="Entreprise"
                  column="name"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead>
                <SortHeader
                  label="Statut"
                  column="stage"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead>Catégories</TableHead>
              <TableHead>
                <SortHeader
                  label="Contact"
                  column="contact"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead>
                <SortHeader
                  label="Candidature"
                  column="contactedAt"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAwaiting.map((company) => (
              <TableRow
                key={company.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setEditCompany(company)}
              >
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <button
                    onClick={() => toggleFavorite.mutate(company.id)}
                    className={`text-lg ${company.isFavorite ? "text-yellow-500" : "text-muted-foreground"}`}
                  >
                    {company.isFavorite ? "★" : "☆"}
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{company.name}</span>
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                        onClick={(event) => event.stopPropagation()}
                        title="Site web"
                      >
                        ↗
                      </a>
                    )}
                    {company.jobUrl && (
                      <a
                        href={company.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-600 hover:underline"
                        onClick={(event) => event.stopPropagation()}
                        title="Offre d'emploi"
                      >
                        📋
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <ApplicationStageBadge stage={company.applicationStage} />
                </TableCell>
                <TableCell className="text-sm">
                  {company.categories.length > 0
                    ? company.categories.join(", ")
                    : "-"}
                </TableCell>
                <TableCell>
                  {company.contactName && (
                    <div className="text-sm">{company.contactName}</div>
                  )}
                  {company.contactEmail && (
                    <a
                      href={`mailto:${company.contactEmail}`}
                      className="text-xs text-primary hover:underline"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {company.contactEmail}
                    </a>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {company.contactedAt
                    ? formatRelative(company.contactedAt)
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CompanyForm
        open={!!editCompany}
        onOpenChange={(open) => !open && setEditCompany(null)}
        onSubmit={handleUpdate}
        initialData={editCompany ?? undefined}
      />
    </section>
  );
}
