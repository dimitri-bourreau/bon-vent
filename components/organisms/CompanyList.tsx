"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatRelative } from "@/features/dates/dates";
import { useUpdateCompany } from "@/hooks/use-update-company.hook";
import { useDeleteCompany } from "@/hooks/use-delete-company.hook";
import { useDeleteManyCompanies } from "@/hooks/use-delete-many-companies.hook";
import { useToggleFavorite } from "@/hooks/use-toggle-favorite.hook";
import type { Company } from "@/features/companies/types/company.type";
import type { CreateCompanyDTO } from "@/features/companies/types/create-company-dto.type";

interface Props {
  companies: Company[];
  emptyMessage?: string;
  showBulkActions?: boolean;
  hideStatus?: boolean;
}

interface SortHeaderProps {
  label: string;
  column: string;
  sortKey: string | null;
  sortDir: "asc" | "desc";
  onSort: (key: string) => void;
}

function SortHeader({ label, column, sortKey, sortDir, onSort }: SortHeaderProps) {
  const isActive = sortKey === column;
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 font-medium"
      onClick={() => onSort(column)}
    >
      {label}
      <span className={`ml-1 ${isActive ? "" : "text-muted-foreground/50"}`}>
        {isActive ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
      </span>
    </Button>
  );
}

export function CompanyList({
  companies,
  emptyMessage = "Aucune entreprise",
  showBulkActions = false,
  hideStatus = false,
}: Props) {
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [sortKey, setSortKey] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("companyListSortKey");
  });
  const [sortDir, setSortDir] = useState<"asc" | "desc">(() => {
    if (typeof window === "undefined") return "asc";
    return (localStorage.getItem("companyListSortDir") as "asc" | "desc") ?? "asc";
  });

  useEffect(() => {
    if (sortKey) localStorage.setItem("companyListSortKey", sortKey);
    else localStorage.removeItem("companyListSortKey");
    localStorage.setItem("companyListSortDir", sortDir);
  }, [sortKey, sortDir]);

  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();
  const deleteManyCompanies = useDeleteManyCompanies();
  const toggleFavorite = useToggleFavorite();

  const handleUpdate = (data: CreateCompanyDTO) => {
    if (!editCompany) return;
    updateCompany.mutate({ id: editCompany.id, ...data });
    setEditCompany(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteCompany.mutate(deleteId);
    setDeleteId(null);
  };

  const handleBulkDelete = () => {
    deleteManyCompanies.mutate([...selected]);
    setSelected(new Set());
    setShowBulkDelete(false);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === companies.length) setSelected(new Set());
    else setSelected(new Set(companies.map((c) => c.id)));
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedCompanies = useMemo(() => {
    if (!sortKey) return companies;
    return [...companies].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        cmp = a.name.localeCompare(b.name);
      } else if (sortKey === "stage") {
        cmp = (a.applicationStage ?? "").localeCompare(
          b.applicationStage ?? "",
        );
      } else if (sortKey === "contact") {
        cmp = (a.contactName ?? "").localeCompare(b.contactName ?? "");
      } else if (sortKey === "contactedAt") {
        cmp = (a.contactedAt ?? "").localeCompare(b.contactedAt ?? "");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [companies, sortKey, sortDir]);

  if (companies.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">{emptyMessage}</p>
    );
  }

  return (
    <>
      {showBulkActions && selected.size > 0 && (
        <div className="mb-2 flex items-center gap-2 rounded-md bg-muted p-2">
          <span className="text-sm">{selected.size} sélectionné(s)</span>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowBulkDelete(true)}
          >
            Supprimer
          </Button>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {showBulkActions && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={selected.size === companies.length}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
              )}
              <TableHead className="w-10"></TableHead>
              <TableHead>
                <SortHeader label="Entreprise" column="name" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              </TableHead>
              {!hideStatus && (
                <TableHead>
                  <SortHeader label="Statut" column="stage" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                </TableHead>
              )}
              <TableHead>Catégories</TableHead>
              <TableHead>
                <SortHeader label="Contact" column="contact" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortHeader label="Contacté le" column="contactedAt" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              </TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCompanies.map((company) => (
              <TableRow
                key={company.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setEditCompany(company)}
              >
                {showBulkActions && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.has(company.id)}
                      onCheckedChange={() => toggleSelect(company.id)}
                    />
                  </TableCell>
                )}
                <TableCell onClick={(e) => e.stopPropagation()}>
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
                        onClick={(e) => e.stopPropagation()}
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
                        onClick={(e) => e.stopPropagation()}
                        title="Offre d'emploi"
                      >
                        📋
                      </a>
                    )}
                  </div>
                  {company.note && (
                    <p className="max-w-50 truncate text-xs text-muted-foreground">
                      {company.note}
                    </p>
                  )}
                </TableCell>
                {!hideStatus && (
                  <TableCell>
                    <ApplicationStageBadge stage={company.applicationStage} />
                  </TableCell>
                )}
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
                      onClick={(e) => e.stopPropagation()}
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
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteId(company.id)}
                  >
                    ×
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

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette entreprise ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showBulkDelete} onOpenChange={setShowBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Supprimer {selected.size} entreprise(s) ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
