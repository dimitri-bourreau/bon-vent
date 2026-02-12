import { Logo } from "@/components/atoms/Logo";

interface Props {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: Props) {
  return (
    <header className="relative w-full bg-gradient-to-r from-background via-chart-2/5 to-primary/50 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/2 h-px w-32 -translate-y-1/2 animate-[wind_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute left-1/4 top-1/3 h-px w-24 animate-[wind_4s_ease-in-out_infinite_0.5s] bg-gradient-to-r from-transparent via-chart-2/25 to-transparent" />
        <div className="absolute left-1/2 top-2/3 h-px w-20 animate-[wind_3.5s_ease-in-out_infinite_1s] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute left-1/3 top-1/4 h-px w-16 animate-[wind_5s_ease-in-out_infinite_1.5s] bg-gradient-to-r from-transparent via-chart-2/30 to-transparent" />
        <div className="absolute left-2/3 top-3/4 h-px w-28 animate-[wind_4.5s_ease-in-out_infinite_0.3s] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      </div>
      <div className="relative z-10 flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Bon vent !
          </span>
        </div>
        {title && (
          <div className="border-l border-border/50 pl-6">
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
        {children && <div className="ml-auto">{children}</div>}
      </div>
    </header>
  );
}
