"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ObjectiveProgress } from "@/components/molecules/ObjectiveProgress";
import { cn } from "@/features/ui/cn";
import { useObjectives } from "@/hooks/use-objectives.hook";
import { useIncrementObjective } from "@/hooks/use-increment-objective.hook";
import { useDecrementObjective } from "@/hooks/use-decrement-objective.hook";
import { useCreateInteraction } from "@/hooks/use-create-interaction.hook";
import type { ObjectiveType } from "@/features/objectives/types/objective-type.type";

export function ObjectiveTracker() {
  const { data: objectives = [] } = useObjectives();
  const incrementObjective = useIncrementObjective();
  const decrementObjective = useDecrementObjective();
  const createInteraction = useCreateInteraction();

  const handleIncrement = async (type: ObjectiveType) => {
    await createInteraction.mutateAsync({ type });
    await incrementObjective.mutateAsync(type);
  };

  const handleDecrement = async (type: ObjectiveType) => {
    await decrementObjective.mutateAsync(type);
  };

  const totalCurrent = objectives.reduce((sum, o) => sum + o.current, 0);
  const totalTarget = objectives.reduce((sum, o) => sum + o.target, 0);
  const percentage =
    totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;
  const isComplete = totalCurrent >= totalTarget && totalTarget > 0;

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>Objectifs quotidiens</span>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                isComplete && "text-success",
              )}
            >
              {percentage}%
            </span>
            <div className="h-6 w-6 rounded-full border-2 border-primary/20 p-0.5">
              <div
                className="h-full w-full rounded-full bg-primary transition-all"
                style={{
                  background: `conic-gradient(var(--primary) ${percentage * 3.6}deg, transparent 0deg)`,
                }}
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {objectives.map((objective) => (
          <ObjectiveProgress
            key={objective.id}
            objective={objective}
            onIncrement={() => handleIncrement(objective.type)}
            onDecrement={() => handleDecrement(objective.type)}
          />
        ))}
        {objectives.length === 0 && (
          <div className="flex items-center justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
