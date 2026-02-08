import { Logo } from "@/components/atoms/Logo";

interface Props {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
}

export function PageHeader({ title, subtitle, showLogo = false }: Props) {
  return (
    <header className="mb-8">
      {showLogo && (
        <div className="mb-4 flex items-center gap-3">
          <Logo size={40} />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Bon vent !
          </span>
        </div>
      )}
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </header>
  );
}
