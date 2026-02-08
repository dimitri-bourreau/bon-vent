"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface Props {
  data: DataPoint[];
  type?: "bar" | "donut";
  title?: string;
}

export function ActivityChart({ data, type = "bar", title = "" }: Props) {
  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.value), 1),
    [data],
  );
  const total = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data],
  );

  const segments = useMemo(() => {
    const result = [];
    let cumulative = 0;
    for (const d of data) {
      const percentage = total > 0 ? (d.value / total) * 100 : 0;
      result.push({
        ...d,
        percentage,
        offset: cumulative,
      });
      cumulative += percentage;
    }
    return result;
  }, [data, total]);

  if (type === "donut") {
    return (
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-secondary"
                />
                {segments.map((segment, i) => (
                  <circle
                    key={i}
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="4"
                    strokeDasharray={`${segment.percentage * 0.88} 88`}
                    strokeDashoffset={`${-segment.offset * 0.88}`}
                    className="transition-all duration-500"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{total}</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {data.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="text-muted-foreground">{d.label}</span>
                  </div>
                  <span className="font-medium tabular-nums">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((d, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{d.label}</span>
              <span className="font-medium tabular-nums">{d.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(d.value / maxValue) * 100}%`,
                  backgroundColor: d.color,
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
