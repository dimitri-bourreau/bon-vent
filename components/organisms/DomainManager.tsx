"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  useDomains,
  useCreateDomain,
  useDeleteDomain,
} from "@/features/domains/hooks/useDomains";

export function DomainManager() {
  const [newDomain, setNewDomain] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: domains = [] } = useDomains();
  const createDomain = useCreateDomain();
  const deleteDomain = useDeleteDomain();

  const handleAdd = () => {
    if (!newDomain.trim()) return;
    createDomain.mutate({ name: newDomain.trim() });
    setNewDomain("");
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteDomain.mutate(deleteId);
    setDeleteId(null);
  };

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Domaines favoris</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ex: Aviation, Animaux..."
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="h-9"
          />
          <Button onClick={handleAdd} size="sm" className="h-9 shrink-0">
            Ajouter
          </Button>
        </div>

        {domains.length === 0 ? (
          <p className="py-2 text-center text-sm text-muted-foreground">
            Ajoutez les domaines qui vous passionnent
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className="group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
                style={{
                  backgroundColor: `${domain.color}20`,
                  color: domain.color,
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: domain.color }}
                />
                {domain.name}
                <button
                  onClick={() => setDeleteId(domain.id)}
                  className="ml-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce domaine ?</AlertDialogTitle>
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
    </Card>
  );
}
