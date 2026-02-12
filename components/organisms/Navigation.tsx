"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { NavIcon } from "@/components/atoms/NavIcon";
import { cn } from "@/features/ui/cn";
import { exportAllData, importAllData } from "@/features/db/export";
import { useCompanies } from "@/hooks/use-companies.hook";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Tableau de bord",
    shortLabel: "Accueil",
    icon: "home" as const,
  },
  {
    href: "/contacts",
    label: "Entreprises",
    shortLabel: "Entreprises",
    icon: "users" as const,
  },
  {
    href: "/interactions",
    label: "Interactions",
    shortLabel: "Interactions",
    icon: "message" as const,
  },
  {
    href: "/github",
    label: "GitHub Issues",
    shortLabel: "GitHub",
    icon: "github" as const,
  },
];

export function Navigation() {
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { data: companies = [] } = useCompanies();

  const handleExport = async () => {
    const data = await exportAllData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bon-vent-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    await importAllData(text);
    queryClient.invalidateQueries();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 items-center justify-between px-2 sm:px-4">
        <div className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const count = item.href === "/contacts" ? companies.length : null;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1 sm:gap-2 rounded-xl px-2 sm:px-4 py-2 transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <NavIcon
                  icon={item.icon}
                  className={cn("h-5 w-5 shrink-0", isActive && "stroke-2")}
                />
                <span className="hidden text-sm font-medium sm:inline">
                  {item.label}
                  {count !== null && count > 0 && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({count})
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1 sm:gap-2 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Exporter"
          >
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span className="hidden text-sm sm:inline">Exporter</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 sm:gap-2 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Importer"
          >
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span className="hidden text-sm sm:inline">Importer</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <span
            className="hidden text-xs text-muted-foreground/60 md:inline"
            title="Aucune donnée collectée. Tout reste sur votre appareil."
          >
            Toutes les données sont stockées localement
          </span>
        </div>
      </div>
    </nav>
  );
}
