import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/features/ui/cn";

type Variant = "default" | "primary" | "success" | "warning" | "danger";

interface Props {
  title: string;
  value: number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  default: "bg-card border-border",
  primary: "bg-primary/5 border-primary/20",
  success: "bg-success/5 border-success/20",
  warning: "bg-warning/5 border-warning/20",
  danger: "bg-destructive/5 border-destructive/20",
};

const valueStyles: Record<Variant, string> = {
  default: "text-foreground",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
}: Props) {
  return (
    <Card className={cn("border", variantStyles[variant])}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <p
              className={cn(
                "mt-1 text-2xl font-bold tabular-nums",
                valueStyles[variant],
              )}
            >
              {value}
            </p>
            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          {icon && (
            <div className={cn("shrink-0 text-2xl", valueStyles[variant])}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
