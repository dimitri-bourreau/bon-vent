"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { formatRelative } from "@/features/dates/dates";
import type { Company } from "@/features/companies/domain/types";

interface Props {
  company: Company;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
  showActions?: boolean;
}

export function CompanyCard({
  company,
  onEdit,
  onDelete,
  onToggleFavorite,
  showActions = true,
}: Props) {
  return (
    <Card className="group overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">
              {company.name}
            </h3>
            {company.categories.length > 0 && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {company.categories.join(", ")}
              </p>
            )}
          </div>
          <StatusBadge status={company.status} />
        </div>

        <div className="mt-3 space-y-1.5">
          {company.contactName && (
            <p className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Contact:</span>
              <span className="truncate">{company.contactName}</span>
            </p>
          )}
          {company.contactEmail && (
            <p className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Email:</span>
              <span className="truncate text-primary">
                {company.contactEmail}
              </span>
            </p>
          )}
        </div>

        {company.note && (
          <p className="mt-3 rounded-md bg-muted/50 p-2 text-sm italic text-muted-foreground">
            {company.note}
          </p>
        )}

        {company.contactedAt && (
          <p className="mt-3 text-xs text-muted-foreground">
            Contacté {formatRelative(company.contactedAt)}
          </p>
        )}

        {showActions && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-border/50 pt-3">
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFavorite}
                className="h-8 w-8 p-0"
              >
                <span
                  className={
                    company.isFavorite
                      ? "text-warning"
                      : "text-muted-foreground"
                  }
                >
                  {company.isFavorite ? "★" : "☆"}
                </span>
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={onEdit}
              >
                Modifier
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={onDelete}
              >
                Supprimer
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
