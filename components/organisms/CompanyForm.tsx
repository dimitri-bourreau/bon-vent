"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  zone: data?.zone ?? "",
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
  const { data: zones = [] } = useZones();
  const createZone = useCreateZone();
  const [newZone, setNewZone] = useState("");
  const [formData, setFormData] = useState<CreateCompanyDTO>(
    getInitialFormData(initialData),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  const handleAddZone = async () => {
    const zoneName = newZone.trim();
    if (!zoneName) return;
    await createZone.mutateAsync({ name: zoneName });
    setFormData((prev) => ({ ...prev, zone: zoneName }));
    setNewZone("");
  };

  return (
    <Dialog
      key={`${open}-${initialData?.id}`}
      open={open}
      onOpenChange={onOpenChange}
    >
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
            <Label htmlFor="zone">Zone géographique *</Label>
            <Select
              value={formData.zone}
              onValueChange={(v) =>
                setFormData((prev) => ({ ...prev, zone: v }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une zone" />
              </SelectTrigger>
              <SelectContent>
                {zones.map((z) => (
                  <SelectItem key={z.id} value={z.name}>
                    {z.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input
                placeholder="Nouvelle zone"
                value={newZone}
                onChange={(e) => setNewZone(e.target.value)}
              />
              <Button type="button" variant="outline" onClick={handleAddZone}>
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
