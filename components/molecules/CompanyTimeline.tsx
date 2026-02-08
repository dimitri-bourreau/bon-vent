"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRelative } from "@/features/dates/dates";
import { useAddTimelineEvent } from "@/features/companies/hooks/useCompanies";
import type {
  TimelineEvent,
  TimelineEventType,
} from "@/features/companies/domain/types";

const EVENT_TYPES: { value: TimelineEventType; label: string; icon: string }[] =
  [
    { value: "note", label: "Note", icon: "📝" },
    { value: "email_sent", label: "Email envoyé", icon: "📤" },
    { value: "email_received", label: "Email reçu", icon: "📥" },
    { value: "call", label: "Appel", icon: "📞" },
    { value: "interview", label: "Entretien", icon: "🎤" },
    { value: "offer", label: "Offre", icon: "🎁" },
    { value: "status_change", label: "Changement", icon: "🔄" },
  ];

interface Props {
  companyId: string;
  events: TimelineEvent[];
}

export function CompanyTimeline({ companyId, events }: Props) {
  const [type, setType] = useState<TimelineEventType>("note");
  const [content, setContent] = useState("");
  const addEvent = useAddTimelineEvent();

  const handleAdd = () => {
    if (!content.trim()) return;
    addEvent.mutate({ companyId, type, content: content.trim() });
    setContent("");
  };

  const getIcon = (t: TimelineEventType) =>
    EVENT_TYPES.find((e) => e.value === t)?.icon ?? "📌";

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Historique</h4>

      <div className="flex gap-2">
        <Select
          value={type}
          onValueChange={(v) => setType(v as TimelineEventType)}
        >
          <SelectTrigger className="w-35">
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
        <Input
          placeholder="Ajouter une note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
          className="flex-1"
        />
        <Button type="button" size="sm" onClick={handleAdd}>
          +
        </Button>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun historique</p>
      ) : (
        <ul className="space-y-2">
          {[...events].reverse().map((event) => (
            <li
              key={event.id}
              className="flex items-start gap-2 rounded-md bg-muted/50 p-2 text-sm"
            >
              <span>{getIcon(event.type)}</span>
              <div className="flex-1">
                <p>{event.content}</p>
                <p className="text-xs text-muted-foreground">
                  {formatRelative(event.date)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
