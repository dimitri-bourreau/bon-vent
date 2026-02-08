"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useZones, useCreateZone } from "@/features/zones/hooks/useZones";
import type {
  Company,
  CreateCompanyDTO,
} from "@/features/companies/domain/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateCompanyDTO) => void;
  initialData?: Company;
}

const getInitialFormData = (data?: Company): CreateCompanyDTO => ({
  name: data?.name ?? "",
  categories: data?.categories ?? [],
  website: data?.website ?? "",
  contactEmail: data?.contactEmail ?? "",
  contactName: data?.contactName ?? "",
  note: data?.note ?? "",
  isFavorite: data?.isFavorite ?? false,
  contactedAt: data?.contactedAt ?? "",
});

export function CompanyForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: Props) {
  const { data: categories = [] } = useZones();
  const createCategory = useCreateZone();
  const [newCategory, setNewCategory] = useState("");
  const [formData, setFormData] = useState<CreateCompanyDTO>(
    getInitialFormData(initialData),
  );

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(initialData));
      setNewCategory("");
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  const handleAddCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;
    await createCategory.mutateAsync({ name });
    setFormData((prev) => ({ ...prev, categories: [...prev.categories, name] }));
    setNewCategory("");
  };

  const toggleCategory = (categoryName: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryName)
        ? prev.categories.filter((c) => c !== categoryName)
        : [...prev.categories, categoryName],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier" : "Ajouter"} une entreprise
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Catégories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm cursor-pointer hover:bg-muted"
                >
                  <Checkbox
                    checked={formData.categories.includes(cat.name)}
                    onCheckedChange={() => toggleCategory(cat.name)}
                  />
                  {cat.name}
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Nouvelle catégorie"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button type="button" variant="outline" onClick={handleAddCategory}>
                +
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactName">Nom du contact</Label>
            <Input
              id="contactName"
              value={formData.contactName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactName: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactEmail: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Site web</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, website: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, note: e.target.value }))
              }
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactedAt">Date de contact</Label>
            <Input
              id="contactedAt"
              type="date"
              value={
                formData.contactedAt ? formData.contactedAt.split("T")[0] : ""
              }
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  contactedAt: value ? new Date(value).toISOString() : "",
                  status: value ? "waiting" : prev.status,
                }));
              }}
            />
          </div>
          <Button type="submit" className="w-full">
            {initialData ? "Modifier" : "Ajouter"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
