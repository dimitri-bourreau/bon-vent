"use client";

import { useQueryState } from "nuqs";
import { cn } from "@/features/ui/cn";
import { useZones } from "@/features/zones/hooks/useZones";

interface Props {
  onZoneChange?: (zone: string | null) => void;
}

export function ZoneTabs({ onZoneChange }: Props) {
  const { data: zones = [] } = useZones();
  const [zone, setZone] = useQueryState("zone");

  const handleChange = (value: string) => {
    const newZone = value === "all" ? null : value;
    setZone(newZone);
    onZoneChange?.(newZone);
  };

  if (zones.length === 0) return null;

  const allZones = [{ id: "all", name: "Toutes" }, ...zones];

  return (
    <div className="flex flex-wrap gap-2">
      {allZones.map((z) => {
        const isActive = (z.id === "all" && !zone) || z.name === zone;
        return (
          <button
            key={z.id}
            onClick={() => handleChange(z.id === "all" ? "all" : z.name)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {z.name}
          </button>
        );
      })}
    </div>
  );
}
