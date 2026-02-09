"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

  const { data: awaiting = [] } = useAwaitingResponse();
  const updateCompany = useUpdateCompany();
  const toggleFavorite = useToggleFavorite();

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
              <TableHead>Entreprise</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Catégories</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Candidature</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {awaiting.map((company) => (
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
