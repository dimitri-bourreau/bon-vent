"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCategories } from "@/hooks/use-categories.hook";
import { useUpdateManyCompanies } from "@/hooks/use-update-many-companies.hook";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onSuccess: () => void;
}

export const BulkEditForm = ({
  open,
  onOpenChange,
  selectedIds,
  onSuccess,
}: Props) => {
  const { data: categories = [] } = useCategories();
  const updateMany = useUpdateManyCompanies();

  const [contactedAt, setContactedAt] = useState("");
  const [updateContactedAt, setUpdateContactedAt] = useState(false);
  const [clearContactedAt, setClearContactedAt] = useState(false);
  const [addCategories, setAddCategories] = useState<string[]>([]);
  const [removeCategories, setRemoveCategories] = useState<string[]>([]);

  const handleSubmit = async (formEvent: React.FormEvent) => {
    formEvent.preventDefault();

    await updateMany.mutateAsync({
      ids: selectedIds,
      contactedAt: updateContactedAt ? contactedAt || undefined : undefined,
      clearContactedAt,
      addCategories: addCategories.length > 0 ? addCategories : undefined,
      removeCategories:
        removeCategories.length > 0 ? removeCategories : undefined,
    });

    setContactedAt("");
    setUpdateContactedAt(false);
    setClearContactedAt(false);
    setAddCategories([]);
    setRemoveCategories([]);
    onSuccess();
    onOpenChange(false);
  };

  const toggleAddCategory = (categoryName: string) => {
    setAddCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName],
    );
    setRemoveCategories((prev) => prev.filter((c) => c !== categoryName));
  };

  const toggleRemoveCategory = (categoryName: string) => {
    setRemoveCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName],
    );
    setAddCategories((prev) => prev.filter((c) => c !== categoryName));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier {selectedIds.length} entreprise(s)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="updateContactedAt"
                checked={updateContactedAt}
                onCheckedChange={(checked) => {
                  setUpdateContactedAt(checked === true);
                  if (checked) setClearContactedAt(false);
                }}
              />
              <Label htmlFor="updateContactedAt">
                Modifier la date de contact
              </Label>
            </div>
            {updateContactedAt && (
              <Input
                type="date"
                value={contactedAt}
                onChange={(inputEvent) =>
                  setContactedAt(inputEvent.target.value)
                }
              />
            )}
            <div className="flex items-center gap-2">
              <Checkbox
                id="clearContactedAt"
                checked={clearContactedAt}
                onCheckedChange={(checked) => {
                  setClearContactedAt(checked === true);
                  if (checked) {
                    setUpdateContactedAt(false);
                    setContactedAt("");
                  }
                }}
              />
              <Label htmlFor="clearContactedAt" className="text-destructive">
                Supprimer la date de contact
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ajouter des catégories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <label
                  key={`add-${cat.id}`}
                  className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted ${
                    addCategories.includes(cat.name)
                      ? "border-green-500 bg-green-50"
                      : ""
                  }`}
                >
                  <Checkbox
                    checked={addCategories.includes(cat.name)}
                    onCheckedChange={() => toggleAddCategory(cat.name)}
                  />
                  + {cat.name}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Retirer des catégories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <label
                  key={`remove-${cat.id}`}
                  className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted ${
                    removeCategories.includes(cat.name)
                      ? "border-red-500 bg-red-50"
                      : ""
                  }`}
                >
                  <Checkbox
                    checked={removeCategories.includes(cat.name)}
                    onCheckedChange={() => toggleRemoveCategory(cat.name)}
                  />
                  - {cat.name}
                </label>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={updateMany.isPending}
          >
            {updateMany.isPending ? "Modification..." : "Appliquer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
