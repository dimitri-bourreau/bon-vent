"use client";

import { Button } from "@/components/ui/button";
import type { Objective } from "@/features/objectives/types/objective.type";
import type { ObjectiveType } from "@/features/objectives/types/objective-type.type";
import { cn } from "@/features/ui/cn";

const TYPE_CONFIG: Record<
  ObjectiveType,
  { label: string; emoji: string; color: string }
> = {
  comment: { label: "Commentaires", emoji: "💬", color: "bg-chart-1" },
  contact: { label: "Contacts", emoji: "🤝", color: "bg-chart-2" },
  message: { label: "Messages", emoji: "✉️", color: "bg-chart-3" },
};

interface Props {
  objective: Objective;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function ObjectiveProgress({
  objective,
  onIncrement,
  onDecrement,
}: Props) {
  const percentage = Math.min(
    (objective.current / objective.target) * 100,
    100,
  );
  const isComplete = objective.current >= objective.target;
  const config = TYPE_CONFIG[objective.type];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{config.emoji}</span>
          <span className="text-sm font-medium">{config.label}</span>
        </div>
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            isComplete && "text-success",
          )}
        >
          {objective.current}/{objective.target}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isComplete ? "bg-success" : config.color,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex-1 text-xs"
          onClick={onDecrement}
          disabled={objective.current === 0}
        >
          -1
        </Button>
        <Button
          variant={isComplete ? "secondary" : "outline"}
          size="sm"
          className="h-8 flex-1 text-xs"
          onClick={onIncrement}
        >
          {isComplete ? "✓" : "+1"}
        </Button>
      </div>
    </div>
  );
}
