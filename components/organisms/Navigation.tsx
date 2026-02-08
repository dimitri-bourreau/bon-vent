"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/atoms/NavIcon";
import { cn } from "@/features/ui/cn";

const NAV_ITEMS = [
  { href: "/", label: "Accueil", icon: "home" as const },
  { href: "/favoris", label: "Favoris", icon: "heart" as const },
  { href: "/contacts", label: "Contacts", icon: "users" as const },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-6">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <NavIcon
                icon={item.icon}
                className={cn("h-6 w-6", isActive && "stroke-2")}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
