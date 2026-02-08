"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CompanyForm } from "@/components/organisms/CompanyForm";
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
import {
  useUpdateCompany,
  useDeleteCompany,
  useToggleFavorite,
} from "@/features/companies/hooks/useCompanies";
import type {
  Company,
  CreateCompanyDTO,
} from "@/features/companies/domain/types";

interface Props {
  companies: Company[];
  emptyMessage?: string;
}

export function CompanyList({
  companies,
  emptyMessage = "Aucune entreprise",
}: Props) {
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();
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

  if (companies.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">{emptyMessage}</p>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Catégories</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Contacté le</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow
                key={company.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setEditCompany(company)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleFavorite.mutate(company.id)}
                    className="text-lg"
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
                      >
                        ↗
                      </a>
                    )}
                  </div>
                  {company.note && (
                    <p className="text-xs text-muted-foreground truncate max-w-50">
                      {company.note}
                    </p>
                  )}
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
    </>
  );
}
