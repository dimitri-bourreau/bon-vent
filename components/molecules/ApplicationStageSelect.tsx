"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApplicationStage } from "@/features/companies/types/application-stage.type";

const STAGES: { value: ApplicationStage; label: string; color: string }[] = [
  { value: "research", label: "Recherche", color: "bg-gray-500" },
  { value: "applied", label: "Postulé", color: "bg-blue-500" },
  { value: "interview", label: "Entretien", color: "bg-purple-500" },
  { value: "offer", label: "Offre", color: "bg-green-500" },
  { value: "accepted", label: "Accepté", color: "bg-emerald-600" },
  { value: "rejected", label: "Refusé", color: "bg-red-500" },
];

interface Props {
  value: ApplicationStage;
  onChange: (stage: ApplicationStage) => void;
}

export function ApplicationStageSelect({ value, onChange }: Props) {
  const current = STAGES.find((s) => s.value === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          <span className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${current?.color}`} />
            {current?.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {STAGES.map((stage) => (
          <SelectItem key={stage.value} value={stage.value}>
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${stage.color}`} />
              {stage.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ApplicationStageBadge({ stage }: { stage: ApplicationStage }) {
  const current = STAGES.find((s) => s.value === stage);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${current?.color} text-white`}
    >
      {current?.label}
    </span>
  );
}
