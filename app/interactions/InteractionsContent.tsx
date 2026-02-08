"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/molecules/PageHeader";
import { useCompanies } from "@/hooks/use-companies.hook";
import { useAddTimelineEvent } from "@/hooks/use-add-timeline-event.hook";
import { formatRelative } from "@/features/dates/dates";
import type { TimelineEventType } from "@/features/companies/types/timeline-event-type.type";

const EVENT_TYPES: { value: TimelineEventType; label: string; icon: string }[] =
  [
    { value: "email_sent", label: "Email envoyé", icon: "📤" },
    { value: "email_received", label: "Email reçu", icon: "📥" },
    { value: "call", label: "Appel", icon: "📞" },
    { value: "interview", label: "Entretien", icon: "🎤" },
    { value: "offer", label: "Offre reçue", icon: "🎁" },
    { value: "note", label: "Note", icon: "📝" },
    { value: "status_change", label: "Changement de statut", icon: "🔄" },
  ];

export function InteractionsContent() {
  const { data: companies = [] } = useCompanies();
  const addEvent = useAddTimelineEvent();

  const [companyId, setCompanyId] = useState("");
  const [type, setType] = useState<TimelineEventType>("email_received");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const allEvents = useMemo(() => {
    const events: {
      companyId: string;
      companyName: string;
      event: {
        id: string;
        type: TimelineEventType;
        date: string;
        content: string;
      };
    }[] = [];

    companies.forEach((c) => {
      c.timeline.forEach((e) => {
        events.push({ companyId: c.id, companyName: c.name, event: e });
      });
    });

    return events.sort(
      (a, b) =>
        new Date(b.event.date).getTime() - new Date(a.event.date).getTime(),
    );
  }, [companies]);

  const getIcon = (t: TimelineEventType) =>
    EVENT_TYPES.find((e) => e.value === t)?.icon ?? "📌";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !content.trim()) return;

    addEvent.mutate({
      companyId,
      type,
      content: content.trim(),
    });

    setContent("");
    setCompanyId("");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <PageHeader
        title="Interactions"
        subtitle="Déclarez vos échanges avec les entreprises"
      />

      <div className="grid min-h-0 flex-1 gap-6 px-8 lg:grid-cols-[400px_1fr]">
        <aside className="flex flex-col gap-4">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-4 font-semibold">Nouvelle interaction</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Entreprise *</Label>
                <Select value={companyId} onValueChange={setCompanyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...companies]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as TimelineEventType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.icon} {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Description *</Label>
                <Input
                  id="content"
                  placeholder="Décrivez l'interaction..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                Ajouter l&apos;interaction
              </Button>
            </form>
          </div>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto">
          <h3 className="font-semibold">Historique global</h3>
          {allEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune interaction enregistrée
            </p>
          ) : (
            <ul className="space-y-2">
              {allEvents.map(({ companyName, event }) => (
                <li
                  key={event.id}
                  className="flex items-start gap-3 rounded-md border bg-card p-3"
                >
                  <span className="text-xl">{getIcon(event.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{companyName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelative(event.date)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {event.content}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
