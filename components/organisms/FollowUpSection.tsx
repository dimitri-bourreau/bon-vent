"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApplicationStageBadge } from "@/components/molecules/ApplicationStageSelect";
import { CompanyForm } from "@/components/organisms/CompanyForm";
import { formatRelative } from "@/features/dates/dates";
import { useOverdue } from "@/hooks/use-overdue.hook";
import { useUpdateCompany } from "@/hooks/use-update-company.hook";
import { useToggleFavorite } from "@/hooks/use-toggle-favorite.hook";
import type { Company } from "@/features/companies/types/company.type";
import type { CreateCompanyDTO } from "@/features/companies/types/create-company-dto.type";

const DELAY_OPTIONS = [
  { value: "7", label: "7 jours" },
  { value: "14", label: "2 semaines" },
  { value: "30", label: "1 mois" },
];

export function FollowUpSection() {
  const [delay, setDelay] = useState(() => {
    if (typeof window === "undefined") return 7;
    const stored = localStorage.getItem("followUpDelay");
    return stored ? parseInt(stored, 10) : 7;
  });
  const [editCompany, setEditCompany] = useState<Company | null>(null);

  const { data: overdue = [] } = useOverdue(delay);
  const updateCompany = useUpdateCompany();
  const toggleFavorite = useToggleFavorite();

  useEffect(() => {
    localStorage.setItem("followUpDelay", delay.toString());
  }, [delay]);

  const handleSkipFollowUp = (companyId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    updateCompany.mutate({ id: companyId, skipFollowUp: true });
  };

  const handleUpdate = (data: CreateCompanyDTO) => {
    if (!editCompany) return;
    updateCompany.mutate({ id: editCompany.id, ...data });
    setEditCompany(null);
  };

  if (overdue.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <span className="h-2 w-2 rounded-full bg-destructive" />A relancer (
          {overdue.length})
        </h2>
        <Select
          value={delay.toString()}
          onValueChange={(value) => setDelay(parseInt(value, 10))}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DELAY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {overdue.map((company) => (
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
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(event) => handleSkipFollowUp(company.id, event)}
                  >
                    Ignorer
                  </Button>
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
