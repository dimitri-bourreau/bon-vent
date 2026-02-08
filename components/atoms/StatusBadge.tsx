import { Badge } from "@/components/ui/badge";
import type { CompanyStatus } from "@/features/companies/types/company-status.type";

const STATUS_CONFIG: Record<
  CompanyStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  favorite: { label: "Favori", variant: "secondary" },
  contacted: { label: "Contacté", variant: "default" },
  waiting: { label: "En attente", variant: "outline" },
  follow_up: { label: "À relancer", variant: "destructive" },
};

interface Props {
  status: CompanyStatus;
}

export function StatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
